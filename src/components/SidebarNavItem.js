// SidebarNavItem.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './SidebarNavItem.module.css';

export default function SidebarNavItem({ src, text, to }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} className={`${styles.sidebarNavItem} ${isActive ? styles.active : ''}`}>
      <div className={styles.imageContainer}>
        <img src={src} alt={text} />
      </div>
      <p>{text}</p>
    </Link>
  );
}
