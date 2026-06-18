// Variável global para armazenar os dados carregados do JSON
let bancoDeCartas = [];
let interpretacoesTiragem = {};

// 1. CARREGAMENTO DOS DADOS DO JSON (UNIFICADO PARA TODO O SITE)
window.addEventListener('DOMContentLoaded', async () => {

    try {

        const respostaArcanos = await fetch('arcanos.json');

        if (!respostaArcanos.ok) {
            throw new Error('Não foi possível carregar arcanos.json');
        }

        bancoDeCartas = await respostaArcanos.json();

        const respostaInterpretacoes =
            await fetch('interpretacoes_tiragem.json');

        if (!respostaInterpretacoes.ok) {
            throw new Error('Não foi possível carregar interpretacoes_tiragem.json');
        }

        interpretacoesTiragem =
            await respostaInterpretacoes.json();

        console.log('Arcanos carregados:', bancoDeCartas.length);
        console.log('Interpretações carregadas:', interpretacoesTiragem);

        inicializarMesaTiragem();
        inicializarGridBiblioteca();
        inicializarCartaDoDia();
        inicializarListaArcanos();
        inicializarQuiz();
        inicializarTimelineJornada();

    }

    catch (erro) {

        console.error(
            "Erro ao carregar os arquivos JSON:",
            erro
        );

        const containerDeck =
            document.getElementById('deck');

        if (containerDeck) {

            containerDeck.innerHTML = `
                <p style="color:#ff7676;text-align:center;">
                    Erro ao carregar os arquivos JSON.
                </p>
            `;

        }

    }
});

// ==========================================================================
// 2. FUNÇÕES DA TELA DE PRÁTICA (MESA DE TIRAGEM)
// ==========================================================================
function inicializarMesaTiragem() {
    const btnEmbaralhar = document.getElementById('btn-embaralhar');
    const btnNovaTiragem = document.getElementById('btn-nova-tiragem');

    // PROTEÇÃO: Só adiciona os eventos se os botões existirem no HTML (evita travar a biblioteca)
    if (btnEmbaralhar && btnNovaTiragem) {
        btnEmbaralhar.addEventListener('click', realizarTiragem);
        btnNovaTiragem.addEventListener('click', resetarMesa);
    }
}

function realizarTiragem() {
    if (bancoDeCartas.length < 3) {
        alert("Sua biblioteca precisa de pelo menos 3 arcanos para realizar a tiragem.");
        return;
    }

    let cartasEmbaralhadas = [...bancoDeCartas];
    for (let i = cartasEmbaralhadas.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cartasEmbaralhadas[i], cartasEmbaralhadas[j]] = [cartasEmbaralhadas[j], cartasEmbaralhadas[i]];
    }

    let passado = cartasEmbaralhadas[0];
    let presente = cartasEmbaralhadas[1];
    let futuro = cartasEmbaralhadas[2];

    revelarCartaNaMesa('carta-passado', passado);
    revelarCartaNaMesa('carta-presente', presente);
    revelarCartaNaMesa('carta-futuro', futuro);

    exibirInterpretacao(passado, presente, futuro);
}

function revelarCartaNaMesa(idElemento, dadosCarta) {
    const containerCarta = document.getElementById(idElemento);
    if (!containerCarta) return;
    containerCarta.classList.remove('verso');
    containerCarta.innerHTML = `<img src="${dadosCarta.imagem_url}" alt="${dadosCarta.nome}" class="card-image">`;
}

function exibirInterpretacao(carta) {
    const painel = document.getElementById('painel-leitura');
    if (!painel) return;

    painel.style.display = 'block';
    document.getElementById('nome-carta-revelada').innerText = `${carta.numero} - ${carta.nome}`;
    document.getElementById('texto-conselho').innerText = carta.conselho;
    
    const elementoReflexao = document.getElementById('texto-reflexao');
    if (elementoReflexao) {
        elementoReflexao.innerHTML = `
            <p style="margin-bottom: 0.8rem;"><strong>Mensagem Central:</strong> ${carta.mensagem_central}</p>
            <p style="margin-bottom: 0.5rem; color: #7ee7a4;"><strong>Lado Luz (Consciência):</strong> ${carta.lado_luz}</p>
            <p style="margin-bottom: 0.5rem; color: #ff7676;"><strong>Lado Sombra (Inconsciente):</strong> ${carta.lado_sombra}</p>
            <p style="margin-bottom: 0.5rem; color: #9cbbf7; font-style: italic;"><strong>Processo Alquímico:</strong> ${carta.processo_alquimico}</p>
            <p style="color: #d4af37;"><strong>Tendência de Previsão:</strong> ${carta.previsao}</p>
        `;
    }

    const containerTags = document.getElementById('container-tags');
    if (containerTags) {
        containerTags.innerHTML = '';
        carta.palavras_chave.forEach(palavra => {
            const span = document.createElement('span');
            span.className = 'tag-palavra';
            span.innerText = palavra;
            containerTags.appendChild(span);
        });
    }
}

function resetarMesa() {
    const posicoes = ['carta-passado', 'carta-presente', 'carta-futuro'];
    posicoes.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.classList.add('verso');
            elemento.innerHTML = '';
        }
    });
    const painel = document.getElementById('painel-leitura');
    if (painel) painel.style.display = 'none';
}

// ==========================================================================
// 3. FUNÇÕES DA TELA DA BIBLIOTECA (PÁGINA: biblioteca.html)
// ==========================================================================
function inicializarGridBiblioteca() {
    const containerDeck = document.getElementById('deck');

    if (!containerDeck) return;

    containerDeck.innerHTML = '';

    bancoDeCartas.forEach(arcano => {
        const cardLink = document.createElement('a');
        cardLink.className = 'card-perspective link-card-arcano';
        cardLink.href = `arcanos.html#${arcano.id}`;

        const badgesHtml = arcano.palavras_chave
            .map(palavra => `<span class="badge">${palavra}</span>`)
            .join('');

        cardLink.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <img src="${arcano.imagem_url}" class="card-image" alt="${arcano.nome}">
                    <div class="card-info-resumida">
                        <h2 class="card-title">${arcano.numero} - ${arcano.nome}</h2>
                        <div class="keywords-container">
                            ${badgesHtml}
                        </div>
                        <span class="ver-arcano">Ver estudo completo</span>
                    </div>
                </div>

                <div class="card-back"></div>
            </div>
        `;

        containerDeck.appendChild(cardLink);
    });
}
// ==========================================================================
// 3.1 FUNÇÕES DA PÁGINA COMPLETA DOS ARCANOS (PÁGINA: arcanos.html)
// ==========================================================================
function inicializarListaArcanos() {
    const container = document.getElementById('lista-arcanos');

    if (!container) return;

    container.innerHTML = '';

    bancoDeCartas.forEach(arcano => {
        const palavrasHtml = arcano.palavras_chave
            .map(palavra => `<span class="badge">${palavra}</span>`)
            .join('');

        const bloco = document.createElement('article');
        bloco.className = 'bloco-arcano-completo';
        bloco.id = arcano.id;

        bloco.innerHTML = `
            <div class="arcano-completo-img">
                <img src="${arcano.imagem_url}" alt="${arcano.nome}">
            </div>

            <div class="arcano-completo-info">
                <span class="subtitulo-arcano">Arcano Maior ${arcano.numero}</span>
                <h2>${arcano.nome}</h2>

                <div class="keywords-container">
                    ${palavrasHtml}
                </div>

                <h3>Mensagem Central</h3>
                <p>${arcano.mensagem_central}</p>

                <h3>Luz</h3>
                <p>${arcano.lado_luz}</p>

                <h3>Sombra</h3>
                <p>${arcano.lado_sombra}</p>

                <h3>Processo Alquímico</h3>
                <p>${arcano.processo_alquimico}</p>

                <h3>Conselho</h3>
                <p>${arcano.conselho}</p>

                <h3>Tendência simbólica</h3>
                <p>${arcano.previsao}</p>
            </div>
        `;

        container.appendChild(bloco);
    });
}
function inicializarTimelineJornada() {
    const timeline = document.getElementById('timeline-arcanos');

    if (!timeline) return;

    timeline.innerHTML = '';

    bancoDeCartas
        .sort((a, b) => a.numero - b.numero)
        .forEach(arcano => {
            const item = document.createElement('article');
            item.className = 'arcano-timeline';

            item.innerHTML = `
                <img src="${arcano.imagem_url}" alt="${arcano.nome}">

                <div class="arcano-texto">
                    <span class="numero">${arcano.numero}</span>
                    <h3>${arcano.nome}</h3>
                    <p>${arcano.mensagem_central}</p>
                </div>
            `;

            timeline.appendChild(item);
        });
}
// ==========================================================================
// 4. FUNÇÕES DO MODAL GLOBAL "CARTA DO DIA" (TODAS AS PÁGINAS)
// ==========================================================================
function inicializarCartaDoDia() {
    const btnCartaDia = document.getElementById('btn-trigger-carta-dia');
    const modal = document.getElementById('modal-carta-dia');
    const btnFechar = document.getElementById('btn-fechar-modal');

    const elementoNome = document.getElementById('nome-carta-dia');
    const elementoFoto = document.getElementById('foto-carta-dia');
    const elementoMensagem = document.getElementById('mensagem-carta-dia');

    if (!btnCartaDia || !modal || !btnFechar) return;

    btnCartaDia.addEventListener('click', () => {
        if (bancoDeCartas.length === 0) return;

        const indiceAleatorio = Math.floor(Math.random() * bancoDeCartas.length);
        const arcanoSorteado = bancoDeCartas[indiceAleatorio];

        elementoNome.innerText = `${arcanoSorteado.numero} - ${arcanoSorteado.nome}`;

        elementoMensagem.innerHTML = `
            <p style="margin-bottom: 1rem;">
                <strong>Orientação Central:</strong>
                ${arcanoSorteado.mensagem_central}
            </p>

            <p style="margin-bottom: 1rem; color: #7ee7a4;">
                <strong>Luz para Hoje:</strong>
                ${arcanoSorteado.lado_luz}
            </p>

            <p style="margin-bottom: 1rem; color: #ff7676;">
                <strong>Alerta de Sombra:</strong>
                ${arcanoSorteado.lado_sombra}
            </p>

            <p style="font-style: italic; color: #d4af37;">
                <strong>Conselho:</strong>
                ${arcanoSorteado.conselho}
            </p>
        `;

        elementoFoto.style.backgroundImage = `url('${arcanoSorteado.imagem_url}')`;
        elementoFoto.style.backgroundSize = 'contain';
        elementoFoto.style.backgroundRepeat = 'no-repeat';
        elementoFoto.style.backgroundPosition = 'center';

        elementoFoto.style.width = '220px';
        elementoFoto.style.height = '340px';

        elementoFoto.style.borderRadius = '12px';
        elementoFoto.style.border = '1px solid rgba(212, 175, 55, 0.3)';

        modal.classList.add('active');
    });

    btnFechar.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}
function inicializarListaArcanos() {
    const container = document.getElementById('lista-arcanos');

    if (!container) return;

    container.innerHTML = '';

    bancoDeCartas.forEach(arcano => {
        const palavrasHtml = arcano.palavras_chave
            .map(palavra => `<span class="badge">${palavra}</span>`)
            .join('');

        const bloco = document.createElement('article');
        bloco.className = 'bloco-arcano-completo';
        bloco.id = arcano.id;

        bloco.innerHTML = `
            <div class="arcano-completo-img">
                <img src="${arcano.imagem_url}" alt="${arcano.nome}">
            </div>

            <div class="arcano-completo-info">
                <span class="subtitulo-arcano">Arcano Maior ${arcano.numero}</span>
                <h2>${arcano.nome}</h2>

                <div class="keywords-container">
                    ${palavrasHtml}
                </div>

                <h3>Mensagem Central</h3>
                <p>${arcano.mensagem_central}</p>

                <h3>Luz</h3>
                <p>${arcano.lado_luz}</p>

                <h3>Sombra</h3>
                <p>${arcano.lado_sombra}</p>

                <h3>Processo Alquímico</h3>
                <p>${arcano.processo_alquimico}</p>

                <h3>Conselho</h3>
                <p>${arcano.conselho}</p>

                <h3>Tendência simbólica</h3>
                <p>${arcano.previsao}</p>
            </div>
        `;

        container.appendChild(bloco);
    });
}
function exibirInterpretacao(passado, presente, futuro) {
    const painel = document.getElementById('painel-leitura');
    if (!painel) return;

    const leituraPassado = interpretacoesTiragem[passado.id]?.passado;
    const leituraPresente = interpretacoesTiragem[presente.id]?.presente;
    const leituraFuturo = interpretacoesTiragem[futuro.id]?.futuro;

    painel.style.display = 'block';

    document.getElementById('nome-carta-revelada').innerText = 
        `Leitura da Tiragem`;

    const elementoReflexao = document.getElementById('texto-reflexao');

    elementoReflexao.innerHTML = `
        <div class="bloco-posicao-leitura">
            <h3>Passado • ${passado.nome}</h3>
            <p>${leituraPassado.interpretacao}</p>
        </div>

        <div class="bloco-posicao-leitura destaque-presente">
            <h3>Presente • ${presente.nome}</h3>
            <p>${leituraPresente.interpretacao}</p>

            <div class="bloco-reflexao-conselho">
                <p><strong>Pergunta de reflexão:</strong> ${leituraPresente.reflexao}</p>
                <p><strong>Conselho principal:</strong> ${leituraPresente.conselho}</p>
            </div>
        </div>

        <div class="bloco-posicao-leitura">
            <h3>Futuro • ${futuro.nome}</h3>
            <p>${leituraFuturo.interpretacao}</p>
        </div>
    `;
}
const perguntasQuiz = [
    {
        pergunta: "Qual arcano representa o início da jornada, o salto de fé e a abertura ao desconhecido?",
        opcoes: ["O Mago", "O Louco", "O Carro", "A Torre"],
        correta: "O Louco"
    },
    {
        pergunta: "Qual arcano está associado à vontade, manifestação e uso consciente dos recursos internos?",
        opcoes: ["O Mago", "A Lua", "O Diabo", "O Mundo"],
        correta: "O Mago"
    },
    {
        pergunta: "Qual arcano representa intuição, silêncio interior e mistério do inconsciente?",
        opcoes: ["A Imperatriz", "A Sacerdotisa", "A Justiça", "O Sol"],
        correta: "A Sacerdotisa"
    },
    {
        pergunta: "Qual arcano simboliza nutrição, fertilidade, criação e abundância?",
        opcoes: ["A Imperatriz", "A Torre", "O Eremita", "A Morte"],
        correta: "A Imperatriz"
    },
    {
        pergunta: "Qual arcano fala sobre estrutura, autoridade, limites e organização?",
        opcoes: ["O Imperador", "Os Enamorados", "A Estrela", "O Louco"],
        correta: "O Imperador"
    },
    {
        pergunta: "Qual arcano está ligado a escolhas, vínculos e alinhamento com valores internos?",
        opcoes: ["O Carro", "Os Enamorados", "O Julgamento", "A Lua"],
        correta: "Os Enamorados"
    },
    {
        pergunta: "Qual arcano representa crise, queda de estruturas falsas e revelação da verdade?",
        opcoes: ["A Torre", "A Temperança", "O Hierofante", "O Sol"],
        correta: "A Torre"
    },
    {
        pergunta: "Qual arcano simboliza esperança, cura e renovação após a tempestade?",
        opcoes: ["A Estrela", "O Diabo", "A Justiça", "O Enforcado"],
        correta: "A Estrela"
    },
    {
        pergunta: "Qual arcano representa ilusões, medos, sonhos e conteúdos profundos do inconsciente?",
        opcoes: ["A Lua", "O Sol", "O Mundo", "O Mago"],
        correta: "A Lua"
    },
    {
        pergunta: "Qual arcano representa integração, conclusão de ciclo e totalidade?",
        opcoes: ["O Mundo", "A Morte", "O Carro", "A Força"],
        correta: "O Mundo"
    }
];

let perguntaAtual = 0;
let pontuacaoQuiz = 0;
let respondeuQuiz = false;

function inicializarQuiz() {
    const perguntaEl = document.getElementById("quiz-pergunta");
    const opcoesEl = document.getElementById("quiz-opcoes");

    if (!perguntaEl || !opcoesEl) return;

    carregarPerguntaQuiz();
}

function carregarPerguntaQuiz() {
    respondeuQuiz = false;

    const pergunta = perguntasQuiz[perguntaAtual];

    document.getElementById("quiz-progresso").innerText =
        `Pergunta ${perguntaAtual + 1} de ${perguntasQuiz.length}`;

    document.getElementById("quiz-pontuacao").innerText =
        `Pontuação: ${pontuacaoQuiz}`;

    document.getElementById("quiz-pergunta").innerText = pergunta.pergunta;

    const opcoesEl = document.getElementById("quiz-opcoes");
    opcoesEl.innerHTML = "";

    pergunta.opcoes.forEach(opcao => {
        const botao = document.createElement("button");
        botao.className = "quiz-opcao";
        botao.innerText = opcao;

        botao.addEventListener("click", () => responderQuiz(botao, opcao));

        opcoesEl.appendChild(botao);
    });

    document.getElementById("btn-proxima-pergunta").style.display = "none";
}

function responderQuiz(botao, resposta) {
    if (respondeuQuiz) return;

    respondeuQuiz = true;

    const pergunta = perguntasQuiz[perguntaAtual];
    const botoes = document.querySelectorAll(".quiz-opcao");

    botoes.forEach(btn => {
        if (btn.innerText === pergunta.correta) {
            btn.classList.add("correta");
        }

        if (btn.innerText === resposta && resposta !== pergunta.correta) {
            btn.classList.add("errada");
        }
    });

    if (resposta === pergunta.correta) {
        pontuacaoQuiz++;
    }

    document.getElementById("quiz-pontuacao").innerText =
        `Pontuação: ${pontuacaoQuiz}`;

    document.getElementById("btn-proxima-pergunta").style.display = "inline-block";
}

document.addEventListener("click", function(e) {
    if (e.target && e.target.id === "btn-proxima-pergunta") {
        perguntaAtual++;

        if (perguntaAtual < perguntasQuiz.length) {
            carregarPerguntaQuiz();
        } else {
            finalizarQuiz();
        }
    }
});

function finalizarQuiz() {
    document.querySelector(".quiz-card").innerHTML = `
        <div class="quiz-resultado-final">
            <span class="subtitulo-arcano">Resultado final</span>

            <h2>${pontuacaoQuiz} de ${perguntasQuiz.length} acertos</h2>

            <p>
                ${mensagemResultadoQuiz(pontuacaoQuiz)}
            </p>

            <button class="btn-hero-ouro" onclick="location.reload()">
                Refazer Quiz
            </button>
        </div>
    `;
}

function mensagemResultadoQuiz(pontos) {
    if (pontos <= 3) {
        return "Você está começando sua jornada pelos Arcanos Maiores. Volte à Biblioteca e explore os símbolos com calma.";
    }

    if (pontos <= 7) {
        return "Você já reconhece muitos arquétipos do Tarot. Continue estudando para aprofundar luz, sombra e processo alquímico de cada carta.";
    }

    return "Excelente! Você demonstra uma boa compreensão simbólica dos Arcanos Maiores e da Jornada do Louco.";
}