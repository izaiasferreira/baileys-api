import React, { useContext, useEffect, useState } from 'react'
import './FilesForMessages.css'
import { AppContext } from '../contexts/userData';
import Audio from "./Audio";
import Video from "./Video";
import parse from 'html-react-parser';
export default function FilesForMessages({ m }) {
    const { setModalImage, setModalImageContent } = useContext(AppContext)
    const { type } = m
    const [file, setFile] = useState('')

    useEffect(() => {
        if (m?.file) {
            // setFile(`${FILES_API_URL}/${m.file.bucketName}?path=${m.file.path}`)
            setFile(m.file.url)
        }
    }, [m])

    function formatText(text) {
        var string = text
        if (string && typeof string === 'string') {
            string = string?.replace(/\_(.*?)\_/g, '<i>$1</i>');
            string = string?.replace(/\*(.*?)\*/g, '<b>$1</b>');
            string = string?.replace(/\-(.*?)\-/g, '<u>$1</u>');
            string = string?.replace(/\~(.*?)\~/g, '<s>$1</s>');
            return parse(string)
        }
        return toString(text)
    }
    if (type?.typeMessage?.includes('image') || (typeof type === 'string' && type?.includes('image'))) {
        return (
            <div className='files-container' onClick={() => {
                setModalImage(true)
                setModalImageContent(document.getElementById(m._id + 'image').src)
            }}>
                <img className='img' id={m._id + 'image'} src={file} alt={m?.file?.name} title={m?.file?.description || `Imagem de ${m?.from?.name}`}
                    onError={(event) => {
                        event.target.src = '/img/image-error.png'
                    }} />

            </div>
        )
    }
    else if (m?.type?.typeMessage?.includes('audio') || (typeof type === 'string' && type?.includes('audio'))) {
        return (
            <div className='files-container' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
                <Audio url={file} id={m?._id + m?.controlId + '-audio'} />
                {m?.file?.transcription ? <p className='transcription' style={{
                    width: '14rem',
                    opacity: '0.7',
                    fontSize: '8pt',
                    textAlign: 'justify',
                    padding: '.5rem',
                    marginBottom: '1rem',
                    borderRadius: '.2rem'
                }}>{formatText(m?.file?.transcription)}</p> : null}
            </div>
        )
    }
    else if (m?.type?.typeMessage === 'video' || (typeof type === 'string' && type?.includes('video'))) {
        return (
            <div className='files-container' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Video url={file} id={m._id + 'video'} />
            </div>
        )
    }
    else if (m?.type?.typeMessage?.includes('document') || (typeof type === 'string' && type?.includes('document'))) {
        return (
            <div className='files-container' style={{ padding: '1rem' }}>
                <div className='files-content-document' >
                    <i className='bx bxs-file-blank'></i>
                    <div className="text" style={{ minWidth: '10rem' }}>
                        <a href={file}>
                            {m?.file?.originalname ?
                                m?.file?.originalname?.length > 46 ?
                                    m?.file?.originalname.substring(0, 46) + '...'
                                    : m?.file?.originalname
                                : 'Documento'
                            }</a>
                        {
                            m?.type?.typeMessage?.indexOf('response/document') >= 0 ?
                                <div className="span"> {m?.type?.originalname?.length || 'Documento sem nome'}</div> :
                                <div className="span">{
                                    m?.file?.mimetype?.toString()?.toUpperCase()?.length > 20 ?
                                        m?.file?.mimetype?.toString()?.toUpperCase()?.substring(0, 20) + '...'
                                        : m?.file?.mimetype?.toString()?.toUpperCase()
                                }</div>
                        }
                    </div>

                </div>
            </div>
        )
    } else {
        return null
    }
}
