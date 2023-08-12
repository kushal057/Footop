import styles from "./SidebarNavItem.module.css"

export default function NavSidebarItem({src, text}) {
    return(
        <div className={styles.sidebarNavItem}>
            <div className={styles.imageContainer}>
                <img src={src} alt={text}/>
            </div>
            <p>{text}</p>
        </div>
    )
}