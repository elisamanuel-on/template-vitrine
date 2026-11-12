# Template Vitrine — Sole House

Template de loja online "vitrine" (sneakers & streetwear) feito só com HTML, CSS e JavaScript.
Sem frameworks, sem servidor e sem base de dados: abre o `index.html` e funciona.

## O que inclui

- Cabeçalho flutuante com mega menu (categorias, coleções, materiais) e menu lateral no telemóvel
- Pesquisa em ecrã inteiro, com sugestões
- Carrinho lateral com barra de portes grátis e finalização **simulada** (nada é cobrado nem enviado)
- Página de coleção com filtros (categoria, material, saldos), ordenação e contagem de resultados
- Contagem decrescente de drop, carrossel de mais vendidos, histórias, perguntas frequentes, depoimentos
- Newsletter e formulário de contacto (abre o email do cliente ou copia a mensagem)

## Estrutura

| Ficheiro | Para que serve |
|---|---|
| `index.html` | Página inicial |
| `colecao.html` | Página de produtos com filtros |
| `style.css` | Todo o visual. As cores e os cantos estão nas variáveis `:root` no topo |
| `app.js` | Dados da loja (`CONFIG` e `PRODUTOS`) e todo o comportamento |
| `img/` | Imagens usadas pelo site |
| `produtos-fotos/` | Fotos originais (não são usadas pelo site; pode apagar se quiser) |
| `versao-anterior/` | Versão antiga do template, só como cópia de segurança |

## Como adaptar a uma loja

1. **Email da loja:** em `app.js`, altere `CONFIG.email`.
2. **Produtos:** em `app.js`, edite a lista `PRODUTOS` (nome, preço, cores, tamanhos, stock, imagem).
3. **Cores:** em `style.css`, no bloco `:root`, altere `--acc` (cor de destaque), `--bg`, `--ink`, etc.
4. **Textos e imagens:** edite `index.html` e substitua os ficheiros de `img/` por fotos da própria loja (mantenha os nomes ou atualize-os no HTML e no `app.js`).

Os preços, avaliações e stocks incluídos são de exemplo.

## Como publicar

**Render (Static Site)**

1. Envie o projeto para o GitHub.
2. No Render: *New + → Static Site* e escolha o repositório.
3. *Build Command*: deixe vazio. *Publish Directory*: `.`
4. *Create Static Site*. Cada `git push` atualiza o site.

**GitHub Pages:** *Settings → Pages → Deploy from a branch → main / (root)*.

## Testar localmente

Basta abrir `index.html` no navegador. Para testar como no servidor:

```
python -m http.server 8000
```

e abrir http://localhost:8000
