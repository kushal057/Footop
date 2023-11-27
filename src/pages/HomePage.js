import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import styles from './HomePage.module.css';
import Logo from '../components/Logo';
import Button from '../components/Button';
import Slogan from '../components/Slogan';
import messi_homepage from '../assets/images/messi_homepage.png';
import Login from './LoginPage';
import SignUp from './SignUpPage';

const NavBar = () => {
  return (
    <div className={styles.navBar}>
      <Logo text="Footop" color="white" />
      <div className={styles.navButtons}>
        <Link to="/login">
          <Button text="LOGIN" customStyle="navButton" />
        </Link>
        <Link to="/signup">
          <Button text="SIGN UP" customStyle="navButton" />
        </Link>
      </div>
    </div>
  );
};

const HomepageBody = () => {
  return (
    <div className={styles.homepageBody}>
      <Slogan
        firstRowText="follow"
        secondRowText="football"
        thirdRowText="worldwide"
        buttonText="Register Now"
      />
      <div className={styles.imageContainer}>
        <img src={messi_homepage} alt="" />
      </div>
    </div>
  );
};

const Homepage = () => {
  return (
    <div className={styles.homepage}>
      <NavBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" exact element={<HomepageBody />} />
      </Routes>
    </div>
  );
};

export default Homepage;
