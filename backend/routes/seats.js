const express = require('express');
const router = express.Router();
const Seat = require('../models/Seat');

router.get('/movie/:movieId', async (req, res) => {
  try {
    const seats = await Seat.find({ movieId: req.params.movieId });
    res.json(seats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/book', async (req, res) => {
  try {
    const { movieId, seatNumber, userId } = req.body;

    const seat = await Seat.findOne({ movieId, seatNumber });

    if (!seat) {
      return res.status(404).json({ message: 'Seat not found' });
    }

    if (seat.isBooked) {
      return res.status(400).json({ message: 'Seat already booked' });
    }

    seat.isBooked = true;
    seat.bookedBy = userId;
    await seat.save();

    res.json({ message: 'Seat booked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/initialize/:movieId', async (req, res) => {
  try {
    const { movieId } = req.params;
    const existingSeats = await Seat.findOne({ movieId });

    if (existingSeats) {
      return res.json({ message: 'Seats already initialized' });
    }

    const seats = [];
    const rows = ['A', 'B', 'C', 'D', 'E'];
    const seatsPerRow = 20;

    for (let row of rows) {
      for (let i = 1; i <= seatsPerRow; i++) {
        seats.push({
          movieId,
          seatNumber: `${row}${i}`,
          isBooked: false,
        });
      }
    }

    await Seat.insertMany(seats);
    res.status(201).json({ message: 'Seats initialized' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
