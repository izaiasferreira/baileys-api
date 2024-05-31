import './InputCheckbox.css';
import React, { useState } from 'react'
import { v4 as uuid } from 'uuid';
import { useEffect } from 'react';

export default function InputTime({ id, onChange, state, placeholder, disabled }) {
  const [idState, setIdState] = useState(null)
  const [disabledState, setDisabledState] = useState(false)
  const [stateValue, setState] = useState(null)
  useEffect(() => {

    setState(state || false)
    setIdState(id || uuid())
    return () => {
      setIdState(null)
    }
  }, [state])

  useEffect(() => {
    setDisabledState(disabled);
    return () => {
      setDisabledState(null)
    }
  }, [disabled])
  return (
    <div className='input-check-container'>
      {placeholder ?
        disabledState ?
          <label style={{ opacity: '.5' }} htmlFor={idState} >{placeholder}</label> :
          <label htmlFor={idState} >{placeholder}</label> :
        null
      }
      <input type="checkbox"
        disabled={disabledState ? "disabled" : null}
        checked={stateValue}
        value={stateValue}
        name={idState}
        id={idState}
        onChange={(event) => { onChange(event.target.checked); setState(event.target.checked) }} />
    </div>

  );
}