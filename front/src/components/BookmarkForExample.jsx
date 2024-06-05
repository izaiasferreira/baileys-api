
import React, { useEffect, useState } from 'react'
import './BookmarkForExample.css'
export default function BookmarkForList({ color, name, emoji, textColor }) {

    const [colorState, setColorState] = useState(null)
    const [nameState, setNameState] = useState(null)
    const [textColorState, setTextColorState] = useState(null)
    const [emojiState, setEmojiState] = useState(null)

    useEffect(() => {
        setColorState(color)
        setNameState(name)
        setEmojiState(emoji)
        setTextColorState(textColor)
        return () => {
            setColorState(null)
            setNameState(null)
            setEmojiState(null)
            setTextColorState(null)
        }
    }, [name, color, textColor, emoji])

    return (
        <div className="bookmark-container-example  " style={{ backgroundColor: colorState || 'black', color: textColorState || "white" }}>
            <div className='body'>
                <div className="name"><i className='bx bxs-tag'></i>{nameState}</div>
            </div>
        </div >
    )
}