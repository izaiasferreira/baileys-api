import './InputPassword.css';
import React, { useState } from 'react'
import { v4 as uuid } from 'uuid';
import { useEffect } from 'react';

export default function InputPassword({ id, onFocus, onChange, onEnter, placeholder, style, size }) {
  const [focusState, setFocusState] = useState(null)
  const [type, setType] = useState(null)
  const [idState, setIdState] = useState(null)
  useEffect(() => {
    setFocusState(onFocus || false)
    setIdState(id || uuid())
    setType(true)
    return () => {
      setFocusState(null)
      setIdState(null)
    }
  }, [onFocus, id])

  useEffect(() => {
    if (focusState) {
      var elementFocus = document?.getElementById(idState)
      elementFocus?.focus()
    }
  }, [idState, focusState])



  function keyPress(event) { //envia a mensagem sempre que o usuário pressiona a tecla ENTER
    if (event.key === "Enter") {
      if (onEnter) {
        onEnter(event.target.value)
      }
      clearInput()
      onChange()

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
    <div className='input-pass-container'>
      <div className="icon-to-input" onClick={() => { setType(!type) }}>
        {type ? <i className='bx bx-show-alt'></i> : <i className='bx bx-low-vision'></i>}
      </div>

      <input
        id={idState}
        autoComplete="off"
        type={type ? 'password' : 'text'}
        className={style || `normal ${setSize(size)}` || 'normal-size'}
        placeholder={placeholder || 'Digite aqui'}
        onKeyPress={event => keyPress(event)}
        onChange={(event) => {
          if (onChange) { onChange(event.target.value) }
        }}
      />
    </div>

  );
}