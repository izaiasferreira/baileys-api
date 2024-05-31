
import './SecoundaryButton.css'
import React from 'react'


export default function SecoundaryButton({children,onChange}) {
    return (
        <div className='secoundary-button-container' >
            <button onClick={()=>{onChange()}} className='secoundary-button'>{children}</button>
        </div>
    )
}