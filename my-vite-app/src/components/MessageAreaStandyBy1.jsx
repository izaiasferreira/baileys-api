import React from 'react'
import './MessageAreaStandyBy.css'

export default function MessageAreaStandyBy() {
    return (
        <div className="message-standby-container">
            <div className="message-standby-content">
                <img src="./img/icon.png" alt="Atendente" />
                <div className="bar"></div>
                <div className="text">Atenda seus clientes com todo seu time em um único lugar.</div>
                <div className="text">Com o FlowTalk você pode criar setores e organizar o atendimento do seu time.</div>
                <div className="text">Desfrute de um atendimento organizado mesmo com a equipe distante.</div>
            </div>
        </div>
    )
}