import styles from "./SidebarNavItem.module.css"

export default function NavSidebarItem({src, text}) {
    return(
        <div className={styles.sidebarNavItem}>
            <img src={src} alt={text}/>
            <p>{text}</p>
        </div>
    )
}