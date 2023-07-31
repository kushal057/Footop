import React from 'react';
import styles from './LoginPage.module.css';
import Button from '../components/Button';
import Input from '../components/Input';

const Login = () => {
  return (
    <div className={styles.login}>
      <div className={styles.loginBanner}></div>
      <form className={styles.loginForm}>
        <div className={styles.row}>
          <p className={styles.heading}>Welcome to Footop</p>
          <p className={styles.note}>Please enter the details to login</p>
        </div>
        <div className={styles.row}>
          <Input label="Email" type="email" />
          <Input label="Password" type="password" />
          <div className={styles.rememberForgot}>
            <label className={styles.rememberMe}>
              <input type="checkbox" />
              <span style={{ color: 'darkslategray' }}>Remember Me</span>
            </label>
            <span>
              <a href="#">Forgot Password</a>
            </span>
          </div>
        </div>
        <div className={styles.row}>
          <Button text="Login" customStyle="loginButton" />
          <p className={styles.note} style={{textAlign: "center"}}>
            Don't have an account? <a href="#">Sign up</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
