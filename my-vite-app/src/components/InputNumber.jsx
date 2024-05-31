import './InputNumber.css';
import React, { useState } from 'react'
export default function InputNumber({ id, onChange, dataDefault, disabled, max, min }) {

  return (
    <div className='input-number-container'>
      {!disabled ?
        <input
          max={max}
          min={min}
          value={dataDefault}
          type="number"
          name={id} id={id}
          onChange={(event) => {
            onChange(event.target.value)
          }} /> :
        <input
          style={{ opacity: 0.5 }}
          disabled
          value={dataDefault}
          type="number"
          name={id} id={id}
        />
      }
    </div>

  );
}