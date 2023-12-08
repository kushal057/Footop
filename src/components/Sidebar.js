// Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Sidebar.module.css';
import SidebarNavItem from './SidebarNavItem';
import Logo from '../components/Logo';
import home_icon from '../assets/icons/home_icon.svg';
import following_icon from '../assets/icons/following_icon.svg';
import for_you_icon from '../assets/icons/for_you_icon.svg';
import compare_icon from '../assets/icons/compare_icon.svg';

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <Logo text="Footop" />
      <SidebarNavItem src={home_icon} text="Home" to="/home-dashboard" />
      <SidebarNavItem src={following_icon} text="Following" to="/following" />
      <SidebarNavItem src={for_you_icon} text="For you" to="/for-you" />
      <SidebarNavItem src={compare_icon} text="Compare" to="/compare" />
    </div>
  );
}
