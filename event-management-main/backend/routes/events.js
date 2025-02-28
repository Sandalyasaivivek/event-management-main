// backend/routes/events.js
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const jwt = require('jsonwebtoken');

// Middleware to check JWT token
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Create an event
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, date, category } = req.body;
    const newEvent = new Event({ 
      name, 
      description, 
      date, 
      category, 
      owner: req.user.id,
      attendees: [] 
    });
    await newEvent.save();
    res.json(newEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an event (only the owner can update)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.owner.toString() !== req.user.id) 
      return res.status(403).json({ message: 'Unauthorized' });

    const { name, description, date, category } = req.body;
    event.name = name || event.name;
    event.description = description || event.description;
    event.date = date || event.date;
    event.category = category || event.category;
    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an event (only the owner can delete)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.owner.toString() !== req.user.id) 
      return res.status(403).json({ message: 'Unauthorized' });
    await event.remove();
    res.json({ message: 'Event removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
