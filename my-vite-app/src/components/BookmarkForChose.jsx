
import './BookmarkForChose.css'
import React from 'react'
export default function BookmarkForChose({ color, textColor, text }) {


    return (
        <div className="bookmark-container-choose" style={{ backgroundColor: color || 'black', color: textColor || "white" }}>
            <div className='body'>
                <div className="name"><i className='bx bxs-tag'></i>{/* text + */ " Marcador"}</div>
            </div>
        </div >
    )
}