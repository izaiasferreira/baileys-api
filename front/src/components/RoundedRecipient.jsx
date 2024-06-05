
import './RoundedRecipient.css'
import React from 'react'
export default function RoundedRecipient({ children, color }) {
    return (
        <div style={color ? { backgroundColor: color, color: 'var(--color-one)', borderColor: 'var(--color-one)' } : { backgroundColor: 'none', color: 'var(--text-color-one)', borderColor: 'var(--text-color-one)' }} className="rounded-recipient-container" >
            <div className='body'>
                {children}
            </div>
        </div >
    )
}