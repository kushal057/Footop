import styles from "./HomeDashboardPage.module.css"
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";

export default function HomeDashboardPage() {
    return (
        <div className={styles.homeDashboard}>
            <Sidebar />
            <div className={styles.mainContent}>
                <div className={styles.topBar}>
                    <SearchBar />
                </div>
            </div>
        </div>
    )
}