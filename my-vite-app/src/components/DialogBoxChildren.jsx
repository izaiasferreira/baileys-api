import './DialogBoxChildren.css';
import React, { useEffect } from 'react'
import { useState } from 'react';

export default function DialogBoxChildren({ open, onClose, children, style }) {
    const [openState, setOpen] = useState(false)
    useEffect((() => {
        setOpen(open || false)
    }), [open])

    useEffect((() => {
        setOpen(open)
    }), [open])
    if(openState){
        return (
            <div className={openState ? "dialog-box-children" : "dialog-box-children-disable"} >
                <div  className='dialog-box-children-container'>
                    <div className="dialog-box-children-content">
                        {children ? children : null}
                    </div>
                </div>
                <div onClick={() => { onClose()}} className="dialog-box-children-back"></div>
            </div>
        )
    }
    return null
}