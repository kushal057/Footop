import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from "../components/Sidebar";
import styles from "./FollowingPage.module.css";
import SearchBar from "../components/SearchBar";
import UserInfoBox from "../components/UserInfoBox";
import {
    IoIosArrowDropleftCircle,
    IoIosArrowDroprightCircle,
} from "react-icons/io";
import { RiUserUnfollowLine } from "react-icons/ri";

export default function Recommendations() {
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState('');
    const [playerData, setPlayerData] = useState(null);
    const [followedPlayers, setFollowedPlayers] = useState([]);
    const [followedTeams, setFollowedTeams] = useState([]); // Add state for followed teams
    const [teamData, setTeamData] = useState(null);

    const handleSearchInput = (event) => {
        setSearchInput(event.target.value);
    };

    // Fetch initial player data from /top-players endpoint
    const fetchTopPlayers = async () => {
        try {
            const response = await fetch('http://localhost:3001/top-players');

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();

            // Log the received data to the console
            console.log('Top Players Data received from server:', responseData);

            // Update state with received player data
            setPlayerData(responseData.playerData.data);
        } catch (error) {
            console.error('Error fetching top player data:', error);
            // Handle the error (e.g., show an error message to the user)
        }
    };

    const handleSearchSubmit = async () => {
        try {
            if (!searchInput) {
                console.error('Player name is required');
                return;
            }

            const response = await fetch('http://localhost:3001/search?searchTerm=' + searchInput);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();

            // Log the received data to the console
            console.log('Data received from server:', responseData);

            if (responseData.teamData) {
                // Update state with received team data
                setTeamData(responseData.teamData);

                // Save team data to localStorage
                localStorage.setItem('teamData', JSON.stringify(responseData.teamData));

                // Navigate to TeamProfilePage
                navigate('/team-profile');
            } else if (responseData.playerData) {
                // Update state with received player data
                setPlayerData(responseData.playerData);

                // Save player data to localStorage
                localStorage.setItem('playerData', JSON.stringify(responseData.playerData));

                // Navigate to PlayerProfilePage
                navigate('/player-profile');
            } else {
                console.error('Invalid data format received');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle the error (e.g., show an error message to the user)
        }
    };

    useEffect(() => {
        // Check if the user is authenticated
        const token = localStorage.getItem('token');

        if (!token) {
            // Redirect to login if not authenticated
            // You might want to use your navigation logic here
            console.log('User is not authenticated. Redirecting to login page.');
            return;
        }

        // If authenticated, fetch the followed players and teams
        const userId = localStorage.getItem('userId');

        const fetchFollowedData = async (userId) => {
            try {
                // Make a GET request to the /following/:userId endpoint for players
                const playersResponse = await fetch(`http://localhost:3001/following/players/${userId}`);
                const playersData = await playersResponse.json();
                console.log('Followed players data:', playersData);

                // Make a GET request to the /following/:userId endpoint for teams
                const teamsResponse = await fetch(`http://localhost:3001/following/teams/${userId}`);
                const teamsData = await teamsResponse.json();
                console.log('Followed teams data:', teamsData);

                if (playersResponse.ok) {
                    setFollowedPlayers(playersData.followedPlayers);
                } else {
                    console.error('Error fetching followed player data:', playersData.error);
                }

                if (teamsResponse.ok) {
                    setFollowedTeams(teamsData.followedTeams);
                } else {
                    console.error('Error fetching followed team data:', teamsData.error);
                }
            } catch (error) {
                console.error('Error fetching followed data:', error);
            }
        };

        // Call the fetch function
        fetchFollowedData(userId);
    }, []);

    return (
        <div className={styles.container}>
            <Sidebar />
            <div className={styles.mainContent}>
                <div className={styles.topBar}>
                    <SearchBar searchInput={searchInput}
                        handleSearchInput={handleSearchInput}
                        handleSearchSubmit={handleSearchSubmit} />
                    <UserInfoBox />
                </div>
                <div className={styles.playersFollowing}>
                    <div className={styles.heading}>
                        <h1 className={styles.title}>Recommended Players</h1>
                        <div>
                            <IoIosArrowDropleftCircle className={styles.icon} />
                            <IoIosArrowDroprightCircle className={styles.icon} />
                        </div>
                    </div>
                    <div className={styles.players}>
                        {followedPlayers.map((player, index) => {
                            const fieldMappings = {
                                playerName: 'playerName',
                                playerImage: 'playerImage',
                                currentClub: 'currentClub'
                            };
                            const {
                                playerName,
                                playerImage,
                                currentClub
                            } = player.reduce((acc, item) => {
                                const matchedField = Object.keys(fieldMappings).find(fieldName =>
                                    item.itemName.includes(fieldMappings[fieldName])
                                );

                                if (matchedField) {
                                    acc[matchedField] = item.itemValue;
                                }

                                return acc;
                            }, {});

                            return (
                                <div key={index} className={styles.griditems}>
                                    <img src={playerImage} className={styles.gridimage} alt={`Player ${index + 1}`} />
                                    <div className={styles.playerDescription}>
                                        <h1 className={styles.playername}>{playerName}</h1>
                                        <h3 className={styles.clubname}>{currentClub}</h3>
                                    </div>
                                    <RiUserUnfollowLine className={styles.unfollowIcon} />
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className={styles.clubsFollowing}>
                    <div className={styles.heading}>
                        <h1 className={styles.title}>Recommended Teams</h1>
                        <div>
                            <IoIosArrowDropleftCircle className={styles.icon} />
                            <IoIosArrowDroprightCircle className={styles.icon} />
                        </div>
                    </div>
                    <div className={styles.players}>
                        {followedTeams.map((team, index) => {
                            const fieldMappings = {
                                teamImage: 'teamImage',
                                teamName: 'teamName',
                                leagueName: 'leagueName'
                            };
                            const {
                                teamImage,
                                teamName,
                                leagueName
                            } = team.reduce((acc, item) => {
                                const matchedField = Object.keys(fieldMappings).find(fieldName =>
                                    item.itemName.includes(fieldMappings[fieldName])
                                );

                                if (matchedField) {
                                    acc[matchedField] = item.itemValue;
                                }

                                return acc;
                            }, {});

                            return (
                                <div key={index} className={styles.griditems}>
                                    <img src={teamImage} className={styles.gridimage} alt={`Team ${index + 1}`} />
                                    <div className={styles.teamDescription}>
                                        <h1 className={styles.teamName}>{teamName}</h1>
                                        <h3 className={styles.leagueName}>{leagueName}</h3>
                                    </div>
                                    <RiUserUnfollowLine className={styles.unfollowIcon} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
