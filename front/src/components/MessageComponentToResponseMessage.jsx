
import './MessageComponentToResponseMessage.css'
import React from 'react'

export default function MessageComponentToResponseMessage({ text, typeMessage, file }) {
    
    function configureMedia(type, file) {
       
        if (type === 'video') {
            return (
                <div className="thumb">
                    <i className='bx bxs-video'></i>
                    <video className='thumb-response'>
                        <source src={file.url} type="video/mp4" />
                    </video>
                </div>
            )
        } else if (type === 'image') {
            return (
                <div className="thumb">
                    <i className='bx bxs-image' ></i>
                    <img className='thumb-response' src={file.url} alt="" />
                </div>
            )
        } 
        else if (type === 'sticker') {
            return (
                <div className="thumb">
                    <i className='bx bx-sticker' ></i>
                    <img className='thumb-response' src={file.url} alt="" />
                </div>
            )
        }
        else if (type === 'audio') {
            return (
                <div className="thumb">
                    <i className='bx bxs-microphone' ></i>
                    <div className="thumb-response-div"></div>
                </div>
            )
        }
        else if (type.substring(0, type.indexOf('/')) === 'document') {
            return (
                <div className="thumb">
                    <i className='bx bxs-file-blank' ></i>
                    <div className="thumb-response-div"></div>
                </div>
            )
        }
        else {
            return null
        }
    }
    return (
        <div className="message-container-response-chindren" >
            <div className="bar"></div>
            {file ? configureMedia(typeMessage, file) : null}
            <span className='text-message-response' >
                {text}
            </span>
        </div>
    )
}