import { useEffect, useState } from 'react';
import { api } from '../api';

export default function MyBookings() {
  const [bookings, setBookings] = useState(null);
  const [error, setError] = useState('');

  const load = () => api('/bookings/mine').then(setBookings).catch((e) => setError(e.message));
  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try { await api(`/bookings/${id}`, { method: 'DELETE' }); load(); }
    catch (e) { setError(e.message); }
  };

  if (!bookings) return <div className="text-center py-5"><div className="spinner-border" /></div>;

  return (
    <>
      <h3 className="mb-3">My Bookings</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      {bookings.length === 0 && <p className="text-muted">No bookings yet.</p>}
      <div className="row g-3">
        {bookings.map((b) => (
          <div className="col-md-6" key={b._id}>
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <h5>{b.show?.movie?.title}</h5>
                  <span className={`badge ${b.status === 'CONFIRMED' ? 'bg-success' : 'bg-secondary'}`}>{b.status}</span>
                </div>
                <p className="mb-1 text-muted">{b.show?.theatre} · {b.show && new Date(b.show.startTime).toLocaleString()}</p>
                <p className="mb-1">Seats: <strong>{b.seats.join(', ')}</strong></p>
                <p className="mb-2">Paid: ₹{b.totalPrice}</p>
                {b.status === 'CONFIRMED' && (
                  <button className="btn btn-outline-danger btn-sm" onClick={() => cancel(b._id)}>Cancel booking</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
