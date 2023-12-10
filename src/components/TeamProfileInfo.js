import React, { useState, useEffect } from 'react';
import styles from "./TeamProfileInfo.module.css";

const TeamProfileInfo = ({ data, userId }) => {
    const [isFollowed, setIsFollowed] = useState(false);

    if (!data || data.length === 0) {
        // You can render a loading state or a message here
        return <p>No team data available</p>;
    }

    // Define a mapping of expected field names to match with itemName substring
    const fieldMappings = {
        teamName: 'teamName',
        teamImage: 'teamImage',
        leagueName: 'leagueName',
        nationName: 'nationName',
        squad: 'squad'
    };

    // Extract relevant properties from the response
    const {
        teamName,
        teamImage,
        leagueName,
        nationName,
        squad

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

    
    const handleFollow = async () => {
        try {
            // Assuming you have the userId and playerName available
            console.log(userId) // Replace with the actual userId
            console.log(teamName)

            const response = await fetch('http://localhost:3001/follow/team', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, teamName }),
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
        <div className={styles.TeamProfileInfoBar}>
            <div className={styles.images}>
                <img className={styles.teamImage} src={teamImage} alt="Team" />
                <button
                    className={styles.btnFollow}
                    onClick={handleFollow}
                >
                Follow
                </button>
            </div>
            <div className={styles.texts}>
                <p className={styles.name}>
                    <span className={styles.teamName}>{teamName.trim()}</span>
                </p>
                <div className={styles.basicInfo}>
                    <p className={styles.row}>
                        <span className={styles.nationName} style={{ marginRight: '4em' }}>Nation: {nationName}</span>
                        <br />
                        <span className={styles.leagueName}>League: {leagueName}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TeamProfileInfo;
