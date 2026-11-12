/* ============================================
   TEMPLATE "VITRINE" — Sole House
   Tudo o que muda por loja está no catálogo (PRODUTOS) e em CONFIG.
   Sem frameworks e sem servidor: abre o index.html e funciona.
   ============================================ */

const CONFIG = {
    email: 'ola@solehouse.pt',          // <- email real da loja (formulário de contacto)
    portesGratisAPartirDe: 150,         // barra de progresso do carrinho
    tamanhos: [38, 39, 40, 41, 42, 43, 44, 45, 46]
};

// ---------- Catálogo de exemplo (troca pelos teus produtos) ----------
// "grupo" liga as variantes de cor do mesmo modelo.
const PRODUTOS = [
    { id: 'air-arctic',  grupo: 'air',    nome: 'Air Step Classic', cor: { nome: 'Ártico',  hex: '#d8dde5' }, cat: 'Running',   mat: 'Malha',     preco: 89,  antigo: null, tag: 'Novo',            rating: 4.8, n: 124, vendas: 90, ordem: 8, tam: [39, 40, 41, 43, 44],         img: 'p1',        desc: 'Conforto de todo o dia com atitude de sempre.' },
    { id: 'air-cobalto', grupo: 'air',    nome: 'Air Step Classic', cor: { nome: 'Cobalto', hex: '#3b6fd8' }, cat: 'Running',   mat: 'Malha',     preco: 89,  antigo: null, tag: 'Novo',            rating: 4.7, n: 61,  vendas: 55, ordem: 7, tam: [40, 41, 42, 43],             img: 'p1-azul',   desc: 'Conforto de todo o dia com atitude de sempre.' },
    { id: 'air-rosa',    grupo: 'air',    nome: 'Air Step Classic', cor: { nome: 'Rosa',    hex: '#e35d9a' }, cat: 'Running',   mat: 'Malha',     preco: 89,  antigo: 109,  tag: 'Sale',            rating: 4.6, n: 38,  vendas: 40, ordem: 6, tam: [38, 39, 40, 42],             img: 'p1-rosa',   desc: 'Conforto de todo o dia com atitude de sempre.' },
    { id: 'glide-gelo',  grupo: 'glide',  nome: 'Street Glide',     cor: { nome: 'Gelo',    hex: '#d9d6cc' }, cat: 'Lifestyle', mat: 'Sintético', preco: 99,  antigo: null, tag: 'Mais Vendido',    rating: 4.9, n: 212, vendas: 99, ordem: 5, tam: [39, 41, 42, 43, 45],         img: 'p2',        desc: 'Leve e versátil, o favorito de quem anda a cidade toda a pé.' },
    { id: 'glide-areia', grupo: 'glide',  nome: 'Street Glide',     cor: { nome: 'Areia',   hex: '#cdb48e' }, cat: 'Lifestyle', mat: 'Sintético', preco: 99,  antigo: null, tag: null,              rating: 4.7, n: 77,  vendas: 70, ordem: 4, tam: [40, 41, 42, 44],             img: 'p2-areia',  desc: 'Leve e versátil, o favorito de quem anda a cidade toda a pé.' },
    { id: 'glide-ardosia', grupo: 'glide', nome: 'Street Glide',    cor: { nome: 'Ardósia', hex: '#7c8794' }, cat: 'Lifestyle', mat: 'Sintético', preco: 99,  antigo: 119,  tag: 'Sale',            rating: 4.5, n: 29,  vendas: 33, ordem: 3, tam: [41, 42, 43],                 img: 'p2-ardosia', desc: 'Leve e versátil, o favorito de quem anda a cidade toda a pé.' },
    { id: 'noir-70',     grupo: 'noir',   nome: 'High Noir 70',     cor: { nome: 'Noir',    hex: '#151515' }, cat: 'Cano alto', mat: 'Lona',      preco: 129, antigo: 149,  tag: 'Edição Limitada', rating: 4.9, n: 143, vendas: 80, ordem: 2, tam: [40, 43, 44],                 img: 'p3',        desc: 'Drop exclusivo, tiragem limitada — para quem chega primeiro.' },
    { id: 'noir-creme',  grupo: 'noir',   nome: 'High Noir 70',     cor: { nome: 'Creme',   hex: '#e8dcc2' }, cat: 'Cano alto', mat: 'Lona',      preco: 129, antigo: null, tag: 'Esgotado',        rating: 4.8, n: 96,  vendas: 60, ordem: 1, tam: [],                           img: 'p3-creme',  desc: 'Drop exclusivo, tiragem limitada — para quem chega primeiro.' }
];

const IMG = document.documentElement.dataset.img || 'img/';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const eur = n => n.toLocaleString('pt-PT', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }) + ' €';
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const guardar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
const ler = (k, def) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch (e) { return def; } };
const porId = id => PRODUTOS.find(p => p.id === id);
const esgotado = p => p.tam.length === 0;

// ============================================
// Camadas (menu móvel, carrinho, pesquisa, filtros) partilham o mesmo véu
// ============================================
const revelar = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visivel'); revelar.unobserve(e.target); } }), { threshold: .1 });

const veu = $('#veu');
const camadas = ['navPrincipal', 'carrinho', 'busca', 'filtros'];
function abrir(id) {
    camadas.forEach(c => { if (c !== id) fechar(c, true); });
    const el = document.getElementById(id); if (!el) return;
    el.classList.add('aberto'); veu && veu.classList.add('ativo'); document.body.classList.add('sem-scroll');
    const bt = $(`[data-abrir="${id}"]`); bt && bt.setAttribute('aria-expanded', 'true');
    if (id === 'busca') setTimeout(() => $('#buscaInput').focus(), 60);
}
function fechar(id, silencioso) {
    const el = document.getElementById(id); if (!el) return;
    el.classList.remove('aberto');
    const bt = $(`[data-abrir="${id}"]`); bt && bt.setAttribute('aria-expanded', 'false');
    if (!silencioso && !camadas.some(c => document.getElementById(c)?.classList.contains('aberto'))) {
        veu && veu.classList.remove('ativo'); document.body.classList.remove('sem-scroll');
    }
}
function fecharTudo() { camadas.forEach(c => fechar(c)); veu && veu.classList.remove('ativo'); document.body.classList.remove('sem-scroll'); }
$$('[data-abrir]').forEach(b => b.addEventListener('click', () => {
    const id = b.dataset.abrir; const el = document.getElementById(id);
    el && el.classList.contains('aberto') ? fechar(id) : abrir(id);
}));
$$('[data-fechar]').forEach(b => b.addEventListener('click', fecharTudo));
veu && veu.addEventListener('click', fecharTudo);
document.addEventListener('keydown', e => { if (e.key === 'Escape') fecharTudo(); });
// no telemóvel, cada item do menu abre e fecha os seus sublinks
$$('.item-mega-btn').forEach(b => b.addEventListener('click', () => {
    const li = b.closest('.item'); const aberto = li.classList.toggle('aberto'); b.setAttribute('aria-expanded', aberto);
}));
$$('#navPrincipal a').forEach(a => a.addEventListener('click', () => fechar('navPrincipal')));

// ============================================
// Barra de anúncios
// ============================================
(() => {
    const barra = $('#anuncios'); if (!barra) return;
    const msgs = $$('.anuncio', barra);
    if (msgs.length < 2 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let i = 0, parado = false;
    barra.addEventListener('mouseenter', () => parado = true); barra.addEventListener('mouseleave', () => parado = false);
    setInterval(() => { if (parado) return; msgs[i].classList.remove('ativo'); i = (i + 1) % msgs.length; msgs[i].classList.add('ativo'); }, 4000);
})();

// ============================================
// Cartão de produto
// ============================================
function estrelas(r) { return `<span class="estrelas" style="--r:${(r / 5 * 100).toFixed(0)}%" aria-hidden="true">★★★★★</span>`; }
function cartao(p, opts = {}) {
    const irmaos = PRODUTOS.filter(x => x.grupo === p.grupo);
    const art = document.createElement('article');
    art.className = 'produto-cartao' + (esgotado(p) ? ' e-esgotado' : '');
    art.dataset.id = p.id;
    const tags = [];
    if (p.tag) tags.push(`<span class="produto-tag t-${p.tag.toLowerCase().replace(/\s+/g, '-')}">${esc(p.tag)}</span>`);
    if (p.antigo && p.tag !== 'Sale') tags.push(`<span class="produto-tag t-sale">-${Math.round((1 - p.preco / p.antigo) * 100)}%</span>`);
    art.innerHTML = `
        <div class="produto-imagem">
            <img class="img-principal" src="${IMG}${p.img}.webp" width="800" height="1000" loading="lazy" alt="${esc(p.nome)} em ${esc(p.cor.nome)}">
            <img class="img-detalhe" src="${IMG}${p.img}-det.webp" width="800" height="1000" loading="lazy" alt="" aria-hidden="true">
            <div class="produto-tags">${tags.join('')}</div>
        </div>
        <div class="produto-info">
            <h3 class="produto-nome">${esc(p.nome)}</h3>
            <p class="produto-cor">${esc(p.cor.nome)}</p>
            <p class="produto-rating">${estrelas(p.rating)} <span>${p.rating.toLocaleString('pt-PT')} (${p.n})</span></p>
            <p class="produto-preco">${p.antigo ? `<s>${eur(p.antigo)}</s>` : ''}<span class="${p.antigo ? 'preco-sale' : ''}">${eur(p.preco)}</span></p>
            ${irmaos.length > 1 ? `<div class="produto-cores" role="group" aria-label="Cores">${irmaos.map(s => `<button type="button" class="cor-bolinha${s.id === p.id ? ' ativa' : ''}" data-troca="${s.id}" style="--c:${s.cor.hex}" aria-label="${esc(s.cor.nome)}" title="${esc(s.cor.nome)}"></button>`).join('')}</div>` : ''}
            <div class="produto-tamanhos" role="group" aria-label="Tamanhos">${CONFIG.tamanhos.map(t => `<button type="button" class="tam" data-tam="${t}" ${p.tam.includes(t) ? '' : 'disabled'} aria-pressed="false">${t}</button>`).join('')}</div>
            <button type="button" class="btn btn-add" data-add="${p.id}">${esgotado(p) ? 'Esgotado' : 'Adicionar ao carrinho'}</button>
        </div>`;
    if (esgotado(p)) $('.btn-add', art).disabled = true;
    return art;
}
document.addEventListener('click', e => {
    const troca = e.target.closest('[data-troca]');
    if (troca) { const cartaoEl = troca.closest('.produto-cartao'); const novo = cartao(porId(troca.dataset.troca)); novo.classList.add('visivel'); cartaoEl.replaceWith(novo); return; }
    const tam = e.target.closest('.tam');
    if (tam && !tam.disabled) {
        const cont = tam.closest('.produto-tamanhos');
        $$('.tam', cont).forEach(t => { t.classList.toggle('sel', t === tam); t.setAttribute('aria-pressed', t === tam ? 'true' : 'false'); });
        cont.classList.remove('erro'); return;
    }
    const add = e.target.closest('[data-add]');
    if (add) {
        const art = add.closest('.produto-cartao'); const sel = $('.tam.sel', art);
        if (!sel) { const c = $('.produto-tamanhos', art); c.classList.remove('erro'); void c.offsetWidth; c.classList.add('erro'); add.textContent = 'Escolhe um tamanho'; setTimeout(() => add.textContent = 'Adicionar ao carrinho', 1800); return; }
        carrinho.adicionar(add.dataset.add, Number(sel.dataset.tam)); abrir('carrinho');
    }
});
function preencher(el, lista, opts) {
    el.innerHTML = '';
    lista.forEach((p, i) => { const c = cartao(p, opts); c.classList.add('reveal'); c.style.setProperty('--i', i % 4); el.appendChild(c); revelar.observe(c); });
}

// ============================================
// Carrinho (guardado só neste browser; sem pagamentos reais)
// ============================================
const carrinho = {
    itens: ler('sole_carrinho', []),
    adicionar(id, tam) {
        const it = this.itens.find(i => i.id === id && i.tam === tam);
        it ? it.q++ : this.itens.push({ id, tam, q: 1 }); this.mudou();
    },
    alterar(id, tam, d) {
        const it = this.itens.find(i => i.id === id && i.tam === tam); if (!it) return;
        it.q += d; if (it.q <= 0) this.itens = this.itens.filter(i => i !== it); this.mudou();
    },
    total() { return this.itens.reduce((s, i) => s + porId(i.id).preco * i.q, 0); },
    qtd() { return this.itens.reduce((s, i) => s + i.q, 0); },
    mudou() { guardar('sole_carrinho', this.itens); this.render(); },
    render() {
        $$('.contagem').forEach(c => { c.textContent = this.qtd(); c.hidden = this.qtd() === 0; });
        const lista = $('#carrinhoLista'); if (!lista) return;
        const total = this.total(), falta = Math.max(0, CONFIG.portesGratisAPartirDe - total);
        $('#carrinhoVazio').hidden = this.itens.length > 0;
        $('#carrinhoRodape').hidden = this.itens.length === 0;
        $('#carrinhoProgresso').hidden = this.itens.length === 0;
        $('#progressoTexto').textContent = falta > 0 ? `Faltam ${eur(falta)} para portes grátis` : 'Tens portes grátis!';
        $('#progressoBarra').style.width = Math.min(100, total / CONFIG.portesGratisAPartirDe * 100) + '%';
        $('#carrinhoTotal').textContent = eur(total);
        lista.innerHTML = this.itens.map(i => { const p = porId(i.id); return `
            <li class="linha-carrinho">
                <img src="${IMG}${p.img}.webp" alt="" width="72" height="90">
                <div><p class="lc-nome">${esc(p.nome)}</p><p class="lc-det">${esc(p.cor.nome)} · EU ${i.tam}</p>
                    <div class="qtd"><button type="button" data-q="-1" data-id="${p.id}" data-t="${i.tam}" aria-label="Menos um">−</button><span>${i.q}</span><button type="button" data-q="1" data-id="${p.id}" data-t="${i.tam}" aria-label="Mais um">+</button></div></div>
                <p class="lc-preco">${eur(p.preco * i.q)}</p>
            </li>`; }).join('');
    }
};
$('#carrinhoLista') && $('#carrinhoLista').addEventListener('click', e => {
    const b = e.target.closest('[data-q]'); if (b) carrinho.alterar(b.dataset.id, Number(b.dataset.t), Number(b.dataset.q));
});
const btnFinalizar = $('#btnFinalizar');
btnFinalizar && btnFinalizar.addEventListener('click', () => {
    const painel = $('#carrinhoDemo'); painel.hidden = false;
    $('#demoResumo').innerHTML = carrinho.itens.map(i => { const p = porId(i.id); return `<li>${i.q}× ${esc(p.nome)} (${esc(p.cor.nome)}, EU ${i.tam}) <span>${eur(p.preco * i.q)}</span></li>`; }).join('') + `<li class="total">Total <span>${eur(carrinho.total())}</span></li>`;
    $('#demoFim').hidden = true; $('#demoCorpo').hidden = false;
});
$('#demoVoltar') && $('#demoVoltar').addEventListener('click', () => { $('#carrinhoDemo').hidden = true; });
$('#demoConcluir') && $('#demoConcluir').addEventListener('click', () => { carrinho.itens = []; carrinho.mudou(); $('#demoCorpo').hidden = true; $('#demoFim').hidden = false; });
$('#demoFechar') && $('#demoFechar').addEventListener('click', () => { $('#carrinhoDemo').hidden = true; fecharTudo(); });

// ============================================
// Pesquisa com sugestões
// ============================================
const buscaInput = $('#buscaInput');
if (buscaInput) {
    const res = $('#buscaResultados');
    const desenhar = () => {
        const q = buscaInput.value.trim().toLowerCase();
        const lista = !q ? PRODUTOS.filter(p => p.vendas > 85) : PRODUTOS.filter(p => [p.nome, p.cor.nome, p.cat, p.mat].join(' ').toLowerCase().includes(q));
        $('#buscaTitulo').textContent = q ? (lista.length ? `${lista.length} resultado(s)` : 'Nada encontrado') : 'Os mais procurados';
        res.innerHTML = lista.slice(0, 6).map(p => `<li><a href="colecao.html?q=${encodeURIComponent(p.nome)}"><img src="${IMG}${p.img}.webp" alt="" width="56" height="70"><span><strong>${esc(p.nome)}</strong> ${esc(p.cor.nome)}<small>${eur(p.preco)}</small></span></a></li>`).join('');
    };
    buscaInput.addEventListener('input', desenhar); desenhar();
    $('#buscaForm').addEventListener('submit', e => { e.preventDefault(); location.href = 'colecao.html?q=' + encodeURIComponent(buscaInput.value.trim()); });
}

// ============================================
// Contagem decrescente do drop
// ============================================
$$('[data-contagem]').forEach(el => {
    let alvo = ler('sole_drop', 0);
    if (!alvo || alvo < Date.now()) { alvo = Date.now() + (3 * 24 + 14) * 3600e3 + 33 * 60e3; guardar('sole_drop', alvo); }
    const p2 = n => String(n).padStart(2, '0');
    const tick = () => {
        let s = Math.max(0, Math.floor((alvo - Date.now()) / 1000));
        const d = Math.floor(s / 86400); s %= 86400; const h = Math.floor(s / 3600); s %= 3600; const m = Math.floor(s / 60); s %= 60;
        el.innerHTML = `<span><b>${p2(d)}</b>dias</span><span><b>${p2(h)}</b>horas</span><span><b>${p2(m)}</b>min</span><span><b>${p2(s)}</b>seg</span>`;
    };
    tick(); setInterval(tick, 1000);
});

// ============================================
// Grelhas da página inicial: <div data-grelha="todos|novos|vendidos|air|glide|noir" data-max="8">
// ============================================
const SELECOES = {
    todos: () => [...PRODUTOS].sort((a, b) => b.ordem - a.ordem),
    novos: () => PRODUTOS.filter(p => p.tag === 'Novo' || p.ordem >= 6),
    vendidos: () => [...PRODUTOS].sort((a, b) => b.vendas - a.vendas),
    air: () => PRODUTOS.filter(p => p.grupo === 'air'), glide: () => PRODUTOS.filter(p => p.grupo === 'glide'), noir: () => PRODUTOS.filter(p => p.grupo === 'noir')
};
$$('[data-grelha]').forEach(el => preencher(el, SELECOES[el.dataset.grelha]().slice(0, Number(el.dataset.max || 99))));

// ============================================
// Página da coleção: filtros, ordenação, contagens
// ============================================
const filtrosEl = $('#filtros');
if (filtrosEl) {
    const params = new URLSearchParams(location.search);
    const est = { disp: new Set(), cat: new Set(), cor: new Set(), tam: new Set(), mat: new Set(), min: null, max: null, q: params.get('q') || '', sale: params.get('sale') === '1', sort: params.get('sort') || 'recomendado' };
    if (params.get('cat')) est.cat.add(params.get('cat'));
    if (params.get('mat')) est.mat.add(params.get('mat'));
    const ORDENS = { recomendado: 'Recomendado', relevantes: 'Mais relevantes', vendidos: 'Mais vendidos', 'preco-asc': 'Preço: do mais baixo ao mais alto', 'preco-desc': 'Preço: do mais alto ao mais baixo', novidades: 'Novidades' };
    const sel = $('#ordenar'); sel.innerHTML = Object.entries(ORDENS).map(([k, v]) => `<option value="${k}">${v}</option>`).join(''); sel.value = est.sort in ORDENS ? est.sort : 'recomendado';
    sel.addEventListener('change', () => { est.sort = sel.value; desenhar(); });

    const uniq = k => [...new Set(PRODUTOS.map(k))];
    const conta = f => PRODUTOS.filter(f).length;
    const titulos = { cat: 'Categoria', cor: 'Cor', tam: 'Tamanho', mat: 'Material' };
    function construir() {
        const grupo = (id, titulo, corpo) => `<details class="facet" open><summary>${titulo}</summary><div class="facet-corpo">${corpo}</div></details>`;
        const check = (nome, valor, texto, n, extra = '') => `<label class="opt"><input type="checkbox" data-f="${nome}" value="${esc(valor)}"> ${extra}<span>${esc(texto)}</span><em>${n}</em></label>`;
        filtrosEl.querySelector('.filtros-corpo').innerHTML =
            grupo('disp', 'Disponibilidade', check('disp', 'stock', 'Em stock', conta(p => !esgotado(p))) + check('disp', 'esgotado', 'Esgotado', conta(esgotado))) +
            grupo('cat', 'Categoria', uniq(p => p.cat).map(c => check('cat', c, c, conta(p => p.cat === c))).join('')) +
            grupo('cor', 'Cor', uniq(p => p.cor.nome).map(c => { const p = PRODUTOS.find(x => x.cor.nome === c); return check('cor', c, c, conta(x => x.cor.nome === c), `<i class="bola" style="--c:${p.cor.hex}"></i>`); }).join('')) +
            grupo('tam', 'Tamanho (EU)', `<div class="tam-grade">${CONFIG.tamanhos.map(t => `<label class="chip"><input type="checkbox" data-f="tam" value="${t}"><span>${t}</span></label>`).join('')}</div>`) +
            grupo('preco', 'Preço', `<div class="preco-campos"><label>de<input type="number" id="pMin" min="0" placeholder="0" inputmode="numeric"></label><label>até<input type="number" id="pMax" min="0" placeholder="150" inputmode="numeric"></label></div>`) +
            grupo('mat', 'Material', uniq(p => p.mat).map(c => check('mat', c, c, conta(p => p.mat === c))).join(''));
        $$('input[data-f]', filtrosEl).forEach(i => {
            i.checked = est[i.dataset.f].has(i.value);
            i.addEventListener('change', () => { i.checked ? est[i.dataset.f].add(i.value) : est[i.dataset.f].delete(i.value); desenhar(); });
        });
        $('#pMin').addEventListener('input', e => { est.min = e.target.value === '' ? null : Number(e.target.value); desenhar(); });
        $('#pMax').addEventListener('input', e => { est.max = e.target.value === '' ? null : Number(e.target.value); desenhar(); });
    }
    function filtrar() {
        const q = est.q.toLowerCase();
        let l = PRODUTOS.filter(p =>
            (!est.disp.size || est.disp.has(esgotado(p) ? 'esgotado' : 'stock')) &&
            (!est.cat.size || est.cat.has(p.cat)) && (!est.cor.size || est.cor.has(p.cor.nome)) && (!est.mat.size || est.mat.has(p.mat)) &&
            (!est.tam.size || [...est.tam].some(t => p.tam.includes(Number(t)))) &&
            (est.min === null || p.preco >= est.min) && (est.max === null || p.preco <= est.max) &&
            (!est.sale || p.antigo) && (!q || [p.nome, p.cor.nome, p.cat, p.mat].join(' ').toLowerCase().includes(q)));
        const o = {
            recomendado: (a, b) => b.ordem - a.ordem, relevantes: (a, b) => b.rating * Math.log(b.n) - a.rating * Math.log(a.n), vendidos: (a, b) => b.vendas - a.vendas,
            'preco-asc': (a, b) => a.preco - b.preco, 'preco-desc': (a, b) => b.preco - a.preco, novidades: (a, b) => b.ordem - a.ordem
        }[est.sort];
        return l.sort(o);
    }
    function desenhar() {
        const l = filtrar(); const g = $('#resultados');
        $('#contagem').textContent = `${l.length} ${l.length === 1 ? 'produto' : 'produtos'}`;
        $$('.btn-mostrar-n').forEach(b => b.textContent = `Mostrar ${l.length}`);
        const ativos = est.disp.size + est.cat.size + est.cor.size + est.tam.size + est.mat.size + (est.min !== null) + (est.max !== null) + (est.sale ? 1 : 0) + (est.q ? 1 : 0);
        $$('.limpar').forEach(b => b.hidden = ativos === 0);
        $('#nFiltros').textContent = ativos ? `(${ativos})` : '';
        $('#vazio').hidden = l.length > 0;
        preencher(g, l);
    }
    $$('.limpar').forEach(b => b.addEventListener('click', () => {
        ['disp', 'cat', 'cor', 'tam', 'mat'].forEach(k => est[k].clear()); est.min = est.max = null; est.q = ''; est.sale = false;
        $$('input[data-f]', filtrosEl).forEach(i => i.checked = false); $('#pMin').value = ''; $('#pMax').value = ''; desenhar();
    }));
    construir();
    $$('input[data-f="tam"]', filtrosEl).forEach(i => i.checked = est.tam.has(i.value));
    desenhar();
}

// ============================================
// Revelar ao entrar no ecrã
// ============================================

// ============================================
// Newsletter (demonstração: não guarda nem envia o email)
// ============================================
$$('[data-news]').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault(); const n = $('.news-nota', f);
    n.textContent = 'Obrigada! (Demonstração: o email não foi guardado nem enviado.)'; f.reset();
}));

// ============================================
// Rodapé: ano e formulário de contacto (sem servidor)
// ============================================
const anoEl = $('#anoAtual'); if (anoEl) anoEl.textContent = new Date().getFullYear();
const formContacto = $('#formContacto');
if (formContacto) {
    const formNota = $('#formNota'), confirmacaoEnvio = $('#confirmacaoEnvio'), linkAbrirEmail = $('#linkAbrirEmail'), textoMensagem = $('#textoMensagem'), btnCopiarMensagem = $('#btnCopiarMensagem');
    btnCopiarMensagem.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(textoMensagem.value); btnCopiarMensagem.textContent = 'Copiado!'; btnCopiarMensagem.classList.add('copiado'); } catch (e) { textoMensagem.select(); }
        setTimeout(() => { btnCopiarMensagem.textContent = 'Copiar mensagem'; btnCopiarMensagem.classList.remove('copiado'); }, 2500);
    });
    formContacto.addEventListener('submit', e => {
        e.preventDefault();
        const nome = $('#nome').value.trim(), email = $('#email').value.trim(), mensagem = $('#mensagem').value.trim();
        const corpo = `Nome: ${nome}\nEmail: ${email}\n\nMensagem:\n${mensagem}`;
        linkAbrirEmail.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent('Nova mensagem de ' + nome)}&body=${encodeURIComponent(corpo)}`;
        textoMensagem.value = `Para: ${CONFIG.email}\n\n${corpo}`; formNota.textContent = '';
        confirmacaoEnvio.hidden = false; confirmacaoEnvio.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}

$$('.reveal').forEach(el => revelar.observe(el));
carrinho.render();
