
import './MessageResponseArea.css'
import React from 'react'
import FilesForMessagesToResponse from './FilesForMessagesToResponse'
import { useEffect } from 'react';
import { useState } from 'react';
import IconButton from './IconButton';

export default function MessageResponseArea({ message: m, onClose }) {
    const [message, setMessage] = useState(null)
    useEffect(() => {
        setMessage(m)
    }, [m])
    return (
        <div className="message-container-response-messagearea" >
            <div className="bar"> </div>
            <div className="message-middle-content-response-messagearea" >
                
                {
                    <FilesForMessagesToResponse url={m?.file?.url} typeMessage={m?.type?.typeMessage} />
                }
                <span className='text-message-response-messagearea'>
                    {message?.text}
                </span>
                  <IconButton onClick={onClose}><i className='bx bx-x' ></i></IconButton>
            </div>
          
        </div>
    )
}