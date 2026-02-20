import type { Game } from "../types";

type GameCardProps = {
  game: Game;
  inBacklog: boolean;
  onAdd: (rawgId: number) => void;
};

export default function GameCard({ game, inBacklog, onAdd }: GameCardProps) {
  return (
    <div className="game-card">
      {game.cover ? (
        <img
          src={game.cover}
          alt={game.title}
          width={120}
          height={180}
          style={{ objectFit: "cover" }}
        />
      ) : (
        <div
          style={{
            width: 120,
            height: 180,
            background: "#333",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          No cover
        </div>
      )}
      <h3>{game.title}</h3>
      <p>Released: {game.released || "N/A"}</p>
      <p>Rating: {game.rating ? game.rating.toFixed(1) : "N/A"}</p>

      {!inBacklog && (
        <button onClick={() => onAdd(game.id)}>Add to backlog</button>
      )}
      {inBacklog && <span style={{ color: "lime" }}>✓ In backlog</span>}
    </div>
  );
}
