import type { BacklogEntry } from "../types";
import { formatDate } from "../utils/formatDate";
import "./BacklogCard.css";

type BacklogCardProps = {
  entry: BacklogEntry;
  onRemove: (id: number) => void;
  onStatusChange: (id: number, status: string) => void;
};

export default function BacklogCard({
  entry,
  onRemove,
  onStatusChange,
}: BacklogCardProps) {
  const game = entry.game;

  if (!game) {
    return <div className="backlog-card">Game not found</div>;
  }

  return (
    <div className="card backlog-card h-100 shadow-sm">
      {game.cover ? (
        <div className="backlog-card-img-wrapper">
          <img src={game.cover} alt={game.title} className="backlog-card-img" />
        </div>
      ) : (
        <div className="backlog-card-placeholder">No cover</div>
      )}

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{game.title}</h5>

        <p className="card-text small mb-1">
          Released: {formatDate(game.released)}
        </p>

        <p className="card-text small mb-1">
          Rating: {game.rating ? game.rating.toFixed(1) : "N/A"}
        </p>

        <div className="mb-3">
          <label className="card-text small d-block mb-1">Status</label>
          <select
            className={`form-select form-select-sm status-select ${entry.status}`}
            value={entry.status}
            onChange={(e) => onStatusChange(entry.id, e.target.value)}
          >
            <option value="planned">Planned</option>
            <option value="playing">Playing</option>
            <option value="completed">Completed</option>
            <option value="dropped">Dropped</option>
          </select>
        </div>

        <p className="card-text small mb-3">
          Added: {formatDate(entry.addedAt)}
        </p>

        <div className="mt-auto">
          <button
            className="btn btn-danger btn-md w-100"
            onClick={() => onRemove(entry.id)}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
