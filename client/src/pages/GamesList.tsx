import { useEffect, useState } from "react";
import type { Game } from "../types";
import { getDefaultGames } from "../api/games";
import GameCard from "../components/GameCard";

export default function GamesList() {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [search, setSearch] = useState("");
  const [backlogRawgIds, setBacklogRawgIds] = useState<number[]>([]);
  const [message, setMessage] = useState("");

  // load RAWG IDs of games already in backlog
  useEffect(() => {
    fetch("http://localhost:3001/backlog/1") // endpoint /backlog/:userId
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load backlog");
        return res.json();
      })
      .then((data: any[]) =>
        setBacklogRawgIds(data.map((entry) => entry.game.rawgId)),
      )
      .catch((err) => console.error(err));
  }, []);

  // load default games
  useEffect(() => {
    getDefaultGames().then((data) => {
      setGames(data);
      setFilteredGames(data);
    });
  }, []);

  // search locally
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    const filtered = games.filter((g) =>
      g.title.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredGames(filtered);
  };

  // add to backlog
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

    console.log("Sending to /backlog:", payload);

    try {
      const res = await fetch("http://localhost:3001/backlog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Backend error response:", res.status, errorText);
        throw new Error(`Failed to add (${res.status})`);
      }
      setBacklogRawgIds((prev) => [...prev, rawgId]);
      setMessage(`${game.title} added!`);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("addToBacklog error:", err);
      setMessage("Error adding to backlog");
    }
  }

  return (
    <div>
      <h2>Games</h2>
      <input
        placeholder="Search game..."
        value={search}
        onChange={handleSearch}
      />

      <div className="games-grid">
        {filteredGames.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            inBacklog={backlogRawgIds.includes(game.id)}
            onAdd={addToBacklog}
          />
        ))}
      </div>

      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
}
