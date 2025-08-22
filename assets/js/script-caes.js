// Adiciona um "escutador" de eventos ao formulário. A função será executada quando o formulário for enviado.
document.getElementById('caes-form').addEventListener('submit', function(event) {
    // Previne o comportamento padrão do formulário, que é recarregar a página.
    event.preventDefault();

    const respostas = {};
    // Coleta os valores de todas as 55 perguntas.
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

    // Verifica se todas as perguntas foram respondidas.
    if (Object.keys(respostas).length < 55) {
        alert('Por favor, responda a todas as 55 perguntas antes de submeter.');
        return;
    }

    // --- Início dos Cálculos ---

    // Mapeamento das perguntas para cada CAE, conforme a "Folha de Avaliação".
    const caes = {
        "Busca de oportunidades e iniciativa": [1, 12, 23, 34, 45],
        "Persistência": [2, 13, 24, 35, 46],
        "Comprometimento": [3, 14, 25, 36, 47],
        "Exigência de qualidade e eficiência": [4, 15, 26, 37, 48],
        "Correr riscos calculados": [5, 16, 27, 38, 49],
        "Estabelecimento de metas": [6, 17, 28, 39, 50],
        "Busca de informações": [7, 18, 29, 40, 51],
        "Planejamento e monitoramento sistemáticos": [8, 19, 30, 41, 52],
        "Persuasão e rede de contatos": [9, 20, 31, 42, 53],
        "Independência e autoconfiança": [10, 21, 32, 43, 54]
    };

    const fatorCorrecaoPerguntas = [11, 22, 33, 44, 55];

    // Calcula a pontuação original para cada CAE.
    const pontuacaoOriginal = {};
    for (const cae in caes) {
        let soma = caes[cae].reduce((total, pergunta) => total + respostas[pergunta], 0);
        
        // A fórmula de ajuste varia para cada CAE na folha de avaliação.
        if (cae === "Exigência de qualidade e eficiência") {
            pontuacaoOriginal[cae] = soma + 0; // Conforme a folha, soma-se 0.
        } else {
            pontuacaoOriginal[cae] = soma + 6; // Para os demais, soma-se 6.
        }
    }

    // Calcula o "Fator de Correção".
    let totalFatorCorrecao = fatorCorrecaoPerguntas.reduce((total, pergunta) => total + respostas[pergunta], 0) + 18;

    // Determina o valor a ser diminuído da pontuação de cada CAE.
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

    // Calcula a pontuação final corrigida.
    const pontuacaoCorrigida = {};
    for (const cae in pontuacaoOriginal) {
        pontuacaoCorrigida[cae] = pontuacaoOriginal[cae] - valorDiminuir;
    }

    // --- Exibição dos Resultados ---
    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = `
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
    `;

    // Mostra o container de resultados e esconde o formulário.
    document.getElementById('resultado-container').style.display = 'block';
    document.getElementById('caes-form').style.display = 'none';
    
    // Rola a página para o topo dos resultados para que o usuário veja a pontuação.
    document.getElementById('resultado-container').scrollIntoView({ behavior: 'smooth' });
});
