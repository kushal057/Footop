import React from 'react';
import styles from './Logo.module.css';

const Logo = ({ text, color="inherit" }) => {
  return (
    <div className={styles.logo} style={{ color: color }}>
      {text}
    </div>
  );
};

export default Logo;
