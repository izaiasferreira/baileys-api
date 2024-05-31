
import './RoundedButton.css'
import React, { useEffect, useState } from 'react'
export default function RoundedButton({ value, active: status, onChange, children, color }) {
    const [valueState, setValue] = useState(null)
    const [active, setActive] = useState(false)
    useEffect(() => {
        setValue(value)
        return () => {
            setValue(null)
        }
    }, [value])

    useEffect(() => {
        setActive(status)
    }, [status])
    return (
        <div style={color ? { backgroundColor: color, color: 'white' } : null} className={active ? "rounded-button-container-selected" : "rounded-button-container"}
            onClick={() => {
                setActive(status || !active)
                onChange(valueState)
            }
            } >
            <div className='body'>
                {children}
            </div>
        </div >
    )
}