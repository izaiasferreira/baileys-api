

export default function playAudio(url) {
    // Criar um contexto de áudio
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Fazer uma requisição para carregar o arquivo de áudio
    const audioUrl = url;
    const request = new XMLHttpRequest();
    request.open('GET', audioUrl, true);
    request.responseType = 'arraybuffer';

    // Manipular o retorno da requisição
    request.onload = function () {
        const audioData = request.response;

        // Decodificar o arquivo de áudio
        audioContext.decodeAudioData(audioData, function (buffer) {
            // Criar um nó de fonte de áudio
            const source = audioContext.createBufferSource();
            source.buffer = buffer;

            // Conectar o nó de fonte de áudio ao destino de saída (alto-falantes)
            source.connect(audioContext.destination);

            // Reproduzir o áudio
            source.start(0);
        });
    };

    // Enviar a requisição para carregar o arquivo de áudio
    request.send();
}