import styles from "./PlayerInfoBar.module.css"
import player_icon from "../assets/icons/player_icon.png"
import club_logo_icon from "../assets/icons/club_logo_icon.png"
import country_icon from "../assets/icons/country_icon.png"

export default function PlayerInfoBar(
    { name = "Erling Haaland", age = 22, position = "Striker", club = "Manchester City", shirtNumber = 9 , details = "basic"}) {
    const firstName = name.split(" ")[0];
    const lastName = name.split(" ")[name.split(" ").length - 1]; // Assign from the last word in the name prop
    return (
        <div className={styles.playerInfoBar}>
            <div className={styles.texts}>
                <p className={styles.name}>
                    <span className={styles.firstName}>{firstName}</span>
                    <span className={styles.lastName}>{lastName}</span>
                </p>
                <div className={styles.basicInfo}>
                    <p className={styles.row}>
                        <span className={styles.age}>Age: {age}</span><br />
                        <span className={styles.position}>Position: {position}</span>
                    </p>
                </div>
            </div>
            <div className={styles.images}>
                <img className={styles.playerIcon} src={player_icon} alt="Player"/>
                <img className={styles.countryIcon} src={country_icon} alt="Country"/>
            </div>
        </div>
    )
}