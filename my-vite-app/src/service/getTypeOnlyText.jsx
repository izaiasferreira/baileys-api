export default function getTypeOnlyText(message) {
    if (message) {
        console.log(message?.type?.typeMessage);
        if (message?.type?.typeMessage === 'text') {
            return message?.text?.length > 35 ? message?.text.substring(0, 35) + '...' : message?.text
        }
        else if (message?.type?.typeMessage === 'image' || message?.type?.typeMessage === 'response/image') {
            if (message?.text) {
                return 'FOTO - ' + message?.text.length > 35 ? message?.text.substring(0, 35) + '...' : message?.text
            } else {
                return 'Enviou uma FOTO'
            }
        }
        else if (message?.type?.typeMessage === 'sticker' || message?.type?.typeMessage === 'response/sticker') {
            return 'STICKER'
        }
        else if (message?.type?.typeMessage === 'video' || message?.type?.typeMessage === 'response/video') {
            if (message?.text) {
                return 'VIDEO - ' + message?.text.length > 35 ? message?.text.substring(0, 35) + '...' : message?.text
            } else {
                return 'Enviou um VIDEO'
            }
        }
        else if (message?.type?.typeMessage === 'audio' || message?.type?.typeMessage === 'response/audio') {
            return 'AUDIO'
        }
        else if (message?.type?.typeMessage === 'deleteForAll') {
            return 'MENSAGEM APAGADA'
        }
        else if (message?.type?.typeMessage === 'error') {
            return '! - ERRO NO ENVIO'
        }
        else if (message?.type?.typeMessage === 'template_whatsapp_business_account') {
            return 'TEMPLATE'
        }
        else if (message?.type?.typeMessage.substring(0, message?.type.typeMessage.indexOf('/')) === 'document') {
            if (message?.text) {
                return 'DOCUMENTO - ' + message?.text.length > 35 ? message?.text.substring(0, 35) + '...' : message?.text
            } else {
                return 'Enviou um DOCUMENTO'

            }
        }
        else if (message?.type?.typeMessage.substring(0, message?.type.typeMessage.indexOf('/')) === 'anotation') {
          return 'ANOTAÇÃO'
        }
        else {
            return "..."
        }
    } else { return '...' }
}