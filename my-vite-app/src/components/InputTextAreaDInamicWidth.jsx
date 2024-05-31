import './InputTextAreaDInamicWidth.css';
import React, { useState } from 'react'
import { v4 as uuid } from 'uuid';
import { useEffect } from 'react';

export default function InputTextAreaDInamicWidth({ id, onFocus, onEnter, onChange, placeholder, style, color, width, onKeyDown, onIsTyping, finishTyping }) {
  const [focusState, setFocusState] = useState(null)
  const [idState, setIdState] = useState(null)
  const [isTyping, setIsTyping] = useState(false); // Estado para identificar se o cliente está digitando
  const [typingTimeout, setTypingTimeout] = useState(null); // Timer para detectar quando o cliente para de digitar
  useEffect(() => {
    setFocusState(onFocus || false)
    setIdState(id || uuid())
    return () => {
      setFocusState(null)
      setIdState(null)
    }
  }, [id, onFocus])

  useEffect(() => {

    if (focusState) {
      var textArea = document?.getElementById(idState)
      textArea?.focus()
    }
  }, [idState, focusState])

  useEffect(() => {
    if (onIsTyping && isTyping) onIsTyping()
    if (finishTyping && !isTyping) finishTyping()
  }, [isTyping])

  const handleKeyDown = (event) => {
    if (onKeyDown) onKeyDown(event);
    if (event.keyCode === 13 && !event.shiftKey) {
      if (event.target.value && event.target.value !== '') onEnter(event.target.value);
      event.target.value = ""; // Define o valor como uma string vazia para limpar o conteúdo
      event.preventDefault();
    }
    if (event.shiftKey && event.keyCode === 13) {
      // Evite que a quebra de linha padrão ocorra
      event.preventDefault();

      // Insira uma quebra de linha manualmente no local do cursor
      var textarea = document.getElementById(idState); // Substitua pelo ID do seu textarea
      var start = textarea.selectionStart;
      var end = textarea.selectionEnd;
      var value = textarea.value;

      // Insira uma quebra de linha na posição do cursor
      textarea.value = value.substring(0, start) + "\n" + value.substring(end);

      // Atualize a posição do cursor
      textarea.selectionStart = textarea.selectionEnd = start + 1;
    }

    // Identifique que o cliente está digitando
    setIsTyping(true);

    // Limpe o timeout anterior se existir
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Defina um novo timeout para detectar quando o cliente para de digitar
    const timeout = setTimeout(() => {
      setIsTyping(false);
    }, 1000); // 1 segundo após parar de digitar

    setTypingTimeout(timeout);
  };


  return (
    <div className='input-text-area-container-dinamic'>
      <textarea
        style={{ backgroundColor: color || 'none', width: width ? `${width}%` : '100%' }}
        id={idState}
        type="text"
        className={style || 'normal'}
        placeholder={placeholder || 'Digite aqui'}
        onKeyDown={(event) => {
          handleKeyDown(event)
          if (onKeyDown) onKeyDown(event)
          if (event.keyCode === 13 && !event.shiftKey) {
            if (event.target.value && event.target.value !== '') onEnter(event.target.value)
            event.target.value = ""; // Define o valor como uma string vazia para limpar o conteúdo
            event.preventDefault()
          }
          if (event.shiftKey && event.keyCode === 13) {
            // Evite que a quebra de linha padrão ocorra
            event.preventDefault();

            // Insira uma quebra de linha manualmente no local do cursor
            var textarea = document.getElementById(idState); // Substitua pelo ID do seu textarea
            var start = textarea.selectionStart;
            var end = textarea.selectionEnd;
            var value = textarea.value;

            // Insira uma quebra de linha na posição do cursor
            textarea.value = value.substring(0, start) + "\n" + value.substring(end);

            // Atualize a posição do cursor
            textarea.selectionStart = textarea.selectionEnd = start + 1;
          }
        }}
        onChange={(event) => {
          if (onChange) {
            onChange(event.target.value)
          }
        }}></textarea>
    </div>

  );
}
