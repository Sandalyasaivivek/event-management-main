// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');


router.get("/test", (req, res) => {
  res.json({ message: "Auth route working!" });
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login existing user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Guest login option
router.post('/guest', async (req, res) => {
  try {
    let guestUser = await User.findOne({ email: 'guest@example.com' });
    if (!guestUser) {
      guestUser = new User({ username: 'Guest', email: 'guest@example.com', password: 'guest' });
      await guestUser.save();
    }
    const token = jwt.sign({ id: guestUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: guestUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;



