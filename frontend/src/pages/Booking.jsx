import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import SeatGrid from '../components/SeatGrid';

export default function Booking() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => api(`/shows/${showId}`).then(setShow).catch((e) => setError(e.message));
  useEffect(() => { load(); }, [showId]);

  const toggle = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length < 8 ? [...s, id] : s));

  const confirm = async () => {
    setBusy(true);
    setError('');
    try {
      await api('/bookings', { method: 'POST', body: { showId, seats: selected } });
      navigate('/my-bookings');
    } catch (e) {
      setError(e.message);
      setSelected([]);
      load(); // refresh seat map if someone else grabbed a seat
    } finally {
      setBusy(false);
    }
  };

  if (!show) return error ? <div className="alert alert-danger">{error}</div> : <div className="text-center py-5"><div className="spinner-border" /></div>;

  return (
    <>
      <h3>{show.movie.title}</h3>
      <p className="text-muted">
        {show.theatre} · {new Date(show.startTime).toLocaleString()} · ₹{show.price} per seat
      </p>
      {error && <div className="alert alert-danger">{error}</div>}
      <SeatGrid rows={show.rows} cols={show.cols} booked={show.bookedSeats} selected={selected} onToggle={toggle} />
      <div className="card mt-4 p-3 d-flex flex-row justify-content-between align-items-center">
        <div>
          <div><strong>Seats:</strong> {selected.join(', ') || '—'}</div>
          <div><strong>Total:</strong> ₹{selected.length * show.price}</div>
        </div>
        <button className="btn btn-success" disabled={!selected.length || busy} onClick={confirm}>
          {busy ? 'Booking...' : 'Confirm booking'}
        </button>
      </div>
    </>
  );
}
