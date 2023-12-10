import React from 'react';
import styles from './SquadPlayer.module.css';

const SquadPlayer = ({ playerName, playerNumber, playerImage, playerPosition }) => {
  return (
    <div className={styles.squadPlayer}>
      <div className={styles.playerNumber}>
        <p>{playerNumber}</p>
      </div>
      <img src={playerImage} alt={playerName} className={styles.playerImage} />
      <div className={styles.playerInfo}>
        <p className={styles.playerName}>{playerName}</p>
        <p className={styles.playerPosition}>{playerPosition}</p>
      </div>
    </div>
  );
};

export default SquadPlayer;
