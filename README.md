# Template "Vitrine" — Sole House (exemplo sneakers/streetwear)

Site institucional estático de uma página. Esta versão está vestida como **"Sole House"**, uma loja fictícia de sneakers e streetwear — serve para mostrar o motor genérico já aplicado a um caso real, com cores, imagens e textos próprios do tema.

O motor por baixo continua genérico: dá para reskin para qualquer negócio de vitrine (consultoria, oficina, salão, clínica, loja, etc.) trocando cores, textos e o catálogo de produtos/serviços.

## Estrutura
- `index.html` — todo o conteúdo e secções
- `style.css` — todo o estilo (paleta lima/preto + rosa de destaque)
- `script.js` — menu mobile, animações ao scroll e formulário de contacto (com confirmação + copiar mensagem)

## Como adaptar a um cliente novo

1. **Cores da marca** — abre `style.css` e muda as variáveis em `:root`:
   ```css
   --cor-primaria: #c6ff00;
   --cor-primaria-escura: #9fd400;
   --cor-destaque: #ff4fd8;
   --cor-escuro: #0a0a0a;
   ```
2. **Nome, textos e produtos** — em `index.html`, substitui:
   - "SOLE HOUSE" (logo, título, rodapé)
   - Textos do Hero, Sobre, secção Coleção (4 cartões de produto) e Depoimentos
   - Dados de contacto (telefone, email, morada, horário)
3. **Imagens dos produtos** — os 4 cartões usam o mesmo ícone SVG de sneaker (`fill="currentColor"`), recolorido por cartão através de `style="--cor-produto:#HEX"`. Para trocar por fotos reais, substitui o `<svg>` de cada `.produto-imagem` por uma `<img>`.
4. **Email de contacto** — em `script.js`, troca `EMAIL_LOJA = 'ola@solehouse.pt'` pelo email real do negócio.
5. **Redes sociais** — no rodapé de `index.html`, troca os `href="#"` pelos links reais.

## O que este template NÃO faz
O formulário de contacto não tem servidor próprio. Ao submeter, mostra sempre um painel de confirmação com a mensagem pronta a copiar, e também tenta abrir o email do visitante já preenchido (isto só funciona se houver um cliente de email configurado no computador — por isso a opção "Copiar mensagem" é a garantia que funciona sempre).

Se o cliente quiser um catálogo interativo com filtros, calculadora de orçamento ou marcações, usa o template **"interativo"**.

## Publicar online
Gratuito e simples com o Render (Static Site) ou GitHub Pages:
1. Cria um repositório no GitHub e envia estes ficheiros.
2. No Render, cria um "Static Site" ligado ao repositório (Build Command vazio, Publish directory `.`).
3. O site fica disponível num URL `https://nome-do-site.onrender.com`.
