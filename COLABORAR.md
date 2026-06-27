# Como trabalhar os dois no site MEAN

O código vive no GitHub: **https://github.com/mvrcosilva11/mean-website**
O site publicado: **https://mvrcosilva11.github.io/mean-website/** (atualiza ~1-2 min depois de cada push)

## Primeira vez (só uma vez por PC)

O sócio, no PC dele, abre o terminal e faz:

```bash
git clone https://github.com/mvrcosilva11/mean-website.git
cd mean-website
```

Agora tem a pasta com o site. Pode abrir o Claude Code aqui dentro.

## Rotina de cada dia

1. **Antes de editar** — puxar o trabalho do outro:
   ```bash
   git pull
   ```

2. **Editar** — à mão ou pedindo ao Claude Code.

3. **Enviar as alterações:**
   ```bash
   git add -A
   git commit -m "o que mudei"
   git push
   ```

4. O site online atualiza-se sozinho ~1-2 min depois.

## Regra de ouro

Faz **sempre `git pull` antes de começar** a trabalhar. Assim evitam mexer
no mesmo sítio ao mesmo tempo. Se os dois editarem o mesmo ficheiro em
simultâneo, o git avisa (conflito) — nessa altura é só pedir ao Claude para resolver.

> Não é simultâneo ao segundo (não é Google Docs), mas para um site funciona
> perfeitamente para 2 pessoas.
