import React from 'react';
import styles from './Slogan.module.css';
import Button from './Button'; // Assuming the Button component is in a separate file

export const Slogan = ({
  firstRowText,
  secondRowText,
  thirdRowText,
  buttonText
}) => {
  return (
    <div className={`${styles.sloganContainer}`}>
      <p>{firstRowText}</p>
      <p>{secondRowText}</p>
      <p>{thirdRowText}</p>
      {buttonText && (
        <Button text={buttonText}/>
      )}
    </div>
  );
};