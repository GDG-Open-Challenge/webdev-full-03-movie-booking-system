
router.post('/book', async (req, res) => {
  try {
    const { movieId, seatNumber, userId } = req.body;

    const seat = await Seat.findOneAndUpdate(
      { movieId, seatNumber },
      { $set: { isBooked: true, bookedBy: userId } },
      { new: true }
    );

    if (!seat) {
      return res.status(404).json({ message: 'Seat not found' });
      
    }

    res.json({ message: 'Seat booked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
