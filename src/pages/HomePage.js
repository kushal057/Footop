import React from 'react';
import styles from './HomePage.module.css';
import Logo from  '../components/Logo';
import Button from '../components/Button';
import Slogan from '../components/Slogan';
import messi_homepage from '../assets/images/messi_homepage.png';

const NavBar = () => {
  return (
    <div className={styles.navBar}>
      <Logo text="Footop" color="white" />
      <div className={styles.navButtons}>
        <Button text="LOGIN" customStyle="navButton" />
        <Button text="SIGN UP" customStyle="navButton" />
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
        <img src={messi_homepage} alt='' />
      </div>
    </div>
  );
};

const Homepage = () => {
  return (
    <div className={styles.homepage}>
      <NavBar />
      <HomepageBody />
    </div>
  );
};

export default Homepage;
