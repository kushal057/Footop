import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import logo from './logo.svg';
import styles from './App.module.css';
import HomePage from "./pages/HomePage";
import Login from "./pages/LoginPage";
import SignUp from "./pages/SignUpPage";
import HomeDashboard from './pages/HomeDashboardPage';
import PlayerProfilePage from './pages/PlayerProfilePage';
import TeamProfilePage from './pages/TeamProfilePage';
import FollowingPage from './pages/FollowingPage';
import Recommendations from './pages/Recommendations';

function App() {
  return (
    <Router>
      <div className={styles.app}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home-dashboard" element={<HomeDashboard />} />
          <Route path="/player-profile" element={<PlayerProfilePage />} />
          <Route path='/team-profile' element={<TeamProfilePage />} />
          <Route path='/following' element={<FollowingPage />} />
          <Route path='/recommendations' element={<Recommendations />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
