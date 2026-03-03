import { Link } from "react-router-dom";
import type { Game } from "../types";
import { formatDate } from "../utils/formatDate";
import "./GameCard.css";

type GameCardProps = {
  game: Game;
  inBacklog: boolean;
  onAdd: (rawgId: number) => void;
};

export default function GameCard({ game, inBacklog, onAdd }: GameCardProps) {
  return (
    <Link to={`/game/${game.id}`} className="text-decoration-none text-reset">
      <div className="card game-card h-100 shadow-sm">
        {game.cover ? (
          <div className="game-card-img-wrapper">
            <img src={game.cover} alt={game.title} className="game-card-img" />
          </div>
        ) : (
          <div className="game-card-placeholder">No cover</div>
        )}

        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{game.title}</h5>

          <p className="card-text small mb-1">
            Released: {formatDate(game.released)}
          </p>

          <p className="card-text small mb-3 rating-text">
            Rating: {game.rating ? game.rating.toFixed(1) : "N/A"}
          </p>

          <div className="mt-auto">
            {!inBacklog && (
              <button
                className="btn btn-primary btn-md w-100"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onAdd(game.id);
                }}
              >
                Add to backlog
              </button>
            )}

            {inBacklog && (
              <span className="text-success fw-semibold d-block text-center">
                ✓ In backlog
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
