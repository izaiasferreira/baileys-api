export default function getType(message) {
    if (message) {
        if (message?.type?.typeMessage === 'text') {
            return message?.text?.length > 35 ? message?.text.substring(0, 35) + '...' : message?.text
        }
        else if (message?.type?.typeMessage === 'image' || message?.type?.typeMessage === 'response/image') {
            if (message?.text) {
                return <div>
                    <i className='bx bxs-image-alt' > </i> {message?.text.length > 35 ? message?.text.substring(0, 35) + '...' : message?.text}
                </div>
            } else {
                return <div>
                    <i className='bx bxs-image-alt' ></i> Foto
                </div>
            }
        }
        else if (message?.type?.typeMessage === 'sticker' || message?.type?.typeMessage === 'response/sticker') {
            return <div>
                <i className='bx bx-sticker' ></i> Sticker
            </div>
        }
        else if (message?.type?.typeMessage === 'video' || message?.type?.typeMessage === 'response/video') {
            if (message?.text) {
                return <div>
                    <i className='bx bxs-video' ></i> {message?.text.length > 35 ? message?.text.substring(0, 35) + '...' : message?.text}
                </div>
            } else {
                return <div>
                    <i className='bx bxs-video' ></i> Video
                </div>
            }
        }
        else if (message?.type?.typeMessage === 'audio' || message?.type?.typeMessage === 'response/audio') {
            return <div>
                <i className='bx bxs-microphone' ></i> Audio
            </div>
        }
        else if (message?.type?.typeMessage === 'deleteForAll') {
            return <div>
                <i className='bx bx-block'></i> Mensagem apagada
            </div>
        }
        else if (message?.type?.typeMessage === 'error') {
            return <div>
                <i className='bx bxs-error-circle' ></i> Erro no Envio
            </div>
        }
        else if (message?.type?.typeMessage.substring(0, message?.type.typeMessage.indexOf('/')) === 'document') {
            if (message?.text) {
                return <div>
                    <i className='bx bxs-file-blank'></i>{message?.text.length > 35 ? message?.text.substring(0, 35) + '...' : message?.text}
                </div>
            } else {
                return <div>
                    <i className='bx bxs-file-blank'></i> Documento
                </div>
            }
        }
        else if (message?.type?.typeMessage === 'anotation') {
            return <div>
                    <i className='bx bxs-message-square-edit' ></i> Anotação
                </div>
        }
        else {
            return "..."
        }
    } else { return '...' }
}
