import React from 'react';
import styles from './Button.module.css';

export default function Button({
  text,
  customStyle = "",
}) {
  return (
    <button
      className={`${styles.button} ${customStyle !== "" && styles[customStyle]}`}
    >
      {text}
    </button>
  );
}