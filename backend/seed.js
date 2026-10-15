require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const Show = require('./models/Show');

const poster = (t) => `https://placehold.co/300x450/1d2671/ffffff?text=${encodeURIComponent(t)}`;
const movies = [
  { title: 'Galaxy Rangers', genre: ['Sci-Fi', 'Action'], duration: 142, rating: 8.4, language: 'English', description: 'A rogue crew races across the galaxy to stop a collapsing star.' },
  { title: 'Monsoon Melody', genre: ['Romance', 'Drama'], duration: 128, rating: 7.9, language: 'Hindi', description: 'Two musicians meet during a rainy season in Indore and rewrite each other\'s songs.' },
  { title: 'The Last Heist', genre: ['Thriller'], duration: 118, rating: 8.1, language: 'English', description: 'One final robbery, one traitor, and twenty minutes to escape.' },
  { title: 'Laugh Riot', genre: ['Comedy'], duration: 110, rating: 7.2, language: 'Hindi', description: 'A wedding planner\'s worst week turns into a family comedy of errors.' },
  { title: 'Haunted Haveli', genre: ['Horror'], duration: 124, rating: 7.0, language: 'Hindi', description: 'A heritage hotel hides a secret that does not want to be found.' },
  { title: 'Pixel Pals', genre: ['Animation', 'Family'], duration: 96, rating: 8.0, language: 'English', description: 'Video game characters escape the arcade to save their world.' },
].map((m) => ({ ...m, poster: poster(m.title) }));

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Movie.deleteMany();
  await Show.deleteMany();
  const created = await Movie.insertMany(movies);

  const theatres = ['PVR Treasure Island', 'INOX Malhar Mega Mall', 'Cinepolis Phoenix'];
  const hours = [11, 15, 19, 22];
  const shows = [];
  for (const m of created) {
    for (let d = 0; d < 3; d++) {
      for (const [i, h] of hours.entries()) {
        const t = new Date();
        t.setDate(t.getDate() + d + 1);
        t.setHours(h, 0, 0, 0);
        shows.push({ movie: m._id, theatre: theatres[i % theatres.length], startTime: t, price: 150 + (h >= 19 ? 70 : 0) });
      }
    }
  }
  await Show.insertMany(shows);
  console.log(`Seeded ${created.length} movies and ${shows.length} shows`);
  process.exit(0);
})();
