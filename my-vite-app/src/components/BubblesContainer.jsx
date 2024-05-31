import './BubblesContainer.css';
import React, { useState } from 'react'
import { useEffect } from 'react';
import IconButton from './IconButton';
import BubblesOption from './BubblesOption';
import { v4 as uuidv4 } from 'uuid';
import { useCallback } from 'react';
export default function BubblesContainer({ data, icon, id, position }) {
    const [state, setState] = useState(false)
    const [stateData, setStateData] = useState(null)
    const [idState] = useState(id || uuidv4())
    const showBubbles = useCallback((state) => {
        if (stateData && state) {
            stateData.forEach((element, index) => {
                var stateDataCopy = [...stateData]
                stateDataCopy[index]['show'] = true
                setStateData(stateDataCopy)
                // setTimeout(() => {
                //     var stateDataCopy = [...stateData]
                //     stateDataCopy[index]['show'] = true
                //     setStateData(stateDataCopy)
                // }, index * 100);
            })
        }
        if (stateData && !state) {
            setStateData(stateData.map((element) => {
                element.show = false
                return element
            }))
        }
    }, [stateData])

    useEffect(() => {
        setStateData(data)
        document.addEventListener('click', function (event) {
            var container = document.getElementById(idState);
            if (!container?.contains(event.target)) {
                setState(false)
            }
        });
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                setState(false)
            }
        });
    }, [])

    useEffect(() => {
        showBubbles(state)
    }, [state])

    return (
        <div className="bubbles-container" id={idState}>
            <div className={"children"} style={position ? { bottom: '-15rem', left: '.8rem' } : null}>
                {stateData?.map(({ icon, name, action, color, show }, index) => {
                    return <BubblesOption show={show} key={index + idState} name={name} onClick={action} color={color}>{icon}</BubblesOption>
                })}
            </div>
            <IconButton onClick={() => {
                setState(!state)
            }}>{icon?.icon || <i className='bx bx-plus'></i>}</IconButton>
        </div>
    )
}