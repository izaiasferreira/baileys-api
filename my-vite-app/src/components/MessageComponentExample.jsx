import React from 'react'
import './MessageComponentExample.css'
import FilesForMessagesExample from './FilesForMessagesExample'
import BlockIcon from '@mui/icons-material/Block';
import parse from 'html-react-parser';
export default function MessageComponentExample({ text, toShow, typeMessage, url }) {
    function formatText(text) {
       if (text) {
        var string = text
        string =  string?.replace(/\_(.*?)\_/g, '<i>$1</i>');
        string = string?.replace(/\*(.*?)\*/g, '<b>$1</b>');
        string = string?.replace(/\-(.*?)\-/g, '<u>$1</u>');
        string = string?.replace(/\~(.*?)\~/g, '<s>$1</s>');
        return parse(string)
       }
    }
    if (typeMessage === 'deleteForAll') {
        return (
            <div className={toShow ? "message-container-client-example" : "message message-container-attendance-example"}>
                <div className="message-header">
                    <span className='arrow'></span>
                </div>
                <div className={typeMessage === 'text' ? "message-middle-text-example" : "message-middle-example"}>
                    <span className='delete-for-all-message'><BlockIcon />Esta mensagem foi excluída</span>
                </div>
            </div>
        )
    } else {
        return (
            <div className={toShow ? "message-container-client-example" : "message message-container-attendance-example"}>
                <div className="message-header">
                    <span className='arrow'></span>
                </div>

                <div className={typeMessage === 'text' ? "message-middle-text-example" : "message-middle-example"}>
                    <div className="message-middle-content-example">
                        {
                            typeMessage !== 'error' ?
                                <div className='content-example'>
                                    <FilesForMessagesExample url={url} typeMessage={typeMessage} />
                                    <div className="text-and-hour">
                                        {typeMessage !== 'audio' ? <span className='text-message'>
                                            {text || "ㅤ"}
                                        </span> : null}
                                        {/* {typeMessage !== 'error' ? <span className={toShow === true ? 'footer-hour' : 'footer-hour-attendance'} > {'00'}:{'00'} </span> : null} */}
                                    </div>
                                </div>
                                : <span className='error-message' onClick={() => {
                                    alert('Verifique sua conexão, se preciso desconecte e reconecte novamente do WhatsApp.')
                                }}> <i className='bx bxs-error-circle'></i> Erro </span>
                        }
                    </div>
                </div>
            </div>
        )
    }

}