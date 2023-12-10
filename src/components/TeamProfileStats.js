import React from "react";
import SquadPlayer from "./SquadPlayer";
import styles from "./TeamProfileStats.module.css";

export default function TeamProfileStats({ data }) {
  if (!data || data.length === 0 || !data[0]?.itemValue || data[0]?.itemValue.length === 0) {
    // You can render a loading state or a message here
    return <p>No player data available</p>;
  }

  const squadData = data.find((item) => item.itemName === "squad");

  // Ensure squadData and itemValue are present
  const squad = squadData?.itemValue || [];

  // Determine the number of players in each chunk
  const playersPerChunk = squad.length <= 16 ? 5 : 8;

  // Split squad into chunks of playersPerChunk players each
  const chunks = [];
  for (let i = 0; i < squad.length; i += playersPerChunk) {
    chunks.push(squad.slice(i, i + playersPerChunk));
  }

  return (
    <div className={styles.TeamProfileStats}>
      {chunks.map((chunk, chunkIndex) => (
        <div
          key={chunkIndex}
          className={`${styles.squadChunk} ${playersPerChunk === 5 ? styles.fontSizeLarge : styles.fontSizeRegular}`}
        >
          {chunk.map((player, index) => (
            <SquadPlayer
              key={index}
              playerImage={player.playerImage}
              playerName={player.playerName}
              playerPosition={player.playerPosition}
              playerNumber={player.playerNumber}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
