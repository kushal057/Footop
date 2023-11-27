import React from 'react';
import styles from './Input.module.css';

const Input = ({ label, type = "text", value, onChange }) => {
  return (
    <div className={styles.inputContainer}>
      <label className={styles.labelStyle}>{label}</label>
      <input className={styles.inputStyle} type={type} onChange={onChange} value={value}/>
    </div>
  );
};

export default Input;
