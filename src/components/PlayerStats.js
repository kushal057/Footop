import TotalStatsBar from "./TotalStatsBar";
import styles from "./PlayerStats.module.css";
import goals_icon from "../assets/icons/goals_icon.svg";
import assists_icon from "../assets/icons/assists_icon.svg";
import motm_icon from "../assets/icons/medal_icon.svg";

export default function PlayerStats({ goals, assists, motm, matches }) {
    return (
        <div className={styles.PlayerStats}>
            <TotalStatsBar iconURL={goals_icon} obtained={goals} total={matches} />
            <TotalStatsBar iconURL={assists_icon} obtained={assists} total={matches} />
            <TotalStatsBar iconURL={motm_icon} obtained={motm} total={matches} />
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
                        <img src={motm_icon} alt="motm" />
                        <span>Man of the Match</span>
                    </div>
                </div>
                <div className={styles.totalMatches}>Total Matches: {matches}</div>
            </div>
           
        </div>
    )
}