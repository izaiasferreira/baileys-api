import './InputText.css';
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from 'react';
import EmojiComponent from './EmojiComponent'

export default function InputText({ id, onFocus, onChange, onEnter, placeholder, iconData, style, emoji, value, size, disabled, event }) {
  const [iconState, setIconState] = useState(false)
  const [emojiState, setEmojiState] = useState(false)
  const [dataIconState, setDataIconState] = useState(null)
  const [focusState, setFocusState] = useState(null)
  const [idState, setIdState] = useState(null)
  useEffect(() => {
    if (iconData) { setDataIconState(iconData) }
    setFocusState(onFocus || false)
    setIdState(id || uuidv4())
    setEmojiState(emoji || false)
    return () => {
      setIconState(null)
      setDataIconState(null)
      setFocusState(null)
      setIdState(null)
    }
  }, [emoji, iconData, onFocus, id])

  useEffect(() => {
    if (focusState) {
      var elementFocus = document?.getElementById(idState)
      elementFocus?.focus()
    }
  }, [idState, focusState])

  const [anchorEmoji, setAnchorEmoji] = useState(null);
  const targetEmoji = (event) => {
    setAnchorEmoji(event)
  }

  function keyPress(event) { //envia a mensagem sempre que o usuário pressiona a tecla ENTER
    if (event.key === "Enter") {
      if (onEnter) {
        onEnter(event.target.value)
        clearInput()
        // onChange()
      }

    }
  }
  function clearInput() {
    var message = document.getElementById(idState)
    message.value = ""//limpa o input de mensagem
  }
  function setSize(size) {
    if (size === 'large') { return 'large-size' }
    if (size === 'normal') { return 'normal-size' }
  }

  return (
    <div className='input-text-container'>
      {dataIconState ? <div className="icon-to-input" onClick={() => {
        clearInput()
        if (onChange) { onChange() }
      }}>
        {iconState ?
          <i className='bx bx-x'></i>
          :
          <i className={dataIconState}></i>}
      </div> : null}
      {emojiState && !disabled ? <div className="emoji-container"><EmojiComponent target={anchorEmoji} onClick={async () => { await targetEmoji(document.getElementById(idState)) }}></EmojiComponent></div> : null}
      <input
        style={iconData || emoji ? { padding: '.5rem 2rem .5rem 2rem', opacity: disabled ? '0' : '1' } : { padding: '.5rem', opacity: disabled ? '0' : '1' }}
        onBlur={async () => {
          await setIconState(false)
        }}
        onClick={async () => {
          await setIconState(true)
        }}
        id={idState}
        autoComplete="off"
        type="text"
        disabled={disabled || false}
        className={style || `normal ${setSize(size)}` || "normal-size"}
        placeholder={placeholder || 'Digite aqui'}
        onKeyPress={event => keyPress(event)}
        onChange={(eventData) => {
          if (event) { event(eventData) }
          if (onChange) { onChange(eventData.target.value) }
        }}
        defaultValue={value}
      />
    </div>

  );
}