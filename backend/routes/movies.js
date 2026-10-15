const router = require('express').Router();
const Movie = require('../models/Movie');
const Show = require('../models/Show');

// GET /api/movies?q=galaxy&genre=Sci-Fi
router.get('/', async (req, res) => {
  try {
    const { q, genre } = req.query;
    const filter = {};
    if (q) filter.title = { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' };
    if (genre) filter.genre = genre;
    res.json(await Movie.find(filter).sort({ rating: -1 }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(400).json({ message: 'Invalid movie id' });
  }
});

// Upcoming shows for one movie
router.get('/:id/shows', async (req, res) => {
  try {
    const shows = await Show.find({ movie: req.params.id, startTime: { $gte: new Date() } }).sort('startTime');
    res.json(shows);
  } catch (err) {
    res.status(400).json({ message: 'Invalid movie id' });
  }
});

module.exports = router;
