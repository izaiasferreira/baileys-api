
import './Switch.css'
import React, { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid';

export default function Switch({ status, onChange, textOne, textTwo }) {
    const [checked, setCheck] = useState(false);
    const [idState, setIdState] = useState(null);
    useEffect(() => {
        setCheck(status || false);
        setIdState(uuid())
    }, [status])
    return (
        <div className='switch-container'>
            <div id={idState} className={checked === true ? "switch-container-active" : "switch-container-disable"}>
                {checked === true ?
                    <div className="content" >
                        <div className="switch-circle-active">{textOne || "Opção1"} </div>
                        <div className="switch-circle-active-other" onClick={() => { setCheck(!checked); onChange(!checked) }}>{textTwo || "Opção2"}</div>
                    </div>
                    :
                    <div className="content">
                        <div className="switch-circle-disable-other" onClick={() => { setCheck(!checked); onChange(!checked) }}>{textOne || "Opção1"}</div>
                        <div className="switch-circle-disable">{textTwo || "Opção2"}</div>
                    </div>
                }

            </div>
        </div>
    )
}