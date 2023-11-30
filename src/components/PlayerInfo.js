import styles from "./PlayerInfo.module.css"
import player_icon from "../assets/icons/player_icon.png"
import club_logo_icon from "../assets/icons/club_logo_icon.png"
import country_icon from "../assets/icons/country_icon.png"

export default function PlayerInfo({ data }) {
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
  
    return (
      <div className={styles.playerInfoBar}>
        <div className={styles.texts}>
          <p className={styles.name}>
            <span className={styles.firstName}>{firstName}</span>
            <span className={styles.lastName}>{lastName}</span>
          </p>
          <div className={styles.basicInfo}>
            <p className={styles.row}>
              <span className={styles.age} style={{marginRight: '4em'}}>Age: {age}</span>
              <br />
              <span className={styles.position}>Position: {position.split(' ')[0]}</span>
            </p>
          </div>
        </div>
        <div className={styles.images}>
          <img className={styles.playerIcon} src={playerImage} alt="Player" />
          <img className={styles.countryIcon} src={countryImage} alt="Country" />
        </div>
      </div>
    );
  }