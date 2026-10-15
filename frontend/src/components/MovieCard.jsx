import { Link } from 'react-router-dom';

export default function MovieCard({ movie }) {
  return (
    <Link to={`/movies/${movie._id}`} className="text-decoration-none">
      <div className="card movie-card h-100 shadow-sm">
        <img src={movie.poster} className="card-img-top" alt={movie.title} />
        <div className="card-body">
          <h6 className="card-title text-dark mb-1">{movie.title}</h6>
          <small className="text-muted">{movie.genre.join(' • ')}</small>
          <div className="mt-2"><span className="badge bg-success">★ {movie.rating}</span></div>
        </div>
      </div>
    </Link>
  );
}
