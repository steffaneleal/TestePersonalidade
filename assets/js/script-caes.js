document.getElementById('caes-form').addEventListener('submit', function(event) {
    // previne o recarregamento da página.
    event.preventDefault();

    const respostas = {};
    // coleta os valores de todas as perguntas.
    for (let i = 1; i <= 55; i++) {
        const radios = document.getElementsByName('pergunta_' + i);
        for (const radio of radios) {
            if (radio.checked) {
                // Converte o valor para número e armazena.
                respostas[i] = parseInt(radio.value, 10);
                break;
            }
        }
    }

    // verifica se todas as perguntas foram respondidas.
    if (Object.keys(respostas).length < 55) {
        alert('Por favor, responda a todas as 55 perguntas antes de submeter.');
        return;
    }

    // INÍCIO DOS CÁLCULOS

    // mapeamento das perguntas para cada CAE.
    // as perguntas com pontuação invertida (onde 5 vira 1, 4 vira 2, etc.) são marcadas com um sinal de menos.
    const caes = {
        "Busca de oportunidades e iniciativa": [1, 12, 23, -34, 45],
        "Persistência": [2, 13, 24, -35, 46],
        "Comprometimento": [3, 14, 25, 36, -47],
        "Exigência de qualidade e eficiência": [4, 15, 26, 37, 48],
        "Correr riscos calculados": [5, -16, 27, 38, 49],
        "Estabelecimento de metas": [6, -17, 28, 39, 50],
        "Busca de informações": [7, 18, -29, 40, 51],
        "Planejamento e monitoramento sistemáticos": [8, 19, 30, -41, 52],
        "Persuasão e rede de contatos": [9, -20, 31, 42, 53],
        "Independência e autoconfiança": [10, -21, 32, 43, 54]
    };

    const fatorCorrecaoPerguntas = [11, 22, -33, -44, 55];

    // função para obter o valor da resposta, invertendo a pontuação se a pergunta for negativa.
    const getValor = (pergunta) => {
        const inverte = pergunta < 0;
        const perguntaId = Math.abs(pergunta);
        const valor = respostas[perguntaId];
        return inverte ? 6 - valor : valor;
    };

    // calcula a pontuação original para cada CAE.
    const pontuacaoOriginal = {};
    for (const cae in caes) {
        let soma = caes[cae].reduce((total, pergunta) => total + getValor(pergunta), 0);
        pontuacaoOriginal[cae] = soma;
    }

    // calcula o "Fator de Correção".
    let totalFatorCorrecao = fatorCorrecaoPerguntas.reduce((total, pergunta) => total + getValor(pergunta), 0);

    // determina o valor a ser diminuído da pontuação de cada CAE, conforme a "Folha para Corrigir a Pontuação".
    let valorDiminuir = 0;
    if (totalFatorCorrecao >= 24) { // 24 ou 25
        valorDiminuir = 7;
    } else if (totalFatorCorrecao >= 22) { // 22 ou 23
        valorDiminuir = 5;
    } else if (totalFatorCorrecao >= 20) { // 20 ou 21
        valorDiminuir = 3;
    } else { // 19 ou menos
        valorDiminuir = 0;
    }

    // calcula a pontuação final corrigida.
    const pontuacaoCorrigida = {};
    for (const cae in pontuacaoOriginal) {
        pontuacaoCorrigida[cae] = pontuacaoOriginal[cae] - valorDiminuir;
    }

    // EXIBIÇÃO DOS RESULTADOS
    // cria o container de resultado se ele não existir no HTML.
    let resultadosDiv = document.getElementById('resultados');
    if (!resultadosDiv) {
        resultadosDiv = document.createElement('div');
        resultadosDiv.id = 'resultados';
        // adiciona a div de resultados logo após o container do questionário.
        document.querySelector('.questionario-container').appendChild(resultadosDiv);
    }
    
    resultadosDiv.innerHTML = `
        <div class="resultado-container" id="resultado-container">
            <h3>Folha de Pontuação Corrigida</h3>
            <p><strong>Total do Fator de Correção:</strong> ${totalFatorCorrecao}</p>
            <p><strong>Valor de Correção Aplicado:</strong> -${valorDiminuir} pontos em cada característica.</p>
            <hr>
            <table>
                <thead>
                    <tr>
                        <th>Característica Empreendedora (CAE)</th>
                        <th>Pontuação Final</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.keys(pontuacaoCorrigida).map(cae => `
                        <tr>
                            <td>${cae}</td>
                            <td>${pontuacaoCorrigida[cae]}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <!-- Botão para refazer o teste -->
            <div class="button">
                <button type="button" id="refazer-teste-btn" class="test-button">
                    <span>Refazer Teste</span>
                    <i class="fas fa-redo"></i>
                </button>
            </div>
        </div>
    `;

    // adiciona o evento de clique ao novo botão
    document.getElementById('refazer-teste-btn').addEventListener('click', function() {
        // recarrega a página para reiniciar o teste
        window.location.reload();
    });

    // esconde o formulário para focar nos resultados.
    document.getElementById('caes-form').style.display = 'none'; // tirar isso aqui
    
    // rola a página para o topo dos resultados para que o usuário veja a pontuação.
    resultadosDiv.scrollIntoView({ behavior: 'smooth' });
});
