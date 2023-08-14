import styles from "./UserInfoBox.module.css";
import user_icon from "../assets/icons/user_icon.svg";

export default function UserInfoBox () {
    return (
        <div className={styles.userInfoBox}>
            <div className={styles.userIconContainer}><img src={user_icon} alt="User"/></div>
            <p className={styles.userMessage}>Welcome, <br />Kushal</p>
        </div>
    )
}