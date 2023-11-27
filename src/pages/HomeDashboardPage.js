import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./HomeDashboardPage.module.css";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import UserInfoBox from "../components/UserInfoBox";
import PlayerInfo from "../components/PlayerInfo";
import PlayerStats from "../components/PlayerStats";

const HomeDashboardPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem('token');

    if (!token) {
      // Redirect to login if not authenticated
      navigate('/login');
    } else {
      // Perform any actions specific to the authenticated user
      console.log('User is authenticated');
    }
  }, [navigate]);

  return (
    <div className={styles.homeDashboard}>
      <Sidebar />
      <div className={styles.mainContent}>
        <div className={styles.topBar}>
          <SearchBar />
          <UserInfoBox />
        </div>
        <div className={styles.playerContainer}>
          <PlayerInfo />
          <PlayerStats />
        </div>
      </div>
    </div>
  );
}

export default HomeDashboardPage;
