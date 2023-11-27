import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Updated import
import Button from '../components/Button';
import Input from '../components/Input';
import styles from './LoginPage.module.css';

const Login = () => {
  const navigate = useNavigate(); // Updated hook
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    // Perform login logic and get the token from the server
    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Set the token in local storage
      localStorage.setItem('token', data.token);

      // Redirect to HomeDashboardPage
      navigate('/home-dashboard'); // Updated navigation
    } else {
      alert('Failed to login:' +  data.error);
      // Handle login error, e.g., display an error message to the user
    }
  };

  return (
    <div className={styles.login}>
      <div className={styles.loginBanner}></div>
      <form className={styles.loginForm} onSubmit={handleLogin}>
        <div className={styles.row}>
          <p className={styles.heading}>Welcome to Footop</p>
          <p className={styles.note}>Please enter the details to login</p>
        </div>
        <div className={styles.row}>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
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
          <Button type="submit" text="Login" customStyle="loginButton" />
          <p className={styles.note} style={{textAlign: "center"}}>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
