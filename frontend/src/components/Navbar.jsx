import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-dark brand-bar">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">🎬 IMovies</Link>
        <div className="d-flex align-items-center gap-2">
          {user ? (
            <>
              <NavLink className="nav-link text-light" to="/my-bookings">My Bookings</NavLink>
              <span className="text-light small d-none d-md-inline">Hi, {user.name}</span>
              <button className="btn btn-outline-light btn-sm" onClick={() => { logout(); navigate('/'); }}>Logout</button>
            </>
          ) : (
            <>
              <NavLink className="nav-link text-light" to="/login">Login</NavLink>
              <Link className="btn btn-warning btn-sm" to="/register">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
