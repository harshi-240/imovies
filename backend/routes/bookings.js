const router = require('express').Router();
const protect = require('../middleware/auth');
const Show = require('../models/Show');
const Booking = require('../models/Booking');

router.use(protect);

// Create booking. The seat check and the update are ONE atomic MongoDB operation,
// so two users can never book the same seat at the same time.
router.post('/', async (req, res) => {
  try {
    const { showId, seats } = req.body;
    if (!showId || !Array.isArray(seats) || seats.length === 0)
      return res.status(400).json({ message: 'showId and at least one seat are required' });
    if (seats.length > 8) return res.status(400).json({ message: 'Maximum 8 seats per booking' });

    const unique = [...new Set(seats)];
    const show = await Show.findOneAndUpdate(
      { _id: showId, startTime: { $gt: new Date() }, bookedSeats: { $nin: unique } },
      { $push: { bookedSeats: { $each: unique } } },
      { new: true }
    );
    if (!show)
      return res.status(409).json({ message: 'One or more seats are already booked (or show has started)' });

    const booking = await Booking.create({
      user: req.user._id,
      show: show._id,
      seats: unique,
      totalPrice: unique.length * show.price,
    });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/mine', async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .sort('-createdAt')
      .populate({ path: 'show', populate: { path: 'movie', select: 'title poster' } });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status === 'CANCELLED') return res.status(400).json({ message: 'Already cancelled' });

    await Show.updateOne({ _id: booking.show }, { $pull: { bookedSeats: { $in: booking.seats } } });
    booking.status = 'CANCELLED';
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
