import type { BacklogEntry } from "../types";
import "./BacklogCard.css";

type BacklogCardProps = {
  entry: BacklogEntry;
  onRemove: (id: number) => void;
};

export default function BacklogCard({ entry, onRemove }: BacklogCardProps) {
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
          Released: {game.released || "N/A"}
        </p>

        <p className="card-text small mb-1">
          Rating: {game.rating ? game.rating.toFixed(1) : "N/A"}
        </p>

        <p className="card-text small mb-2">
          Status:
          <span className={`status-badge ${entry.status}`}>{entry.status}</span>
        </p>

        <p className="card-text small mb-3">
          Added: {new Date(entry.addedAt).toLocaleDateString()}
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
