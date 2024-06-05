
import './ButtonModel.css'
import React from 'react'


export default function ButtonModel({ onClick, children, type, align, id }) {
    return (
        <div className='button-container-model'  >
            <button
                id={id}
                style={align ? align === 'left' ? { display: 'flex', justifyContent: 'flex-start' } : { display: 'flex', justifyContent: 'flex-end' } : null}
                onClick={() => { onClick() }} className={type || 'primary'}>{children}</button>
        </div >
    )
}