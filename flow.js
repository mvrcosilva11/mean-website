// ============================================================
//  MEAN — Distorção "flowmap" (rasto líquido) sobre o vídeo.
//  Estilo Eva Sanchez: o cursor deixa um rasto de distorção na
//  direção do movimento, que desvanece suavemente. WebGL próprio.
//  Fallback: sem WebGL/float → não faz nada, fica o <video>.
// ============================================================
(function () {
  const canvas = document.getElementById('flowCanvas');
  const video  = document.querySelector('.home-bg');
  if (!canvas || !video) return;

  function dbg(m){ if (window.console && console.warn) console.warn('[flow] ' + m); }

  const gl = canvas.getContext('webgl', { premultipliedAlpha: false, antialias: false });
  if (!gl) { dbg('FALHOU: o browser nao deu contexto WebGL'); return; }

  const floatExt = gl.getExtension('OES_texture_float');
  const hfExt    = gl.getExtension('OES_texture_half_float');
  let TEX_TYPE = null;
  if (floatExt) TEX_TYPE = gl.FLOAT;
  else if (hfExt) TEX_TYPE = hfExt.HALF_FLOAT_OES;
  if (!TEX_TYPE) { dbg('FALHOU: sem texturas float (OES_texture_float). Este Safari nao suporta.'); return; }

  // filtrar texturas float em LINEAR só funciona com esta extensão; senão NEAREST
  const floatLinear = gl.getExtension('OES_texture_float_linear') || gl.getExtension('OES_texture_half_float_linear');
  const SIM_FILTER = floatLinear ? gl.LINEAR : gl.NEAREST;

  const VERT = `
    attribute vec2 a_pos; varying vec2 v_uv;
    void main(){ v_uv = a_pos*0.5+0.5; gl_Position = vec4(a_pos,0.0,1.0); }
  `;

  // actualiza o flowmap: desvanece + carimba a velocidade do cursor
  const FLOW = `
    precision highp float;
    varying vec2 v_uv;
    uniform sampler2D u_prev;
    uniform vec2  u_mouse;   // posicao (uv)
    uniform vec2  u_vel;     // velocidade (uv/frame)
    uniform float u_force;   // intensidade do carimbo
    uniform float u_radius;
    uniform float u_decay;
    uniform float u_aspect;
    void main(){
      vec2 flow = texture2D(u_prev, v_uv).xy * u_decay;
      vec2 m = v_uv - u_mouse; m.x *= u_aspect;
      float fall = smoothstep(u_radius, 0.0, length(m));
      flow += u_vel * u_force * fall;
      flow = clamp(flow, -1.0, 1.0);
      gl_FragColor = vec4(flow, 0.0, 1.0);
    }
  `;

  // render: desloca os UV do vídeo E da wordmark pelo flowmap
  const REND = `
    precision highp float;
    varying vec2 v_uv;
    uniform sampler2D u_flow;
    uniform sampler2D u_video;
    uniform sampler2D u_word;
    uniform float u_strength;
    uniform vec2  u_uvScale;
    uniform vec2  u_uvOffset;
    uniform vec2  u_wmScale;   // fracao ocupada pela wordmark (contain)
    void main(){
      vec2 flow = texture2D(u_flow, v_uv).xy;
      vec2 disp = flow * u_strength;
      // video (cover)
      vec2 vuv = u_uvOffset + v_uv * u_uvScale + disp;
      vec3 col = texture2D(u_video, vuv).rgb;
      col += (flow.x - flow.y) * 0.18;   // brilho subtil no rasto
      // wordmark (contain) com a mesma distorcao
      vec2 sp = v_uv + disp;
      vec2 wuv = (sp - 0.5) / u_wmScale + 0.5;
      vec4 w = texture2D(u_word, wuv);
      float inside = step(0.0, wuv.x) * step(wuv.x, 1.0) * step(0.0, wuv.y) * step(wuv.y, 1.0);
      col = mix(col, w.rgb, w.a * inside);
      gl_FragColor = vec4(col, 1.0);
    }
  `;

  function compile(t, s){ const sh=gl.createShader(t); gl.shaderSource(sh,s); gl.compileShader(sh);
    if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS)){ dbg('SHADER nao compila: '+gl.getShaderInfoLog(sh)); return null;} return sh; }
  function prog(vs,fs){ const v=compile(gl.VERTEX_SHADER,vs),f=compile(gl.FRAGMENT_SHADER,fs); if(!v||!f) return null;
    const p=gl.createProgram(); gl.attachShader(p,v); gl.attachShader(p,f); gl.linkProgram(p);
    if(!gl.getProgramParameter(p,gl.LINK_STATUS)){ console.warn(gl.getProgramInfoLog(p)); return null;} return p; }

  const flowProg = prog(VERT, FLOW), rendProg = prog(VERT, REND);
  if (!flowProg || !rendProg) { dbg('FALHOU: programa de shaders nao linkou (ver acima)'); return; }

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
  function bindQuad(p){ const l=gl.getAttribLocation(p,'a_pos'); gl.bindBuffer(gl.ARRAY_BUFFER,quad);
    gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l,2,gl.FLOAT,false,0,0); }

  let FW=0, FH=0, texA, texB, fboA, fboB;
  function mkTex(w,h){ const t=gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D,t);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,w,h,0,gl.RGBA,TEX_TYPE,null);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,SIM_FILTER);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,SIM_FILTER);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE); return t; }
  function mkFBO(t){ const f=gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER,f);
    gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,t,0); return f; }
  function initFlow(w,h){ FW=w; FH=h;
    texA=mkTex(w,h); fboA=mkFBO(texA); texB=mkTex(w,h); fboB=mkFBO(texB);
    [fboA,fboB].forEach(f=>{ gl.bindFramebuffer(gl.FRAMEBUFFER,f); gl.clearColor(0,0,0,1); gl.clear(gl.COLOR_BUFFER_BIT); });
    gl.bindFramebuffer(gl.FRAMEBUFFER,fboA);
    return gl.checkFramebufferStatus(gl.FRAMEBUFFER)===gl.FRAMEBUFFER_COMPLETE; }

  const vidTex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, vidTex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);

  // textura da wordmark (composição branca)
  const comp = document.querySelector('.home-comp');
  const wordTex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, wordTex);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([0,0,0,0]));
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  let wordImg=null, wordReady=false;
  (function loadWord(){
    const img=new Image();
    img.onload=function(){
      wordImg=img; wordReady=true;
      gl.bindTexture(gl.TEXTURE_2D,wordTex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);
      cover();
    };
    img.src = (comp && comp.getAttribute('src')) || 'assets/corner-homepage-white.png?v=5';
  })();

  let uvScale=[1,1], uvOffset=[0,0], wmScale=[1,1];
  function cover(){ const vw=video.videoWidth||16, vh=video.videoHeight||9;
    const vidA=vw/vh, canA=canvas.width/canvas.height;
    if(canA>vidA){ const f=vidA/canA; uvScale=[1,f]; uvOffset=[0,(1-f)/2]; }
    else { const f=canA/vidA; uvScale=[f,1]; uvOffset=[(1-f)/2,0]; }
    // wordmark em "contain": imagem inteira visível, centrada
    const iw=(wordImg&&wordImg.width)||16, ih=(wordImg&&wordImg.height)||9;
    const imgA=iw/ih;
    if(canA>imgA){ wmScale=[imgA/canA, 1]; } else { wmScale=[1, canA/imgA]; } }
  function resize(){ const DPR=Math.min(window.devicePixelRatio||1,2);
    const w=Math.round(canvas.clientWidth*DPR), h=Math.round(canvas.clientHeight*DPR);
    if(!w||!h) return; canvas.width=w; canvas.height=h;
    initFlow(Math.min(Math.round(w/2),720), Math.min(Math.round(h/2),420)); cover(); }

  // input — posição + velocidade do cursor
  let mouse=[0.5,0.5], vel=[0,0], force=0, last=null;
  const home=document.querySelector('.home');
  function onMove(e){ const r=canvas.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width, y=1.0-(e.clientY-r.top)/r.height;
    if(last){ vel=[(x-last[0]),(y-last[1])]; }
    last=[x,y]; mouse=[x,y]; force=1.0; }
  window.addEventListener('mousemove',onMove);
  window.addEventListener('mouseleave',()=>{ force=0; last=null; });

  const uF={ prev:gl.getUniformLocation(flowProg,'u_prev'), mouse:gl.getUniformLocation(flowProg,'u_mouse'),
    vel:gl.getUniformLocation(flowProg,'u_vel'), force:gl.getUniformLocation(flowProg,'u_force'),
    radius:gl.getUniformLocation(flowProg,'u_radius'), decay:gl.getUniformLocation(flowProg,'u_decay'),
    aspect:gl.getUniformLocation(flowProg,'u_aspect') };
  const uR={ flow:gl.getUniformLocation(rendProg,'u_flow'), video:gl.getUniformLocation(rendProg,'u_video'),
    word:gl.getUniformLocation(rendProg,'u_word'),
    strength:gl.getUniformLocation(rendProg,'u_strength'), uvScale:gl.getUniformLocation(rendProg,'u_uvScale'),
    uvOffset:gl.getUniformLocation(rendProg,'u_uvOffset'), wmScale:gl.getUniformLocation(rendProg,'u_wmScale') };

  function step(){
    gl.bindFramebuffer(gl.FRAMEBUFFER,fboB); gl.viewport(0,0,FW,FH);
    gl.useProgram(flowProg); bindQuad(flowProg);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D,texA); gl.uniform1i(uF.prev,0);
    gl.uniform2f(uF.mouse,mouse[0],mouse[1]);
    gl.uniform2f(uF.vel, vel[0]*30.0, vel[1]*30.0); // amplifica a velocidade p/ rasto visível
    gl.uniform1f(uF.force,force);
    gl.uniform1f(uF.radius,0.11);
    gl.uniform1f(uF.decay,0.965);
    gl.uniform1f(uF.aspect,FW/FH);
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    force=0; vel=[0,0];
    let t=texA; texA=texB; texB=t; let f=fboA; fboA=fboB; fboB=f;
  }
  function render(){
    gl.bindFramebuffer(gl.FRAMEBUFFER,null); gl.viewport(0,0,canvas.width,canvas.height);
    gl.useProgram(rendProg); bindQuad(rendProg);
    if(video.readyState>=2){ gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D,vidTex);
      try{ gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,video);}catch(e){} }
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D,texA); gl.uniform1i(uR.flow,0);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D,vidTex); gl.uniform1i(uR.video,1);
    gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D,wordTex); gl.uniform1i(uR.word,2);
    gl.uniform1f(uR.strength,0.28);
    gl.uniform2f(uR.uvScale,uvScale[0],uvScale[1]);
    gl.uniform2f(uR.uvOffset,uvOffset[0],uvOffset[1]);
    gl.uniform2f(uR.wmScale,wmScale[0],wmScale[1]);
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
  }

  let running=false;
  function frame(){ if(!running) return; step(); render(); requestAnimationFrame(frame); }
  function start(){ if(running) return; resize();
    if(!FW){ dbg('FALHOU: framebuffer/simulacao nao inicializou (FW=0)'); return; }
    canvas.classList.add('ready');
    if(comp) comp.style.opacity='0';   // o canvas passa a desenhar a wordmark
    running=true; dbg('OK: a correr (mexe o rato). SIM '+FW+'x'+FH+', canvas '+canvas.width+'x'+canvas.height);
    requestAnimationFrame(frame); }

  window.addEventListener('resize',()=>{ if(running) resize(); });
  if(video.readyState>=2) start(); else video.addEventListener('loadeddata',start,{once:true});
  video.addEventListener('loadedmetadata',cover,{once:true});
})();
