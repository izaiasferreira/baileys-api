import './InputRoundedOption.css';
import React, { useState } from 'react'
import { v4 as uuid } from 'uuid';
import { useEffect } from 'react';

export default function InputRoundedOption({ id, name, value, onChange, label, checked, disabled }) {
  const [idInput, setIdInput] = useState(null)
  useEffect(() => {
    setIdInput(id || uuid())
    return () => {
      setIdInput(null)
    }
  }, [id])


  return (
    <div className="option-from-input-rounded">
      <label className='label' htmlFor={idInput}>
        {checked ? <input disabled={disabled ? true : false} checked onChange={(event) => { onChange(event.target.value) }} type="radio" name={name} id={idInput} value={value || idInput} />
          :
          <input disabled={disabled ? true : false} onChange={(event) => { onChange(event.target.value) }} type="radio" name={name} id={idInput} value={value || idInput} />
        }
        {label}
      </label>
    </div>

  );
}