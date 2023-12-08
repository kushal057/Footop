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
  searchHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SearchHistory' }],
});

const searchHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  searchTerm: String,
  timestamp: { type: Date, default: Date.now },
});

const preferenceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  followedTeams: [String],
  followedPlayers: [String],
});

const PlayerData = mongoose.model('PlayerData', playerDataSchema);
const TeamData = mongoose.model('TeamData', teamDataSchema);
const User = mongoose.model('User', userSchema);
const SearchHistory = mongoose.model('SearchHistory', searchHistorySchema);
const Preference = mongoose.model('Preference', preferenceSchema);

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

app.post('/preferences', async (req, res) => {
  const { userId, followedTeams, followedPlayers } = req.body;
  const preference = new Preference({ userId, followedTeams, followedPlayers });

  try {
    await preference.save();
    res.status(201).json(preference);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/preferences/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const preference = await Preference.findOne({ userId });
    res.json(preference);
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

// Endpoint for following teams or players
app.post('/follow', async (req, res) => {
  const { userId, followType, followId } = req.body;

  try {
    const preference = await Preference.findOne({ userId });

    if (!preference) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (followType === 'team') {
      // Check if the team is already followed
      if (!preference.followedTeams.includes(followId)) {
        preference.followedTeams.push(followId);
        await preference.save();
        res.status(200).json({ success: true });
      } else {
        res.status(400).json({ error: 'Team is already followed' });
      }
    } else if (followType === 'player') {
      // Check if the player is already followed
      if (!preference.followedPlayers.includes(followId)) {
        preference.followedPlayers.push(followId);
        await preference.save();
        res.status(200).json({ success: true });
      } else {
        res.status  (400).json({ error: 'Player is already followed' });
      }
    } else {
      res.status(400).json({ error: 'Invalid follow type' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
