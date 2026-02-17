import { useEffect, useState } from "react";

type Game = {
  id: number;
  name: string;
  genre: string;
  year: number;
};

export default function GamesList() {
  const [games, setGames] = useState<Game[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/games")
      .then((res) => res.json())
      .then((data) => setGames(data));
  }, [search]);

  return (
    <div>
      <h2>Games</h2>

      <input
        placeholder="Search game..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul>
        {games.map((game) => (
          <li key={game.id}>
            <b>{game.name}</b> ({game.year}) — {game.genre}
          </li>
        ))}
      </ul>
    </div>
  );
}
