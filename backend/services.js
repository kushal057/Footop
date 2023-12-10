const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { mainFunctionForPlayer } = require('./scrapePlayerData');
const { mainFunctionForTeam } = require('./scrapeTeamData');
const { findSearchType } = require('./findSearchType');

require('dotenv').config();

const MONGODB_URL = process.env.MONGODB_URL;
const JWT_SECRET = process.env.JWT_SECRET;

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const playerDataSchema = new mongoose.Schema({
  playerName: { type: String, required: true, unique: true },
  data: [
    {
      itemName: { type: String, required: true },
      itemValue: { type: String, required: true },
    },
  ],
});

const teamDataSchema = new mongoose.Schema({
  teamName: { type: String, required: true, unique: true },
  data: [
    {
      itemName: { type: String, required: true },
      itemValue: { type: mongoose.Schema.Types.Mixed, required: true },
    },
  ],
});

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  token: String,
  followedPlayers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PlayerData' }],
  followedTeams: [{type:mongoose.Schema.Types.ObjectId, ref: 'TeamData'}]
});

const PlayerData = mongoose.model('PlayerData', playerDataSchema);
const TeamData = mongoose.model('TeamData', teamDataSchema);
const User = mongoose.model('User', userSchema);

async function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
}

const scrapeAndCachePlayerData = async (playerName) => {
  try {
    const newData = await mainFunctionForPlayer(playerName);
    return newData;
  } catch (error) {
    console.error('Error in scrapeAndCachePlayerData:', error);
    throw error;
  }
};

const scrapeAndCacheTeamData = async (teamName) => {
  try {
    const newData = await mainFunctionForTeam(teamName);
    return newData;
  } catch (error) {
    console.error('Error in scrapeAndCacheTeamData:', error);
    throw error;
  }
};

app.post('/users', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });

    const token = await generateToken(user._id);

    user.token = token;
    await user.save();

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = await generateToken(user._id);

    // Get Following data
    console.log(user)
    // Return user ID along with the token
    res.json({ userId: user._id, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add middleware for token verification on protected routes
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'username email');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint for scraping data
app.get('/search', async (req, res) => {
  const { searchTerm } = req.query;

  if (!searchTerm) {
    return res.status(400).json({ error: 'Search term is required' });
  }

  // Normalize search term
  const searchTermNormalized = searchTerm.toLowerCase();

  // Check for cached player data (case-insensitive)
  const existingPlayerData = await PlayerData.findOne({
    $or: [
      { playerName: { $regex: new RegExp(`^${searchTerm}$`, 'i') } },
      { playerNameNormalized: searchTermNormalized },
    ],
  });

  if (existingPlayerData && existingPlayerData.data && existingPlayerData.data.length > 0) {
    console.log('Using cached data for player:', searchTerm);
    return res.json({ playerData: existingPlayerData.data });
  }

  // Check for cached team data (case-insensitive)
  const existingTeamData = await TeamData.findOne({
    $or: [
      { teamName: { $regex: new RegExp(`^${searchTerm}$`, 'i') } },
      { teamNameNormalized: searchTermNormalized },
    ],
  });

  if (existingTeamData && existingTeamData.data && existingTeamData.data.length > 0) {
    console.log('Using cached data for team:', searchTerm);
    return res.json({ teamData: existingTeamData.data });
  }

  // Determine the search type
  const searchType = await findSearchType(searchTerm);

  if (searchType === 'player') {
    try {
      // If not cached, scrape and cache new player data
      const playerName = searchTerm;
      const newData = await scrapeAndCachePlayerData(playerName);

      // Check if the player name already exists in any form
      const existingPlayer = await PlayerData.findOne({
        $or: [
          { playerName: { $regex: new RegExp(`^${playerName}$`, 'i') } },
          { playerNameNormalized: searchTermNormalized },
        ],
      });

      if (existingPlayer) {
        console.log('Using cached data for player:', playerName);
        return res.json({ playerData: existingPlayer.data });
      }

      // Create a record with the original search term
      const newPlayerData = new PlayerData({
        playerName,
        playerNameNormalized: playerName.toLowerCase(),
        data: newData,
      });

      // Create a record with the normalized player name
      const newNormalizedPlayerData = new PlayerData({
        playerName: newData.find(item => item.itemName === 'playerName').itemValue,
        playerNameNormalized: searchTermNormalized,
        data: newData,
      });

      await newPlayerData.save();
      await newNormalizedPlayerData.save();

      console.log('Scraped and cached data for player:', playerName);
      res.json({ playerData: newPlayerData.data });
    } catch (error) {
      console.error('Error scraping and caching player data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (searchType === 'team') {
    try {
      // If not cached, scrape and cache new team data
      const teamName = searchTerm;
      const newData = await scrapeAndCacheTeamData(teamName);

      // Check if the team name already exists in any form
      const existingTeam = await TeamData.findOne({
        $or: [
          { teamName: { $regex: new RegExp(`^${teamName}$`, 'i') } },
          { teamNameNormalized: searchTermNormalized },
        ],
      });

      if (existingTeam) {
        console.log('Using cached data for team:', teamName);
        return res.json({ teamData: existingTeam.data });
      }

      // Create a record with the original search term
      const newTeamData = new TeamData({
        teamName,
        teamNameNormalized: teamName.toLowerCase(),
        data: newData,
      });

      // Create a record with the normalized team name
      const newNormalizedTeamData = new TeamData({
        teamName: newData.find(item => item.itemName === 'teamName').itemValue,
        teamNameNormalized: searchTermNormalized,
        data: newData,
      });

      await newTeamData.save();
      await newNormalizedTeamData.save();

      console.log('Scraped and cached data for team:', teamName);
      res.json({ teamData: newTeamData.data });
    } catch (error) {
      console.error('Error scraping and caching team data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // Invalid search type
    console.log(`Invalid search type for ${searchTerm}`);
    res.status(400).json({ error: 'Invalid search type' });
  }
});

let currentIndex = 0;

app.get('/top-players', async (req, res) => {
  try {
    // Fetch the total number of players in the database
    const totalNumberOfPlayers = await PlayerData.countDocuments();

    // Check if there are players in the database
    if (totalNumberOfPlayers === 0) {
      return res.json({ playerData: null });
    }

    // Fetch one player record from the database based on the current index
    const playerData = await PlayerData.findOne({})
      .skip(currentIndex)
      .sort({ /* You can specify the sorting criteria here */ });

    // Increment the index for the next request
    currentIndex = (currentIndex + 1) % totalNumberOfPlayers;

    res.json({ playerData });
  } catch (error) {
    console.error('Error fetching top player data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/follow/player', async (req, res) => {
  const { userId, playerName } = req.body;
  console.log("following player")

  try {
    // Check if the user and player exist
    const user = await User.findById(userId);
    const player = await PlayerData.findOne({ 'data.itemName': 'playerName', 'data.itemValue': playerName });

    if (!user || !player) {
      return res.status(404).json({ error: 'User or player not found' });
    }

    // Check if the player is not already followed
    if (!user.followedPlayers.includes(player._id)) {
      // Add the player to the user's followedPlayers list
      user.followedPlayers.push(player._id);
      await user.save();

      res.json({ success: true, message: `You are now following ${playerName}` });
    } else {
      res.json({ success: false, message: `You are already following ${playerName}` });
    }
  } catch (error) {
    console.error('Error following player:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/follow/team', async (req, res) => {
  const { userId, teamName } = req.body;

  try {
    // Check if the user and team exist
    const user = await User.findById(userId);
    const team = await TeamData.findOne({ 'data.itemName': 'teamName', 'data.itemValue': teamName });

    if (!user || !team) {
      return res.status(404).json({ error: 'User or team not found' });
    }

    // Check if the team is not already followed
    if (!user.followedTeams.includes(team._id)) {
      // Add the team to the user's followedTeams list
      user.followedTeams.push(team._id);
      await user.save();

      res.json({ success: true, message: `You are now following ${teamName}` });
    } else {
      res.json({ success: false, message: `You are already following ${teamName}` });
    }
  } catch (error) {
    console.error('Error following team:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/following/players/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId).populate('followedPlayers');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const followedPlayerData = await Promise.all(
      user.followedPlayers.map(async (playerId) => {
        const playerData = await PlayerData.findById(playerId);
        return playerData.data;
      })
    );

    const response = {
      userId: user._id,
      followedPlayers: followedPlayerData,
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching followed players:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/following/teams/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId).populate('followedTeams');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const followedTeamData = await Promise.all(
      user.followedTeams.map(async (teamId) => {
        const teamData = await TeamData.findById(teamId);
        return teamData.data;
      })
    );

    const response = {
      userId: user._id,
      followedTeams: followedTeamData,
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching followed teams:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Collaborative filtering recommendation endpoint
app.get('/recommendations/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find the target user
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get the list of players and teams followed by the target user
    const followedPlayers = targetUser.followedPlayers;
    const followedTeams = targetUser.followedTeams;

    // Find users who have similar preferences (followed players and teams)
    const similarUsers = await User.find({
      $and: [
        { _id: { $ne: targetUser._id } }, // Exclude the target user
        {
          $or: [
            { followedPlayers: { $in: followedPlayers } },
            { followedTeams: { $in: followedTeams } },
          ],
        },
      ],
    });

    // Get recommendations by finding players and teams followed by similar users but not by the target user
    const playerRecommendations = await PlayerData.find({
      _id: { $nin: followedPlayers }, // Players not followed by the target user
      'data.itemName': 'playerName',
    }).limit(5);

    const teamRecommendations = await TeamData.find({
      _id: { $nin: followedTeams }, // Teams not followed by the target user
      'data.itemName': 'teamName',
    }).limit(5);

    res.json({ playerRecommendations, teamRecommendations });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
