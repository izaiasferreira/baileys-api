
import './QRCode.css'
import QRCode from "react-qr-code";
import React from 'react'
import { Ring } from '@uiball/loaders'
import IconButton from './IconButton';
export default function QRcode({ qrcode, onClose }) {

    if (qrcode) {
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
                        {/*  <span className='logo-qrcode'> <img src={REACT_APP_BRAND === 'FLOWTALK' ? "./img/simbol-outline-flowtalk.png" : "./img/simbol-outline.png"} alt="" /></span> */}
                        <QRCode value={qrcode} bgColor='#FFFFFF' fgColor='#000000' />
                    </div>
                    <span className='text-min'></span>
                    <span className='text-min'>Caso a conexão não seja bem sucedida, tente de 3 a 5 vezes uma nova reconexão.</span>
                </div>
            </div>
        )
    } else {
        return (
            <div className='qrcode-container'>
                <div className='qrcode-content'>
                    <div className="close-button">
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