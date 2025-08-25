document.getElementById('caes-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Coletar todas as respostas
    const respostas = {};
    for (let i = 1; i <= 55; i++) {
        const radios = document.getElementsByName('pergunta_' + i);
        for (const radio of radios) {
            if (radio.checked) {
                respostas[i] = parseInt(radio.value, 10);
                break;
            }
        }
    }

    // Verificar se todas as perguntas foram respondidas
    if (Object.keys(respostas).length < 55) {
        alert('Por favor, responda a todas as 55 perguntas antes de submeter.');
        return;
    }

    // Mapeamento das características empreendedoras (CAES) conforme o PDF
    const caes = {
        "Busca de oportunidades e iniciativa": [1, 12, 23, -34, 45],
        "Persistência": [2, 13, 24, -35, 46],
        "Comprometimento": [3, 14, 25, 36, -47], 
        "Exigência de qualidade e eficiência": [4, 15, 26, 37, 48],
        "Correr riscos calculados": [5, 16, 27, -38, 49],
        "Estabelecimento de metas": [6, -17, 28, 39, 50], 
        "Busca de informações": [7, 18, -29, 40, 51],
        "Planejamento e monitoramento sistemáticos": [8, 19, 30, -41, 52],
        "Persuasão e rede de contatos": [9, -20, 31, 42, 53],
        "Independência e autoconfiança": [10, -21, 32, 43, 54]
    };  

    // Perguntas para o fator de correção (com inversão onde necessário)
    const fatorCorrecaoPerguntas = [11, -22, -33, -44, 55];

    // Função para obter o valor da resposta, invertendo se necessário
    const getValor = (pergunta) => {
        const inverte = pergunta < 0;
        const perguntaId = Math.abs(pergunta);
        const valor = respostas[perguntaId];
        return inverte ? 6 - valor : valor;
    };

    // Calcular pontuação original para cada CAE
    const pontuacaoOriginal = {};
    for (const cae in caes) {
        let soma = caes[cae].reduce((total, pergunta) => total + getValor(pergunta), 0);
        
        // Adicionar a constante conforme especificado no PDF
        if (cae === "Exigência de qualidade e eficiência") {
            soma += 0; // +0 conforme a fórmula no PDF
        } else {
            soma += 6; // +6 para todas as outras CAES
        }
        
        pontuacaoOriginal[cae] = soma;
    }

    // Calcular o fator de correção
    let totalFatorCorrecao = fatorCorrecaoPerguntas.reduce((total, pergunta) => total + getValor(pergunta), 0);
    
    // Adicionar a constante de +18 conforme especificado no PDF
    totalFatorCorrecao += 18;

    // Determinar o valor a ser diminuído conforme a tabela do PDF
    let valorDiminuir = 0;
    if (totalFatorCorrecao >= 24) {
        valorDiminuir = 7;
    } else if (totalFatorCorrecao >= 22) {
        valorDiminuir = 5;
    } else if (totalFatorCorrecao >= 20) {
        valorDiminuir = 3;
    } else {
        valorDiminuir = 0;
    }

    // Calcular pontuação final corrigida
    const pontuacaoCorrigida = {};
    for (const cae in pontuacaoOriginal) {
        pontuacaoCorrigida[cae] = Math.max(0, pontuacaoOriginal[cae] - valorDiminuir);
    }

    // Exibir resultados
    let resultadosDiv = document.getElementById('resultados');
    if (!resultadosDiv) {
        resultadosDiv = document.createElement('div');
        resultadosDiv.id = 'resultados';
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
            
            <br>

            <div class="button">
                <button type="button" id="refazer-teste-btn" class="test-button">
                    <span>Refazer Teste</span>
                    <i class="fas fa-redo"></i>
                </button>
            </div>
        </div>

        <style>
    /* Estilos para os resultados do teste CAES */
    .resultado-container {
        background: white;
        border-radius: 20px;
        padding: 2rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        margin: 2rem auto;
        max-width: 800px;
        border: 1px solid #e2e8f0;
    }

    .resultado-container h3 {
        font-size: 1.8rem;
        color: var(--azul-prussian);
        margin-bottom: 1.5rem;
        text-align: center;
        font-weight: 700;
    }

    .resultado-container p {
        margin-bottom: 1rem;
        color: var(--cinza-medio);
        text-align: center;
    }

    .resultado-container hr {
        border: none;
        height: 1px;
        background: linear-gradient(to right, transparent, var(--azul-claro), transparent);
        margin: 1.5rem 0;
    }

    .resultado-container table {
        width: 100%;
        border-collapse: collapse;
        margin: 1.5rem 0;
    }

    .resultado-container th {
        background: var(--gradiente-primary);
        color: white;
        padding: 12px 15px;
        text-align: left;
        font-weight: 600;
    }

    .resultado-container tr:nth-child(even) {
        background-color: #f8fafc;
    }

    .resultado-container td {
        padding: 12px 15px;
        border-bottom: 1px solid #e2e8f0;
        color: var(--cinza-escuro);
    }

    .resultado-container tr:hover td {
        background-color: rgba(56, 174, 204, 0.1);
    }

    /* Botão de refazer teste */
    #refazer-teste-btn {
        background: var(--gradiente-secondary);
        margin-top: 1.5rem;
        transition: all 0.3s ease;
    }

    #refazer-teste-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(56, 174, 204, 0.3);
    }

    /* Barra de progresso visual para as pontuações */
    .pontuacao-barra {
        height: 8px;
        background: #e2e8f0;
        border-radius: 4px;
        margin-top: 5px;
        overflow: hidden;
    }

    .pontuacao-preenchimento {
        height: 100%;
        background: var(--gradiente-primary);
        border-radius: 4px;
        transition: width 1s ease-in-out;
    }

    /* Mensagem de interpretação */
    .interpretacao {
        margin-top: 2rem;
        padding: 1.5rem;
        background: rgba(56, 174, 204, 0.1);
        border-radius: 12px;
        border-left: 4px solid var(--ciano);
    }

    .interpretacao h4 {
        color: var(--azul-prussian);
        margin-bottom: 0.5rem;
    }

    /* Responsividade para a tabela de resultados */
    @media (max-width: 768px) {
        .resultado-container {
            padding: 1.5rem;
            margin: 1rem;
        }
        
        .resultado-container table {
            font-size: 0.9rem;
        }
        
        .resultado-container th, 
        .resultado-container td {
            padding: 8px 10px;
        }
    }

    @media (max-width: 480px) {
        .resultado-container {
            padding: 1rem;
        }
        
        .resultado-container h3 {
            font-size: 1.5rem;
        }
        
        .resultado-container table {
            font-size: 0.8rem;
        }
    }
</style>
    `;

    // Adicionar evento para o botão de refazer teste
    document.getElementById('refazer-teste-btn').addEventListener('click', function() {
        window.location.reload();
    });

    // Rolar para os resultados
    resultadosDiv.scrollIntoView({ behavior: 'smooth' });
});