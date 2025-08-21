const form = document.getElementById('formulario');

// pop-up

form.addEventListener('submit', function(event){
    // Impede o envio padrão do formulário (que recarregaria a página)
    event.preventDefault();

    // catch and store values of url (GET)
    const parametros = new FormData(event.target);
    const respostas = Array.from(parametros.values());

    // sum values
    let sum = 0, i;
    for(i=0; i<respostas.length; i++){
        sum+=parseInt(respostas[i]);
    }

    alert("A sua nota é: "+sum);

})
