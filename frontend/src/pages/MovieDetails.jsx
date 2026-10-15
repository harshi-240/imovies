import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Async JS: fetch movie and its shows in parallel
    Promise.all([api(`/movies/${id}`), api(`/movies/${id}/shows`)])
      .then(([m, s]) => { setMovie(m); setShows(s); })
      .catch((e) => setError(e.message));
  }, [id]);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!movie) return <div className="text-center py-5"><div className="spinner-border" /></div>;

  // Group shows by date
  const byDate = shows.reduce((acc, s) => {
    const key = new Date(s.startTime).toDateString();
    (acc[key] = acc[key] || []).push(s);
    return acc;
  }, {});

  return (
    <div className="row g-4">
      <div className="col-md-4 col-lg-3"><img src={movie.poster} alt={movie.title} className="img-fluid rounded-4 shadow" /></div>
      <div className="col-md-8 col-lg-9">
        <h2 className="fw-bold">{movie.title}</h2>
        <p className="text-muted">
          {movie.genre.join(' • ')} | {movie.duration} min | {movie.language} | <span className="badge bg-success">★ {movie.rating}</span>
        </p>
        <p>{movie.description}</p>

        <h5 className="mt-4">Showtimes</h5>
        {Object.keys(byDate).length === 0 && <p className="text-muted">No upcoming shows.</p>}
        {Object.entries(byDate).map(([date, list]) => (
          <div key={date} className="mb-3">
            <div className="fw-semibold mb-2">{date}</div>
            <div className="d-flex flex-wrap gap-2">
              {list.map((s) => (
                <Link key={s._id} to={`/book/${s._id}`} className="btn btn-outline-primary btn-sm">
                  {new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  <br /><small>{s.theatre} · ₹{s.price}</small>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
