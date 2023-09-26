import styles from "./HomeDashboardPage.module.css";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import UserInfoBox from "../components/UserInfoBox";
import PlayerInfo from "../components/PlayerInfo";
import PlayerStats from "../components/PlayerStats";

export default function HomeDashboardPage() {
    return (
        <div className={styles.homeDashboard}>
            <Sidebar />
            <div className={styles.mainContent}>
                <div className={styles.topBar}>
                    <SearchBar />
                    <UserInfoBox />
                </div>
                <div className={styles.playerContainer}>
                    <PlayerInfo />
                    <PlayerStats />
                </div>
            </div>
        </div>
    )
}