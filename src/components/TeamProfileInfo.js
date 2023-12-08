import React, { useState, useEffect } from 'react';
import styles from "./TeamProfileInfo.module.css"
import Button from "./Button";

export default function TeamProfileInfo({ data, userId }) {
    const [isFollowed, setIsFollowed] = useState(false);

    useEffect(() => {
        const fetchFollowStatus = async () => {
            // Fetch the follow status from the server based on the user ID and normalized player name
            try {
                const response = await fetch(`http://localhost:3001/follow-status?userId=${userId}&followType=player&followId=${data[0]?.itemValue}`);
                if (response.ok) {
                    const { isFollowed } = await response.json();
                    setIsFollowed(isFollowed);
                } else {
                    console.error('Error fetching follow status:', response.status);
                }
            } catch (error) {
                console.error('Error fetching follow status:', error);
            }
        };

        fetchFollowStatus();
    }, [data, userId]);

    const handleFollowClick = async () => {
        try {
            // Send a request to the server to follow/unfollow the player
            const response = await fetch('http://localhost:3001/follow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    followType: 'player',
                    followId: data[0]?.itemValue, // Using the normalized player name as followId
                }),
            });

            if (response.ok) {
                // Update the local state to reflect the new follow status
                setIsFollowed(!isFollowed);
            } else {
                // Handle error response from the server
                console.error('Error following player:', response.status);
            }
        } catch (error) {
            console.error('Error following player:', error);
        }
    };

    if (!data || data.length === 0) {
        // You can render a loading state or a message here
        return <p>No player data available</p>;
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

    // Check if playerName is defined before splitting

    return (
        <div className={styles.TeamProfileInfoBar}>
            <div className={styles.images}>
                <img className={styles.teamImage} src={teamImage} alt="Team" />
                <button
                    className={styles.btnFollow}
                    onClick={handleFollowClick}
                >
                    {isFollowed ? 'Unfollow' : 'Follow'}
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
}