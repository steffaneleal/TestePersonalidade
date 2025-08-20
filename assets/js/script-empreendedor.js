var formulario;
var i, pontos;


formulario.addEventListener('submit', function(event) {
    // Impede o envio padrão do formulário (que recarregaria a página)
    event.preventDefault();
    for(i=1; i<4; i++){
        formulario = document.getElementById('form'+1);
        
        const botoesRadio = document.getElementsByClassName('alternativa');
        let valorSelecionado = null;

        for (const radio of botoesRadio) {
            // Verifica se o rádio atual está marcado (checked)
            if (radio.checked) {
                // Se estiver, pega seu valor e para o loop
                valorSelecionado = radio.value;
                pontos += valorSelecionado;
                break;
            }
        }

    }
    console.log(pontos);
})


/*
// Obtém o formulário pelo seu ID
const formulario = document.getElementById('formulario-cores');

// Adiciona um "ouvinte" de evento para o envio do formulário
formulario.addEventListener('submit', function(event) {
    // Impede o envio padrão do formulário (que recarregaria a página)
    event.preventDefault();

    // Obtém todos os inputs com o name "cor"
    const botoesRadio = document.getElementsByName('cor');

    let valorSelecionado = null;

    // Itera sobre todos os botões de rádio
    for (const radio of botoesRadio) {
        // Verifica se o rádio atual está marcado (checked)
        if (radio.checked) {
            // Se estiver, pega seu valor e para o loop
            valorSelecionado = radio.value;
            break;
        }
    }

    // Pega o elemento onde o resultado será exibido
    const resultadoDiv = document.getElementById('resultado');

    // Verifica se algum rádio foi selecionado
    if (valorSelecionado) {
        resultadoDiv.textContent = `Você selecionou: ${valorSelecionado}`;
        console.log(`Valor do rádio selecionado: ${valorSelecionado}`);
    } else {
        resultadoDiv.textContent = 'Por favor, selecione uma opção.';
        console.log('Nenhuma opção selecionada.');
    }
});*/