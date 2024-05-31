import './FullArea.css';
import React, { useEffect } from 'react'
import IconButton from './IconButton';
import { useState } from 'react';

export default function FullArea({ open, children, onClose }) {
    const [openState, setOpen] = useState(null)
    useEffect((() => {
        setOpen(open)
    }), [open])
    return (
        <div className={openState === true ? "full-area" : 'full-area-close'} >
            <div className='full-area-container'>
                <div className="full-area-header">
                    <div className="full-area-header-left">
                        <IconButton onClick={() => { onClose() }}><i className='bx bx-x'></i></IconButton>
                    </div>
                </div>
                <div className="full-area-content">
                    {children}
                </div>
            </div>
            <div onClick={() => { onClose() }} className="full-area-back"></div>
        </div>
    )
}