import styles from "./HomeDashboardPage.module.css"
import Sidebar from "../components/Sidebar"

export default function HomeDashboardPage() {
    return (
        <div className={styles.HomeDashboardPage}>
            <Sidebar />
        </div>
    )
}