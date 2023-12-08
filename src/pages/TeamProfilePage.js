import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./TeamProfilePage.module.css";
import ProfileSidebar from '../components/ProfileSidebar';
import UserInfoBox from "../components/UserInfoBox";
import TeamProfileInfo from '../components/TeamProfileInfo';
import TeamProfileStats from '../components/TeamProfileStats';

const TeamProfilePage = () => {
  const [teamData, setTeamData] = useState(null);
  const [userId, setUserId] = useState(null); // State to store the user ID
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

      // Retrieve user ID from localStorage
      const storedUserId = localStorage.getItem('userId');
      setUserId(storedUserId);

      // Retrieve team data from localStorage
      const storedTeamData = localStorage.getItem('teamData');

      if (storedTeamData) {
        // Parse and set the team data
        setTeamData(JSON.parse(storedTeamData));
      }
    }
  }, [navigate]);

  // Log the current state to see if it updates
  console.log('Current teamData state:', teamData);
  console.log('Current userId state:', userId);

  return (
    <div className={styles.homeDashboard}>
      <ProfileSidebar />
      <div className={styles.mainContent}>
        <div className={styles.topBar}>
        </div>
        <div className={styles.teamContainer}>
          {/* Pass userId to child components */}
          <TeamProfileInfo data={teamData} userId={userId} />
          <TeamProfileStats data={teamData} />
        </div>
      </div>
    </div>
  );
}

export default TeamProfilePage;
