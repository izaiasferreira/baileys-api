
import './IconButton.css'
import React from 'react'
import { v4 as uuidv4 } from 'uuid';
export default function IconButton({id, onClick, children, color, size, type, disable }) {
    if (disable) {
        return (
            <div id={id || uuidv4()} style={{ color: color }} className={`icon-button-container-${type || 'normal'} disable-icon-button`} >
                <div className={`body ${size || 'normal'}`}>
                    {children}
                </div>
            </div >
        )
    } else {
        return (
            <div id={id || uuidv4()} style={{ color: color }} className={`icon-button-container-${type || 'normal'}`} onClick={onClick} >
                <div className={`body ${size || 'normal'}`}>
                    {children}
                </div>
            </div >
        )
    }
}