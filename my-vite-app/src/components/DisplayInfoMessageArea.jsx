
import './DisplayInfoMessageArea.css'
import React from 'react'
import IconButton from './IconButton';

export default function DisplayInfoMessageArea({ children, onClose }) {

    return (
        <div className="display-info-message-area-container" >
            <div className="bar"> </div>
            <div className="display-info-message-area-middle" >
                <div className="children">
                    {children}
                </div>
                <IconButton onClick={onClose}><i className='bx bx-x' ></i></IconButton>
            </div>

        </div>
    )
}