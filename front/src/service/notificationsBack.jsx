

export default function notification(title, body) {
    if ("Notification" in window) {
        // Verifica se as notificações estão permitidas pelo usuário
        if (Notification.permission === "granted") {
            // Envia a notificação
            new Notification(title, {
                body: body,
                icon: REACT_APP_BRAND === 'FLOWTALK' ? "./img/simbol-default-flowtalk.png" : "./img/simbol-default.png" // Opcional: Ícone da notificação
            });
        } else if (Notification.permission !== "denied") {
            // Solicita permissão ao usuário para exibir notificações
            Notification.requestPermission(function (permission) {
                if (permission === "granted") {
                    // Envia a notificação
                    new Notification(title, {
                        body: body,
                        icon: "./img/simbol-default.png" // Opcional: Ícone da notificação
                    });
                }
            });
        }
    }
}