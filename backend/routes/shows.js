const router = require('express').Router();
const Show = require('../models/Show');

// Real-time seat availability for a show
router.get('/:id', async (req, res) => {
  try {
    const show = await Show.findById(req.params.id).populate('movie', 'title poster duration');
    if (!show) return res.status(404).json({ message: 'Show not found' });
    res.json(show);
  } catch (err) {
    res.status(400).json({ message: 'Invalid show id' });
  }
});

module.exports = router;
