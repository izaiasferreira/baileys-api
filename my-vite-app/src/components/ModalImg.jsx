import './ModalImg.css';
import React, { useState } from 'react'
import IconButton from './IconButton';

export default function ModalImg({ onClose, link, status }) {
    const [imageZoom, setImageZoom] = useState(false);

    return (
        <div className={status === true ? "modal-img" : 'modal-img-close'}>
            <span className='icon-close-modal-image'> <IconButton><i onClick={() => { onClose() }} className='bx bx-x'></i></IconButton> </span>
            <div className='modal-container-img' >
                <img onClick={() => { setImageZoom(!imageZoom) }} className={imageZoom ? 'modal-img-content-zoom' : 'modal-img-content'} src={link} alt="" />
            </div>
            <div className="modal-back-img" onClick={() => { onClose() }} ></div>
        </div>
    )
}