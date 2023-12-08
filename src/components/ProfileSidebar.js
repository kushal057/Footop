import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './ProfileSidebar.module.css';
import NavItem from './SidebarNavItem';
import goBackIcon from '../assets/icons/go_back.svg';

const ProfileSidebar = () => {
  const navigate = useNavigate(); // Utilize useNavigate hook
  const location = useLocation();

  return (
    <div className={styles.ProfileSidebar}>
      <NavItem text="Go Back" to="/home-dashboard" iconSrc={goBackIcon} />
    </div>
  );
};

export default ProfileSidebar;
