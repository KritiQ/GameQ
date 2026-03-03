import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { GameDetailType } from "../types";
import { formatDate } from "../utils/formatDate";
import "./GameDetail.css";

export default function GameDetail() {
  const { id } = useParams();
  const [game, setGame] = useState<GameDetailType | null>(null);

  useEffect(() => {
    async function loadGame() {
      const res = await fetch(`http://localhost:3001/games/${id}`);
      const data = await res.json();
      setGame(data);
    }
    loadGame();
  }, [id]);

  if (!game) return <div className="container mt-4">Loading...</div>;

  const platforms = game.platforms ? JSON.parse(game.platforms) : [];

  return (
    <div className="game-detail">
      {/* HERO SECTION */}
      <div
        className="game-hero"
        style={{
          backgroundImage: `url(${game.cover})`,
        }}
      >
        <div className="overlay">
          <h1>{game.title}</h1>
          <p>Released: {formatDate(game.released)}</p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-8">
            <h3>Description</h3>
            <div
              dangerouslySetInnerHTML={{
                __html: game.description || "No description available.",
              }}
            />
          </div>

          <div className="col-md-4">
            <div className="detail-box">
              <p>
                <strong>Rating:</strong> {game.rating ?? "N/A"}
              </p>
              <p>
                <strong>Metacritic:</strong> {game.metacritic ?? "N/A"}
              </p>
              <p>
                <strong>Playtime:</strong> {game.playtime ?? "N/A"} hours
              </p>

              {game.website && (
                <a
                  href={game.website}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-light w-100 mt-2"
                >
                  Official Website
                </a>
              )}
            </div>

            {platforms.length > 0 && (
              <>
                <h5 className="mt-4">Platforms</h5>
                <div>
                  {platforms.map((p: string, i: number) => (
                    <span key={i} className="platform-badge">
                      {p}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* EXTRA IMAGE */}
        {game.backgroundExtra && (
          <div className="mt-5">
            <img
              src={game.backgroundExtra}
              alt="Extra"
              className="img-fluid rounded"
            />
          </div>
        )}
      </div>
    </div>
  );
}
