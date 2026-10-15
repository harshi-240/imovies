// Renders rows A, B, C... and columns 1..n. Booked seats are disabled.
export default function SeatGrid({ rows, cols, booked, selected, onToggle }) {
  const letters = Array.from({ length: rows }, (_, i) => String.fromCharCode(65 + i));

  return (
    <div className="seat-wrap">
      <div className="screen">SCREEN THIS WAY</div>
      {letters.map((r) => (
        <div className="seat-row" key={r}>
          <span className="row-label">{r}</span>
          {Array.from({ length: cols }, (_, c) => {
            const id = `${r}${c + 1}`;
            const isBooked = booked.includes(id);
            const isSel = selected.includes(id);
            return (
              <button
                key={id}
                type="button"
                disabled={isBooked}
                onClick={() => onToggle(id)}
                className={`seat ${isBooked ? 'booked' : isSel ? 'selected' : ''}`}
                title={id}
              >
                {c + 1}
              </button>
            );
          })}
        </div>
      ))}
      <div className="legend mt-3">
        <span><i className="seat" /> Available</span>
        <span><i className="seat selected" /> Selected</span>
        <span><i className="seat booked" /> Booked</span>
      </div>
    </div>
  );
}
