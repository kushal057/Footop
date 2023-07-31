import React from 'react';
import styles from './Input.module.css';

const Input = ({ label, type = "text" }) => {
  return (
    <div className={styles.inputContainer}>
      <label className={styles.labelStyle}>{label}</label>
      <input className={styles.inputStyle} type={type} />
    </div>
  );
};

export default Input;
