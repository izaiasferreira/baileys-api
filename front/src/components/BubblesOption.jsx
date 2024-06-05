import './BubblesContainer.css';
import React from 'react'

export default function BubblesContainer({ children, onClick, color, show }) {
    return (
        <div className={show ? "bubbles-option-container-show" : "bubbles-option-container-disable"} onClick={onClick} style={color ? { backgroundColor: color } : null}>
            {children}
        </div>
    )
}