import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./HomeDashboardPage.module.css";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import UserInfoBox from "../components/UserInfoBox";
import PlayerInfo from "../components/PlayerInfo";
import PlayerStats from "../components/PlayerStats";

const HomeDashboardPage = () => {
  const [searchInput, setSearchInput] = useState('');
  const [playerData, setPlayerData] = useState(null);

  const handleSearchInput = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearchSubmit = async () => {
    try {
      if (!searchInput) {
        console.error('Player name is required');
        return;
      }
  
      const response = await fetch('http://localhost:3001/search?searchTerm=' + searchInput);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const responseData = await response.json();
  
      // Log the received data to the console
      console.log('Data received from server:', responseData);
  
      // Update state with received data
      setPlayerData(responseData.playerData);
    } catch (error) {
      console.error('Error fetching player data:', error);
      // Handle the error (e.g., show an error message to the user)
    }
  };
  
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

  // Log the current state to see if it updates
  console.log('Current playerData state:', playerData);

  return (
    <div className={styles.homeDashboard}>
      <Sidebar />
      <div className={styles.mainContent}>
        <div className={styles.topBar}>
          <SearchBar
            searchInput={searchInput}
            handleSearchInput={handleSearchInput}
            handleSearchSubmit={handleSearchSubmit}
          />
          <UserInfoBox />
        </div>
        <div className={styles.playerContainer}>
          <PlayerInfo data={playerData}/>
          <PlayerStats data={playerData}/>
        </div>
      </div>
    </div>
  );
}

export default HomeDashboardPage;
