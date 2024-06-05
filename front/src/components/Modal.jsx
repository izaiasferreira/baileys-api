import './Modal.css';
import React, { useContext } from 'react'
import { AppContext } from '../contexts/userData';
import deleteParam from '../service/deleteParamUrl';

export default function Modal({ status, title, children, onClose }) {
    const { setModal, setModalContent, setModalTitle } = useContext(AppContext)
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            setModalContent(null); setModalTitle(null); setModal(false);
        }
    });
    return (
        <div className={status === true ? "modal" : 'modal-close'} id='modal'>
            <div className='modal-container'>
                <div className="modal-header">
                    <div className="modal-header-left">
                        <i className='bx bx-left-arrow-alt' onClick={() => {
                            if (onClose) {
                                onClose()
                            } else {
                                setModal(false);
                                setModalContent(null)
                                setModalTitle(null)

                            }
                            deleteParam('window')
                        }}></i>
                        <h1>{title}</h1>
                    </div>
                </div>
                <div className="modal-content">
                    {children}
                </div>
            </div>
            <div onClick={() => {
                if (onClose) {
                    onClose()
                } else {
                    setModal(false);
                    setModalContent(null);
                    setModalTitle(null);
                }
                deleteParam('window')
            }} className="modal-back"></div>
        </div>
    )
}