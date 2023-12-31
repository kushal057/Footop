import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./PlayerProfilePage.module.css";
import ProfileSidebar from '../components/ProfileSidebar';
import UserInfoBox from "../components/UserInfoBox";
import PlayerProfileInfo from '../components/PlayerProfileInfo';
import PlayerProfileStats from '../components/PlayerProfileStats';

const PlayerProfilePage = () => {
  const [playerData, setPlayerData] = useState(null);
  const [userId, setUserId] = useState(null); // State to store the user ID
  const [token, setToken] = useState(null); // State to store the JWT token
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated
    const storedToken = localStorage.getItem('token');

    if (!storedToken) {
      // Redirect to login if not authenticated
      navigate('/login');
    } else {
      // Perform any actions specific to the authenticated user
      console.log('User is authenticated');

      // Retrieve user ID from localStorage
      const storedUserId = localStorage.getItem('userId');
      setUserId(storedUserId);

      // Set the token in the state
      setToken(storedToken);

      // Retrieve player data from localStorage
      const storedPlayerData = localStorage.getItem('playerData');

      if (storedPlayerData) {
        // Parse and set the player data
        setPlayerData(JSON.parse(storedPlayerData));
      }
    }
  }, [navigate]);

  // Log the current state to see if it updates
  console.log('Current playerData state:', playerData);
  console.log('Current userId state:', userId);
  console.log('Current token state:', token);

  return (
    <div className={styles.homeDashboard}>
      <ProfileSidebar />
      <div className={styles.mainContent}>
        <div className={styles.topBar}>
        </div>
        <div className={styles.playerContainer}>
          {/* Pass userId and token to child components */}
          <PlayerProfileInfo data={playerData} userId={userId} />
          <PlayerProfileStats data={playerData} />
        </div>
      </div>
    </div>
  );
}

export default PlayerProfilePage;
