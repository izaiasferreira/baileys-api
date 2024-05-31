
import './PrimaryButton.css'
import React from 'react'


export default function PrimaryButton({children,onChange,value}) {
    return (
        <div className='primary-button-container' >
            <button onClick={()=>{onChange(value)}} className='primary-button'>{children}</button>
        </div>
    )
}