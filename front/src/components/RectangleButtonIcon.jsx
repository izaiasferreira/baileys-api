
import './RectangleButtonIcon.css'
import React from 'react'


export default function RectangleButtonIcon({children,onChange}) {
    return (
        <div className='rectangle-button-container' >
            <button onClick={()=>{onChange()}} className='rectangle-button'>jjkjnkjnk</button>
        </div>
    )
}