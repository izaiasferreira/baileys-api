
import './PrimaryButtonGenerics.css'
import React, { useEffect, useState } from 'react'


export default function PrimaryButtonGenerics({ children, onClick, disabled }) {
    const [disableState, setDisableState] = useState(null);
    useEffect(() => {
        setDisableState(disabled)
    }, [disabled])

    if (disableState) {
        return (
            <div className='primary-button-generics-container' >
                <button className='primary-button-generics-disabled'>{children}</button>
            </div>
        )
    }
    return (
        <div className='primary-button-generics-container' >
            <button onClick={() => { onClick() }} className='primary-button-generics'>{children}</button>
        </div>
    )

}