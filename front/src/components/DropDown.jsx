import React from 'react'
import './DropDown.css';

export default function Dropdown({ children, onClose }) {
  return (
    <div className="drop" onBlur={onClose}>
      <div className="dropdown">
        {children}
      </div>
      <div className="back-dropdown" onClick={() => { onClose() }}></div>
    </div>
  )
}