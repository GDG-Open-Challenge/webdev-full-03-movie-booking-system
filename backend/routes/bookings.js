const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Seat = require('../models/Seat');
const Movie = require('../models/Movie');

router.post('/', async (req, res) => {
  try {
    
    const { movieId, userId, seats } = req.body;
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const totalPrice = movie.price * 1;

    const booking = new Booking({
      movieId,
      userId,
      seats,
      totalPrice,
    });

    await booking.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
