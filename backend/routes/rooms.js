import express from 'express';
import Room from '../models/Room.js';

const router = express.Router();

// Get all rooms with filtering
router.get('/', async (req, res) => {
  try {
    const { location, type, capacity } = req.query;
    let filter = {};

    if (location) filter.location = new RegExp(location, 'i');
    if (type) filter.type = type;
    if (capacity) filter.capacity = { $gte: parseInt(capacity) };

    const rooms = await Room.find(filter);
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single room
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create room (admin only - simplified)
router.post('/', async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;