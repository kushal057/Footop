import TotalStatsBar from "./TotalStatsBar";
import styles from "./PlayerStats.module.css";
import goals_icon from "../assets/icons/goals_icon.svg";
import assists_icon from "../assets/icons/assists_icon.svg";
import motm_icon from "../assets/icons/medal_icon.svg";

export default function PlayerStats({data}) {
    if (!data || data.length === 0) {
        // You can render a loading state or a message here
        return <p>No player data available</p>;
      }

    const fieldMappings = {
        goals: 'goals',
        assists: 'assists',
        matchesPlayed: 'matchesPlayed',
        minutesPlayed: 'minutesPlayed'
    };
    const {
        goals,
        assists,
        matchesPlayed,
        minutesPlayed
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
    return (
        <div className={styles.PlayerStats}>
            <TotalStatsBar iconURL={goals_icon} obtained={goals} total={matchesPlayed} />
            <TotalStatsBar iconURL={assists_icon} obtained={assists} total={matchesPlayed} />
            <TotalStatsBar iconURL={motm_icon} obtained={minutesPlayed} total={matchesPlayed} />
            <div className={styles.descriptions}>
                <div className={styles.iconLabels}>
                    <div>
                        <img src={goals_icon} alt="goals" />
                        <span>Goals Scored</span>
                    </div>
                    <div>
                        <img src={assists_icon} alt="assists" />
                        <span>Assists Made</span>
                    </div>
                    <div>
                        <img src={motm_icon} alt="Yellow cards" />
                        <span>Minutes Played</span>
                    </div>
                </div>
                <div className={styles.totalmatchesPlayed}>Total Matches Played: {matchesPlayed}</div>
            </div>
           
        </div>
    )
}