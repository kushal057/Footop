import React from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import styles from './SignUpPage.module.css'; // Import the CSS module

export default function SignUpPage() {
  return (
    <div className={styles.signup}>
      <div className={styles.signupBanner}></div> {/* Use the CSS module class */}
      <form className={styles.signupForm}>
        <div className={styles.row}>
          <p className={styles.heading}>Welcome to Footop</p>
          <p className={styles.note}>Please enter the details to create an account</p>
        </div>
        <div className={styles.row}>
          <Input label="Username" />
          <Input label="Email" type="email"/>
          <Input label="Password" type="password" />
          <Input label="Confirm Password" type="password" />
        </div>
        <div className={styles.row}>
          <Button text="Signup" customStyle="loginButton" />
          <p className={styles.note} style={{textAlign: "center"}}>Already signed up? <a href="#">Login</a></p>
        </div>
      </form>
    </div>
  );
}
