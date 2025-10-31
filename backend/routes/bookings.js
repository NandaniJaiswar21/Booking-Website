import express from 'express';
import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { sendBookingConfirmation, sendCancellationEmail } from '../services/emailService.js';

const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Create booking
router.post('/', verifyToken, async (req, res) => {
  try {
    const { roomId, bookingDate, startTime, endTime, totalHours } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
      room: roomId,
      bookingDate: new Date(bookingDate),
      startTime: { $lte: endTime },
      endTime: { $gte: startTime },
      status: { $in: ['confirmed'] }
    });

    if (conflictingBooking) {
      return res.status(400).json({ message: 'Room already booked for this time slot' });
    }

    const totalAmount = room.pricePerHour * totalHours;

    const booking = await Booking.create({
      user: req.userId,
      room: roomId,
      bookingDate,
      startTime,
      endTime,
      totalHours,
      totalAmount,
      paymentStatus: 'completed'
    });

    // Generate QR code data
    const qrData = `ROOMBOOK:${booking._id}:${room.name}:${booking.bookingDate}:${booking.startTime}-${booking.endTime}:${user.email}`;
    booking.qrCode = qrData;
    await booking.save();

    // Send confirmation email with QR code
    await sendBookingConfirmation(booking, user, room);

    await booking.populate('room');
    await booking.populate('user', 'name email mobileNumber');

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user bookings
router.get('/my-bookings', verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId })
      .populate('room')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Cancel booking
router.put('/:id/cancel', verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.userId })
      .populate('room')
      .populate('user', 'name email');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    // Send cancellation email
    await sendCancellationEmail(booking, booking.user, booking.room);

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;