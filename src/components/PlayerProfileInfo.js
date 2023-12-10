import React, { useState, useEffect } from 'react';
import styles from "./PlayerProfileInfo.module.css";

const PlayerProfileInfo = ({ data, userId }) => {
    console.log(data)
    if (!data || data.length === 0) {
        // You can render a loading state or a message here
        return <p>No player data available</p>;
    }

    // Define a mapping of expected field names to match with itemName substring
    const fieldMappings = {
        playerName: 'playerName',
        age: 'age:',
        position: 'position:',
        playerImage: 'playerImage',
        countryImage: 'countryImage',
        goals: 'goals',
        assists: 'assists',
        matchesPlayed: 'matchesPlayed',
        shirtNumber: 'shirtNumber',
        currentClub: 'currentClub'
    };

    // Extract relevant properties from the response
    const {
        playerName,
        age,
        position,
        playerImage,
        countryImage,
        goals,
        assists,
        matchesPlayed,
        shirtNumber,
        currentClub
    } = data.reduce((acc, item) => {
        // Find the matching field using substring
        const matchedField = Object.keys(fieldMappings).find(fieldName =>
            item.itemName.includes(fieldMappings[fieldName])
        );

        // Update the accumulator with the matched field
        if (matchedField) {
            acc[matchedField] = item.itemValue;
        }

        return acc;
    }, {});

    // Check if playerName is defined before splitting
    const nameParts = playerName ? playerName.split(" ") : [];
    const firstName = nameParts.length > 0 ? nameParts[0] : "";
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

    const handleFollow = async () => {
        try {
            // Assuming you have the userId and playerName available
            console.log(userId) // Replace with the actual userId
            console.log(playerName)

            const response = await fetch('http://localhost:3001/follow/player', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, playerName }),
            });

            const data = await response.json();

            if (data.success) {
                // Handle success (e.g., show a success message)
                console.log(data.message);
            } else {
                // Handle failure (e.g., show an error message)
                console.log(data.message);
            }
        } catch (error) {
            console.error('Error following player:', error);
        }
    };

    return (
        <div className={styles.PlayerProfileInfoBar}>
            <div className={styles.images}>
                <img className={styles.playerIcon} src={playerImage} alt="Player" />
                <img className={styles.countryIcon} src={countryImage} alt="Country" />
                <button className={styles.btnFollow} onClick={handleFollow}>
                    Follow
                </button>
            </div>
            <div className={styles.texts}>
                <p className={styles.name}>
                    <span className={styles.firstName}>{firstName}</span>
                    <span className={styles.lastName}>{lastName}</span>
                </p>
                <div className={styles.basicInfo}>
                    <p className={styles.row}>
                        <span className={styles.age} style={{ marginRight: '4em' }}>Age: {age}</span>
                        <br />
                        <span className={styles.position}>Position: {position.split(' ')[0]}</span>
                    </p>
                    <p className={styles.row}>
                        <span className={styles.currentClub} style={{ marginRight: '4em' }}>Club : {currentClub}</span>
                        <br />
                        <span className={styles.nation}>Number: {shirtNumber}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PlayerProfileInfo;
