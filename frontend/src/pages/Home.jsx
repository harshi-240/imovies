import { useEffect, useState } from 'react';
import { api } from '../api';
import MovieCard from '../components/MovieCard';

const GENRES = ['All', 'Action', 'Sci-Fi', 'Romance', 'Thriller', 'Comedy', 'Horror', 'Family'];

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [q, setQ] = useState('');
  const [genre, setGenre] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Re-fetch (debounced) whenever search text or genre changes
  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (q) params.set('q', q);
        if (genre !== 'All') params.set('genre', genre);
        setMovies(await api(`/movies?${params}`));
        setError('');
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [q, genre]);

  return (
    <>
      <div className="hero rounded-4 p-4 p-md-5 mb-4 text-white">
        <h1 className="fw-bold">Movie ticket booking made simple.</h1>
        <p className="lead mb-3">Browse movies, pick a showtime and reserve your seats in seconds.</p>
        <input className="form-control form-control-lg" placeholder="Search movies..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="d-flex flex-wrap gap-2 mb-4">
        {GENRES.map((g) => (
          <button key={g} className={`btn btn-sm ${g === genre ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setGenre(g)}>{g}</button>
        ))}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div className="text-center py-5"><div className="spinner-border" /></div>
      ) : movies.length === 0 ? (
        <p className="text-muted">No movies found.</p>
      ) : (
        <div className="row g-4">
          {movies.map((m) => (
            <div className="col-6 col-md-4 col-lg-2" key={m._id}><MovieCard movie={m} /></div>
          ))}
        </div>
      )}
    </>
  );
}
