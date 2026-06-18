- Objetivo:
Plataforma educacional sobre os Arcanos Maiores do Tarot. O projeto utiliza a Jornada do Louco como estrutura de aprendizado, oferecendo biblioteca dos arcanos, tiragens reflexivas, quiz interativo e recursos de autoconhecimento.

- Estrutura:
index.html
biblioteca.html
jornada.html
praticar.html
quiz.html
sobre.html
style.css
script.js
arcanos.json
interpretacoes_tiragem.json

- Principais Funcionalidades: 
Biblioteca dos 22 Arcanos
Jornada do Louco
Carta do Dia
Tiragem Passado-Presente-Futuro
Modelos de Tiragens
Quiz aleatório
Interpretações específicas por posição

- Funcionamento do Sistema:

O sistema foi desenvolvido utilizando HTML, CSS, JavaScript e arquivos JSON para armazenamento dos dados dos Arcanos Maiores e das interpretações das tiragens.

Ao acessar o site, o arquivo `script.js` realiza o carregamento dos dados contidos em `arcanos.json` e `interpretacoes_tiragem.json` através da API `fetch()`. Esses arquivos funcionam como um banco de dados local da aplicação.

A página inicial apresenta o objetivo da plataforma e fornece acesso às principais funcionalidades do sistema. Também disponibiliza o recurso "Carta do Dia", que sorteia aleatoriamente um Arcano Maior e exibe uma mensagem de reflexão para o usuário.

A página Biblioteca exibe os 22 Arcanos Maiores de forma dinâmica, utilizando os dados armazenados em `arcanos.json`. Cada carta pode ser selecionada para acessar uma página detalhada contendo seus significados, palavras-chave, aspectos de luz e sombra, processo alquímico e simbolismos.

A página Jornada do Louco apresenta uma visão estruturada da jornada de individuação representada pelos Arcanos Maiores. Os arcanos são organizados em etapas de desenvolvimento psicológico e espiritual, permitindo ao usuário compreender a progressão simbólica da narrativa do Louco até o Mundo.

A funcionalidade de prática realiza uma tiragem aleatória de três cartas representando: Passado, Presente e Futuro
Após o sorteio, o sistema consulta o arquivo `interpretacoes_tiragem.json` e apresenta interpretações específicas para cada posição.
A posição Presente recebe destaque especial, exibindo interpretação principal, pergunta de reflexão e conselho para o momento atual. Essa abordagem transforma a tiragem em uma ferramenta de autoconhecimento e reflexão simbólica.

A página Quiz utiliza um banco de perguntas sobre os Arcanos Maiores e a Jornada do Louco.
A cada acesso são selecionadas aleatoriamente 10 perguntas dentre um conjunto maior armazenado no próprio sistema. O usuário responde às questões e recebe uma pontuação ao final, incentivando o aprendizado progressivo dos conteúdos estudados.

O recurso Carta do Dia está disponível em todas as páginas do sistema através da barra de navegação. Ao ser acionado, o sistema sorteia um Arcano Maior e apresenta uma mensagem baseada nos significados da carta selecionada.

- Sobre a organização dos Dados:
O sistema utiliza dois arquivos JSON principais:
1. arcanos.json

* Informações completas dos 22 Arcanos Maiores.
* Nome da carta.
* Número.
* Imagem.
* Palavras-chave.
* Luz e sombra.
* Processo alquímico.
* Conselhos gerais.

2. interpretacoes_tiragem.json

* Interpretações específicas para as posições:
  * Passado
  * Presente
  * Futuro
* Perguntas de reflexão.
* Conselhos contextualizados para a prática de autoconhecimento.

Essa estrutura me permite separar conteúdo e programação, facilitando futuras expansões e manutenções do sistema.
