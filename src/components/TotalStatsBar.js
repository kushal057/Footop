import styles from "./TotalStatsBar.module.css"

export default function TotalStatsBar({iconURL, obtained, total}) {
    const percentage = (obtained / total) * 100;

  return (
    <div className={styles.progressBar}>
      <div
        className={styles.progressBarFill}
        style={{ width: `${percentage}%` }}
      >
        <div className={styles.progressBarIcon}>
          <img src={iconURL} alt=""/>
        </div>        
        <div className={styles.progressBarNumber}>{obtained}</div>
      </div>
    </div>
  );
}