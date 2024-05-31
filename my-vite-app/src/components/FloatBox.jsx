import './FloatBox.css';
import React, { useCallback, useState } from 'react'
import { useEffect } from 'react';
import { v4 as uuid } from 'uuid';

export default function FloatBox({ children, open, anchorElement, direction }) {
    const [id] = useState(uuid())
    const [state, setState] = useState(false)
    const [anchor, setAnchor] = useState(null)
    const setPosition = useCallback(() => {
        if (anchorElement) {
            var target = anchorElement.target.getBoundingClientRect()
            var box = document.getElementById(id)

            if ((target.x + 400) > window.screen.width && (target.y - 200) < 0 && (target.y + 400) < window.screen.height) {

                box.style.top = (target.y + 30) + 'px'
                box.style.right = (window.screen.width - target.x) + 'px'
            }

            if ((target.x + 400) < window.screen.width && (target.y - 200) < 0 && (target.y + 400) < window.screen.height) {
                box.style.top = (target.y + 30) + 'px'
                box.style.left = target.x + 'px'
            }

            if ((target.x + 400) < window.screen.width && (target.y - 200) > 0 && (target.y + 400) > window.screen.height) {
                box.style.bottom = (window.screen.height - target.y - 140) + 'px'
                box.style.left = target.x + 'px'
            }

        }
    }, [anchorElement, id])

    useEffect(() => {
        setAnchor(anchorElement)
        if (anchorElement) setState(true)
        else setState(false)
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                close()
            }
        });
    }, [anchorElement, id, open, setPosition])

    useEffect(() => {
        setPosition(anchor)
    }, [anchor, setPosition])



    function close() {
        setState(false)
        setAnchor(null)
    }

    return (
        <div>
            <div className={state ? "float-box-container" : 'disable'} id={id}>
                <div id={`children${id}`} style={{ flexDirection: direction || 'row' }} className="children">
                    {children}
                </div>

            </div>
            <div className={state ? "back-float-box" : 'disable'} onClick={() => { close() }} />
        </div>
    )
}