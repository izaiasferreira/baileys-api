import React from 'react'
import './MessageAreaStandyBy.css'

export default function MessageAreaStandyBy() {
    if (REACT_APP_BRAND === 'FLOWTALK') {
        return (
            <div className="message-standby-container">
                <div className="message-standby-content">
                    <img src="./img/illustration-attendance-flowtalk.png" alt="Atendente" />
                    <div className="bar"></div>
                    <div className="text">Atenda seus clientes com todo seu time em um único lugar.</div>
                    <div className="text">Com o FlowTalk você pode criar setores e organizar o atendimento do seu time.</div>
                    <div className="text">Desfrute de um atendimento organizado mesmo com a equipe distante.</div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="message-standby-container">
                <div className="message-standby-content">
                    <img src="./img/illustration-attendance.png" alt="Atendente" />
                    <div className="text">Atenda seus clientes com todo seu time em um único WhatsApp.</div>
                    <div className="text">Com o CatTalk você pode criar setores e organizar o atendimento do seu time.</div>
                    <div className="text">Desfrute de um atendimento organizado mesmo com a equipe distante.</div>
                    <div className="bar"></div>
                    <div className="text"> <i className='bx bx-error-alt'></i>   Você está usando uma versão beta, caso tenha algum problema,  <a href="https://wa.me/553172506291"> entre em contato com o suporte.</a></div>
                </div>
            </div>
        )
    }

}