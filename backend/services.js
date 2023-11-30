const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { mainFunction } = require('./scrapePlayerData');

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

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  token: String,
});

const preferenceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  followedTeams: [String],
  followedPlayers: [String],
});

const PlayerData = mongoose.model('PlayerData', playerDataSchema);
const User = mongoose.model('User', userSchema);
const Preference = mongoose.model('Preference', preferenceSchema);

async function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
}

const scrapeAndCachePlayerData = async (playerName) => {
  try {
    const newData = await mainFunction(playerName);
    return newData;
  } catch (error) {
    console.error('Error in scrapeAndCachePlayerData:', error);
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

    user.token = token;
    await user.save();

    res.json({ token });
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

// New endpoint for scraping player data
// New endpoint for scraping player data
app.get('/scrapePlayerData', async (req, res) => {
  const { playerName } = req.query;

  if (!playerName) {
    return res.status(400).json({ error: 'Player name is required' });
  }

  try {
    // Attempt to find the existing player data
    const existingData = await PlayerData.findOne({ playerName });

    // Check if the result contains data
    if (existingData && existingData.data && existingData.data.length > 0) {
      console.log('Using cached data for', playerName);
      return res.json({ playerData: existingData.data });
    }

    // If not cached, scrape and cache new data
    const newData = await scrapeAndCachePlayerData(playerName);

    // Attempt to update the existing player data with the new data
    const updatedResult = await PlayerData.findOneAndUpdate(
      { playerName },
      { $set: { data: newData } },
      { new: true, upsert: true }
    );

    if (!updatedResult) {
      console.log('Failed to update data for', playerName);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    console.log('Scraped and cached data for', playerName);
    res.json({ playerData: updatedResult.data });
  } catch (error) {
    console.error('Error scraping and caching player data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
