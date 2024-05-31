import './NotificationBox.css';
import React from 'react'

export default function DialogBox({ text, color, status, onClose }) {
    setTimeout(() => {
        onClose()
    }, 6000);
    return (
        <div className='notification-box' >
            <div className={status ? `notification-box-container-active  color-${color}` : `notification-box-container-disable  ${color || "color-green"}`}>
                <div className="notification-box-content">
                    <div className='image-icon'>
                        <img src={color === 'green' ? "./img/notification-default.gif" : "./img/notification-error.gif"} alt=""/>
                    </div>
                    <div className='text'>
                        {text}
                    </div>
                    <div className='close-button'>
                        <i onClick={() => {
                            onClose()
                        }} className='bx bx-x'></i>
                    </div>
                </div>
            </div>
        </div>
    )
}