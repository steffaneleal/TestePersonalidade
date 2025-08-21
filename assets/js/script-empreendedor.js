const form = document.getElementById('formulario');

// pop-up

form.addEventListener('submit', function(event){
    // Impede o envio padrão do formulário (que recarregaria a página)
    event.preventDefault();

    // catch and store values of url (GET)
    const parametros = new FormData(event.target);
    const respostas = Array.from(parametros.values());
    let analise;

    // sum values
    let sum = 0, i;
    for(i=0; i<respostas.length; i++){
        sum+=parseInt(respostas[i]);
    }

    // Análise de Resultados para detecção de Perfil Empreendedor
    const analiseResultados = (s) => {
        const grades = [
            [s > 90, "Seus resultados indicam que você é uma pessoa independente, criativa, disciplinada, confiante; com capacidade de assumir riscos e talento para identificar boas oportunidades de negócios. Portanto, você tem as características adequadas a um empresário de sucesso."],
            [s >= 70 && s <= 90, "Se os seus resultados situaram-no nesta faixa de pontuação, tudo indica que você pode vir a ser um empresário de sucesso. Todavia, é necessário que você procure adquirir mais autoconfiança, independência, criatividade e maior capacidade para enfrentar riscos. Use os resultados deste teste para identificar os pontos fracos e os pontos fortes de sua personalidade, visando superar os aspectos negativos e reforçar os positivos."],
            [s >= 50 && s < 70, "Os resultados mostram que você tem algum potencial para ser empreendedor. Mas, ainda é preciso desenvolver os atributos pessoais dos empresários de sucesso. Para isso, você deve preparar-se lendo mais sobre negócios, fazendo treinamentos para desenvolver sua criatividade, autodisciplina, confiança e capacidade de assumir riscos, e conversar com empresários bem-sucedidos para descobrir como eles chegaram lá."],
            [s >= 30 && s < 50, "Se você se situou nessa faixa de pontuação, é aconselhável que permaneça em seu emprego e não arrisque suas economias em um negócio próprio até desenvolver sua criatividade, ganhar mais segurança e confiança, aprendendo a correr riscos."],
            [s < 30, "Provavelmente, você leva uma vida profissional rotineira, sem grandes perspectivas, e prefere as coisas como estão."]
        ];
        
        return grades.find(([condition]) => condition)?.[1] || "Nota Por gentiliza, responda novamente ao questionário, Não conseguimos fazer a análise do seu Perfil com as informações coletadas.";
    };

    alert(analiseResultados(sum)+"                                                           Sua nota foi: "+sum);

})
