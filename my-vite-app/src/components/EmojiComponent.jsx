import './EmojiComponent.css';
import React, { useEffect, useRef, useState } from 'react'
import IconButton from './IconButton';
import Picker from 'emoji-picker-react';
import { v4 as uuidv4 } from 'uuid';

export default function EmojiComponent({ targetId, position, onChange }) {
  const [open, setOpen] = useState(false)
  const [id] = useState(uuidv4())

  useEffect(() => {
    if (!open) {
      var emojiContent = document.getElementById(id)
      emojiContent.className = 'emoji-disabled'
    } else {
      var emojiContent = document.getElementById(id)
      var positionInfo = position || 'top-right'
      if (positionInfo === 'bottom-left') {
        // console.log('ir para baixo e esquerda');
        emojiContent.className = 'emoji-content-bottom-left'
      }
      if (positionInfo === 'bottom-right') {
        // console.log('ir para baixo e direita');
        emojiContent.className = 'emoji-content-bottom-right'
      }
      if (positionInfo === 'top-left') {
        // console.log('ir para cima e esquerda');
        emojiContent.className = 'emoji-content-top-right'
      }
      if (positionInfo === 'top-right') {
        // console.log('ir para cima e direita');
        emojiContent.className = 'emoji-content-top-left'
      }
    }
  }, [open]);

  const onEmojiClick = (event) => {
    const { emoji } = event
    const target = document.getElementById(targetId)
    let cursorPositionStart = target.selectionStart
    let cursorPositionEnd = target.selectionEnd
    if (target.value === null) {
      target.value = ""
      target.value = emoji
      target.focus()
      return onChange(emoji)
    } else {
      let finalText = target.value.substring(0, cursorPositionStart) + emoji + target.value.substring(cursorPositionEnd, target?.value?.length)
      target.value = finalText
      target.selectionStart = target.selectionEnd = cursorPositionStart + emoji?.length
      target.focus()
      return onChange(finalText)
    }

  };

  return (
    <div className='emoji-container'>
      <div id={id} className="emoji-disabled">
        <Picker onEmojiClick={onEmojiClick}></Picker>
      </div>
      <IconButton id={'emoji-button-id' + id} size='small' onClick={(event) => {
        setOpen(!open)

      }}><i className='bx bx-smile' ></i></IconButton>
      <div className={open ? "emoji-container-back" : 'disable'} onClick={() => {
        setOpen(!open)
      }} />
    </div>
  );
}