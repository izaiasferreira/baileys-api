
import './Button.css'
import React, { useState, useEffect } from 'react'


export default function Button({ status, onChange }) {
    const [checked, setCheck] = useState(status);
    useEffect(() => { setCheck(status); }, [status])
    return (
        <div className='button-container' onClick={() => { setCheck(!checked); onChange(!checked) }}>
            <div className={checked === true ? "button-container-active" : "button-container-disable"}>
                <div className={checked === true ? "button-circle-active" : "button-circle-disable"}>
                    <i className={checked === true ? 'bx bx-sun': 'bx bx-moon'}></i>
                    
                </div>
            </div>
        </div>
    )
}