import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import styles from './SignUpPage.module.css';

export default function SignUpPage() {
  const navigate = useNavigate(); // Updated import
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set the Content-Type header
        },
        body: JSON.stringify({ username, email, password }), // Stringify the data before sending
      });
  
      if (!response.ok) {
        throw new Error(`Failed to create account: ${response.statusText}`);
      }
  
      const data = await response.json();
  
      alert('Account created successfully!');
      navigate('/login');
    } catch (error) {
      alert(`Error creating account: ${error.message}`);
    }
  };
  

  return (
    <div className={styles.signup}>
      <div className={styles.signupBanner}></div>
      <form className={styles.signupForm} onSubmit={handleSignUp}>
        <div className={styles.row}>
          <p className={styles.heading}>Welcome to Footop</p>
          <p className={styles.note}>Please enter the details to create an account</p>
        </div>
        <div className={styles.row}>
          <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className={styles.row}>
          <Button type="submit" text="Sign Up" customStyle="loginButton" />
          <p className={styles.note} style={{ textAlign: "center" }}>
            Already signed up? <Link to="/login">Login</Link> {/* Updated navigation */}
          </p>
        </div>
      </form>
    </div>
  );
}
