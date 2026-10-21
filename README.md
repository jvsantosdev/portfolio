# Portfólio — João Vítor Santos de Oliveira

Portfólio pessoal de dev full-stack, feito **só com HTML, CSS e JavaScript puro** — sem build, sem dependências, sem framework.

## Arquivos

```
portfolio/
├── index.html   → todo o conteúdo (textos em PT e EN no mesmo arquivo)
├── styles.css   → design system + layout
├── script.js    → idioma, animações, menu, formulário
├── assets/
│   └── joao-vitor.webp  → retrato da seção "Sobre" (800×800, 86 KB)
└── README.md
```

## Rodar localmente

Basta abrir o `index.html` no navegador. Para um servidor local:

```powershell
npx serve .
# ou
node server.js
```

## Design

O site é construído em cima de uma ideia: **a pilha dividida ao meio**.

| Elemento | Significado |
|---|---|
| `--client` `#FF6B4A` (coral) | interface / interação |
| `--server` `#4EA8FF` (azul) | sistema / máquina |
| `--ink` `#0D0F14` | fundo |
| `--bone` `#EFEAE0` | texto |

Fontes: **Bricolage Grotesque** (títulos), **Archivo** (texto), **IBM Plex Mono** (metadados, rotas, tags).

As cores não são decoração: coral aparece no que é interface (títulos de seção, tags, hovers, foco) e azul no que é sistema (coluna de backend, resposta de API, palavras-chave de código). As seções usam caminhos (`/projetos`, `/sobre`) como divisores, porque são rotas de verdade.

## Personalizar

1. **Contato** — seção `#contato` no `index.html` (e-mail, telefone, GitHub, LinkedIn) **e** a constante `CONTACT_EMAIL` no topo do `script.js`.
2. **Projetos** — cada `<article class="project">` em `#projetos`: título, descrição, stack, link e a "maquete" SVG (desenhada em código, troque por `<img>` se preferir print real).
3. **Sobre / Habilidades** — edite os textos e listas nas seções `#sobre` e `#habilidades`.
4. **Foto** — troque `assets/joao-vitor.webp`. O enquadramento é quadrado (`1 / 1`) com `object-fit: cover`, então qualquer imagem funciona sem distorcer; o ideal é 800×800.
5. **Cores e fontes** — tudo em `:root`, no começo do `styles.css`.

## Idioma (PT / EN)

Cada texto tem os atributos `data-pt` e `data-en`:

```html
<p data-pt="Olá" data-en="Hello">Olá</p>
```

O botão PT|EN troca tudo em tempo real, atualiza `<html lang>`, o `<title>` e a meta description, e guarda a escolha no `localStorage`.

Para adicionar um texto novo, coloque os dois atributos — se o texto é igual nos dois idiomas (nomes próprios, tecnologias), deixe sem atributos.

Imagens usam o mesmo esquema, com `data-alt-pt` / `data-alt-en`:

```html
<img src="assets/foto.webp" alt="Retrato de João Vítor" data-alt-pt="Retrato de João Vítor" data-alt-en="Portrait of João Vítor">
```

## Formulário

Valida no cliente (nome, e-mail, mensagem) com mensagens de erro nos dois idiomas. Como o site é estático, o envio abre o app de e-mail via `mailto:` com assunto e corpo prontos.

Para usar um backend de verdade, troque o bloco `form.addEventListener("submit", ...)` no `script.js` por um `fetch()` para sua API (Formspree, Resend, sua rota FastAPI etc.).

## Deploy

**No ar:** https://portfolio-joaovs.vercel.app (Vercel, deploy automático a cada push na `main`)

É estático — qualquer host serve:

- **GitHub Pages**: suba os arquivos e ative Pages na branch principal.
- **Netlify / Vercel**: arraste a pasta, sem build command.

Requer internet apenas para carregar as fontes do Google Fonts.

## Qualidade

- Lighthouse: **100** em acessibilidade, boas práticas e SEO.
- Responsivo a partir de 320 px, com menu overlay no mobile.
- Foco visível no teclado, `prefers-reduced-motion` respeitado, landmarks e rótulos ARIA.
