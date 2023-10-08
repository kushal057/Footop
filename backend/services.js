const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/Footop', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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

const User = mongoose.model('User', userSchema);
const Preference = mongoose.model('Preference', preferenceSchema);

// Function to generate a JWT token for a user
function generateToken(userId) {
  return jwt.sign({ userId }, 'your-secret-key', { expiresIn: '1h' });  // Adjust the expiration as needed
}

app.post('/users', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = new User({ username, email, password });

    // Generate a JWT token
    const token = generateToken(user._id);

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
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = generateToken(user._id);

    user.token = token;
    await user.save();

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
