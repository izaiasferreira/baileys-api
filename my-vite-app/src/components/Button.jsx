
import './Button.css'
import React, { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid';

export default function Button({ status, onChange, placeholder, bold, emphasis }) {
    const [checked, setCheck] = useState(null);
    const [idState, setIdState] = useState(null);
    useEffect(() => {
        setCheck(status || false);
        setIdState(uuid())
    }, [status])
    return (
        <div
            className='button-container'
            style={emphasis ? { backgroundColor: 'var(--six-color)', borderRadius: '1rem' } : null}
            onClick={() => { setCheck(!checked); onChange(!checked) }}
        >
            {placeholder ? <label htmlFor={idState} style={bold ? { fontWeight: '600' } : null}>{placeholder}</label> : null}
            <div id={idState} className={checked === true ? "button-container-active" : "button-container-disable"}>
                <div className={checked === true ? "button-circle-active" : "button-circle-disable"}>
                </div>
            </div>
        </div>
    )
}