import './OutputCopyText.css';
import React from 'react'

export default function OutputCopyText({ placeholder, style, value, size }) {

  function setSize(size) {
    if (size === 'large') { return 'large-size' }
    if (size === 'normal') { return 'normal-size' }
  }

  return (
    <div className='display-container'>
      <input
        style={{ padding: '.5rem 2rem .5rem 2rem', opacity: 0.5 }}
        type="text"
        disabled={true}
        className={style || `normal ${setSize(size)}` || "normal-size"}
        placeholder={placeholder || 'Digite aqui'}
        defaultValue={value}
      />
      
    </div>

  );
}