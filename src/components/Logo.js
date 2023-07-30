import React from 'react';
import styles from './Logo.module.css';

const Logo = ({ text, color }) => {
  return (
    <div className={styles.logo} style={{ color }}>
      {text}
    </div>
  );
};

export default Logo;
