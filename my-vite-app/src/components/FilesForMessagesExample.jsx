import React, { useContext } from 'react'
import './FilesForMessages.css'
import { AppContext } from '../contexts/userData';
import Audio from "./Audio";
import Video from "./Video";
import { v4 as uuidv4 } from 'uuid';
import parse from 'html-react-parser';
export default function FilesForMessages({ type, data }) {


    if (type?.includes('text')) {
        return (
            <div className='files-container'>
                <span style={{fontWeight: 'bold', padding: '0.5rem'}}>{data}</span>
            </div>
        )
    }
    else if (type?.includes('image')) {
        // console.log(data);
        return (
            <div className='files-container'>
                <img className='img' id={'file-image'} src={data} alt='image'
                    onError={(event) => {
                        event.target.src = '/img/image-error.png'
                    }} />

            </div>
        )
    }
    else if (type?.includes('audio')) {
        return (
            <div className='files-container'>
                <Audio url={data} id={'file-audio'} />
            </div>
        )
    }
    else if (type?.includes('video')) {
        return (
            <div className='files-container' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Video url={data} id={uuidv4()} />
            </div>
        )
    }
    else if (type?.includes('document')) {
        return (
            <div className='files-container'>
                <div className='files-content-document' >
                    <i className='bx bxs-file-blank'></i>
                    <div className="text" style={{ minWidth: '15rem' }}>
                        <a href={data}>Documento</a>
                    </div>

                </div>
            </div>
        )
    } else {
        return null
    }
}
