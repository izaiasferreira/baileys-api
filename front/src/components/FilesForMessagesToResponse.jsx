import React from 'react'
import './FilesForMessagesToResponse.css'
import MicIcon from '@mui/icons-material/Mic';
export default function FilesForMessagesToResponse({ url, typeMessage }) {

    if (typeMessage === 'image' || typeMessage === 'response/image') {
        return (
            <div className='files-container-response'>
                <img src={url} alt='' />
            </div>
        )
    }
    else if (typeMessage === 'sticker' || typeMessage === 'response/sticker') {
        return (
            <div className='files-container-response'>
                <img src={url} alt='' />
            </div>
        )
    }
    else if (typeMessage === 'audio' || typeMessage === 'response/audio') {
        return (
            <div className='files-container-response'>
                <span style={{ display: 'flex', padding: 1 + 'rem' }}>
                    <MicIcon />
                </span>
            </div>
        )
    }
    else if (typeMessage === 'video' || typeMessage === 'response/video') {
        return (
            <div className='files-container-response'>
                <video>
                    <source src={url} type="video/mp4" />
                </video>
            </div>
        )
    }
    else if (typeMessage.substring(0, typeMessage.indexOf('/')) === 'document' || typeMessage === 'response/document') {
        return (
            <div className='files-content-document-response'>
                <i className='bx bxs-file-blank'></i>
            </div>
        )
    }
    else {
        return null
    }/**/
}