import './InputRoundedOptionChildren.css';
import React, { useState } from 'react'
import { v4 as uuid } from 'uuid';
import { useEffect } from 'react';

export default function InputRoundedOptionChildren({ id, name, value, onChange, children,checked, disabled, style }) {
  const [idInput, setIdInput] = useState(null)
  const [valueState, setValueState] = useState(null)
  useEffect(() => {
    setIdInput(id || uuid())
    setValueState(value)
    return () => {
      setIdInput(null)
      setValueState(null)
    }
  }, [id, value])
  return (
    <div className="option-from-input-rounded-children"  style={style}>
      {checked ? <input
        disabled={disabled ? true : false}
        checked
        onChange={(event) => {
          typeof value === 'object' || Array.isArray(value) ? onChange(valueState) : onChange(event.target.value)
        }}
        type="radio"
        name={name}
        id={idInput}
        value={value || idInput}
      />
        :
        <input
         
          disabled={disabled ? true : false}
          onChange={(event) => {
            typeof value === 'object' || Array.isArray(value) ? onChange(valueState) : onChange(event.target.value)
          }}
          type="radio"
          name={name}
          id={idInput}
          value={value || idInput}
        />
      }
      <label htmlFor={idInput} className='label'>{children}</label>
    </div>

  );
}