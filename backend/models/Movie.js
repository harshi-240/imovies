const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    genre: [String],
    language: { type: String, default: 'English' },
    duration: Number, // minutes
    rating: { type: Number, default: 0 },
    poster: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Movie', movieSchema);
