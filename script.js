// ============================================
// TEMPLATE "VITRINE" — Sole House
// ============================================

// Ano automático no rodapé
document.getElementById('anoAtual').textContent = new Date().getFullYear();

// ------------------------------------------------
// Menu mobile
// ------------------------------------------------
const btnMenu = document.getElementById('btnMenu');
const navPrincipal = document.getElementById('navPrincipal');

btnMenu.addEventListener('click', () => {
    const aberto = navPrincipal.classList.toggle('aberto');
    btnMenu.setAttribute('aria-expanded', aberto ? 'true' : 'false');
});

navPrincipal.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navPrincipal.classList.remove('aberto');
        btnMenu.setAttribute('aria-expanded', 'false');
    });
});

// ------------------------------------------------
// Animação simples ao entrar no ecrã
// ------------------------------------------------
const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
            entrada.target.classList.add('visivel');
            observador.unobserve(entrada.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observador.observe(el));

// ------------------------------------------------
// Formulário de contacto (versão simples, sem backend)
// ------------------------------------------------
// Este template não tem servidor próprio. Ao submeter, mostra sempre
// uma confirmação com a mensagem pronta a copiar, e tenta também abrir
// o cliente de email do visitante (só funciona se houver um configurado
// neste computador — por isso a opção de copiar é a garantia).
const EMAIL_LOJA = 'ola@solehouse.pt'; // <- troca pelo email real da loja

const formContacto = document.getElementById('formContacto');
const formNota = document.getElementById('formNota');
const confirmacaoEnvio = document.getElementById('confirmacaoEnvio');
const linkAbrirEmail = document.getElementById('linkAbrirEmail');
const textoMensagem = document.getElementById('textoMensagem');
const btnCopiarMensagem = document.getElementById('btnCopiarMensagem');

btnCopiarMensagem.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(textoMensagem.value);
        btnCopiarMensagem.textContent = 'Copiado!';
        btnCopiarMensagem.classList.add('copiado');
    } catch (erro) {
        textoMensagem.select();
    }
    setTimeout(() => {
        btnCopiarMensagem.textContent = 'Copiar mensagem';
        btnCopiarMensagem.classList.remove('copiado');
    }, 2500);
});

formContacto.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();

    const assunto = encodeURIComponent(`Nova mensagem de ${nome}`);
    const corpo = `Nome: ${nome}\nEmail: ${email}\n\nMensagem:\n${mensagem}`;

    linkAbrirEmail.href = `mailto:${EMAIL_LOJA}?subject=${assunto}&body=${encodeURIComponent(corpo)}`;
    textoMensagem.value = `Para: ${EMAIL_LOJA}\n\n${corpo}`;
    formNota.textContent = '';
    confirmacaoEnvio.hidden = false;
    confirmacaoEnvio.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
