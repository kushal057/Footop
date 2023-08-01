import styles from "./Sidebar.module.css"
import NavItem from "../components/SidebarNavItem"
import Logo from "../components/Logo"
import home_icon from "../assets/icons/home_icon.svg"
import following_icon from "../assets/icons/following_icon.svg"
import for_you_icon from "../assets/icons/for_you_icon.svg"
import compare_icon from "../assets/icons/compare_icon.svg"

export default function Sidebar() {
    return(
        <div class={styles.sidebar}>
            <Logo text="Footop"/>
            <NavItem src={home_icon} text="Home"/>
            <NavItem src={following_icon} text="Following"/>
            <NavItem src={for_you_icon} text="For you"/>
            <NavItem src={compare_icon} text="Compare"/>
        </div>
    )
}