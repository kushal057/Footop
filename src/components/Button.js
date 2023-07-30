import React from 'react';
import styles from './Button.module.css';

export default function Button({
  text,
  type = "",
  casing = "uppercase"
}) {
  return (
    <button
      className={`${styles.button} ${type === "navButton" && styles.navButton}`}
      style={{ casing }}
    >
      {text}
    </button>
  );
}