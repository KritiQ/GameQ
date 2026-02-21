import { useEffect, useState } from "react";
import type { Game } from "../types";
import { getDefaultGames } from "../api/games";
import GameCard from "../components/GameCard";
import "./GamesList.css";

export default function GamesList() {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [search, setSearch] = useState("");
  const [backlogRawgIds, setBacklogRawgIds] = useState<number[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/backlog/1")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load backlog");
        return res.json();
      })
      .then((data: any[]) =>
        setBacklogRawgIds(data.map((entry) => entry.game.rawgId)),
      )
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    getDefaultGames().then((data) => {
      setGames(data);
      setFilteredGames(data);
    });
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    const filtered = games.filter((g) =>
      g.title.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredGames(filtered);
  };

  async function addToBacklog(rawgId: number) {
    const game = games.find((g) => g.id === rawgId);
    if (!game) return;

    const payload = {
      userId: 1,
      rawgId: Number(rawgId),
      title: game.title?.trim() || "Untitled",
      cover: game.cover || null,
      rating: game.rating != null ? Number(game.rating) : null,
      released: game.released || null,
      status: "planned",
    };

    try {
      const res = await fetch("http://localhost:3001/backlog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Failed to add (${res.status})`);

      setBacklogRawgIds((prev) => [...prev, rawgId]);
      setMessage(`${game.title} added!`);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage("Error adding to backlog");
    }
  }

  return (
    <div className="games-list-container">
      <div className="container mt-3">
        {/* Title */}
        <h2 className="mb-3">Games</h2>

        {/* Search bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="What do you want to play next?"
            value={search}
            onChange={handleSearch}
            className="form-control"
          />
        </div>

        {/* Cards grid */}
        <div className="row">
          {filteredGames.map((game) => (
            <div className="col-lg-4 col-md-6 col-sm-12 mb-4" key={game.id}>
              <GameCard
                game={game}
                inBacklog={backlogRawgIds.includes(game.id)}
                onAdd={addToBacklog}
              />
            </div>
          ))}
        </div>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}
