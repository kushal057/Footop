import {useState, react} from 'react'
import styles from "./SearchBar.module.css"
import search_icon from "../assets/icons/search_icon.svg"

export default function SearchBar({searchInput, handleSearchInput, handleReloadImages}) {

    return (
        <div className={styles.searchBar}>
            <input type="text" value={searchInput} onChange={handleSearchInput}/>
            <button onClick={handleReloadImages}><img src={search_icon} alt="search" /></button>
        </div>
    )
}