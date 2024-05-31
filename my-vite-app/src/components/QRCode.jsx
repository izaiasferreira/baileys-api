
import './QRCode.css'
import QRCode from "react-qr-code";
import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../contexts/userData';
import { Ring } from '@uiball/loaders'
import { ApiBack } from '../service/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCallback } from 'react';
import IconButton from './IconButton';
import responseSocketRequest from '../service/responseSocketRequest';
export default function QRcode({ connection, onClose }) {
    useEffect(() => {
        if (!connection?.data?.qrcode || connection.status !== 'qrcode') {
            onClose();
        }

    }, [connection])
    if (connection?.status === 'qrcode' && connection.data?.qrcode) {
        return (
            <div className='qrcode-container'>
                <div className="close-button">
                    <IconButton onClick={onClose}><i className='bx bx-x'></i></IconButton>
                </div>
                <div className='qrcode-content'>

                    <span className='title'> <strong>Como se conectar:</strong></span>
                    <span className='text-steps'>1 - Abra o Whatsapp {'>'} Configurações {'>'} Aparelhos Conectados; <br />
                        2 - Clique em Conectar dispositivo; <br />
                        3 - Leia o QRCode abaixo.
                    </span>
                    <div className="qrcode-image">
                        <span className='logo-qrcode'> <img src={REACT_APP_BRAND === 'FLOWTALK' ? "./img/simbol-outline-flowtalk.png" : "./img/simbol-outline.png"} alt="" /></span>
                        {connection?.status ? <QRCode value={connection?.data.qrcode} bgColor='#FFFFFF' fgColor='#000000' /> : null}
                    </div>
                    <span className='text-min'>{connection?.name}<br />{connection?.id}</span>
                    <span className='text-min'></span>
                    <span className='text-min'>Caso a conexão não seja bem sucedida, tente de 3 a 5 vezes uma nova reconexão antes de <a href="https://wa.me/5586995726999"> entrar em contato com o suporte.</a></span>
                </div>
            </div>
        )
    } else {
        return (
            <div className='qrcode-container'>
                <ToastContainer />
                <div className='qrcode-content'>
                    <div className="close-button">
                        <IconButton onClick={() => {
                            // getStatus().then((response) => {
                            //     setQRCode(response.data)
                            //     if (response.data.status === true) {
                            //         onConnect()
                            //     }
                            // }).catch(() => {
                            //     onClose()
                            // })
                        }}><i className='bx bx-rotate-left'></i></IconButton>
                        <IconButton onClick={onClose}><i className='bx bx-x'></i></IconButton>
                    </div>
                    <div className="qr-code-default">
                        <span><Ring
                            size={60}
                            lineWeight={5}
                            speed={2}
                            color="blue"
                        /></span>
                    </div>
                </div>
            </div>
        )
    }
}