import { useEffect, useState } from "react";

type Game = {
  id: number;
  title: string;
  genre: string;
  year: number;
};

export default function GamesList() {
  const [games, setGames] = useState<Game[]>([]);
  const [search, setSearch] = useState("");
  const [backlogIds, setBacklogIds] = useState<number[]>([]);
  const [message, setMessage] = useState("");

  // backlog
  useEffect(() => {
    fetch("http://localhost:3001/backlog")
      .then((res) => res.json())
      .then((data) => {
        const ids = data.map((entry: any) => entry.gameId);
        setBacklogIds(ids);
      });
  }, []);
  // games
  useEffect(() => {
    const url = search
      ? `http://localhost:3001/games?search=${search}`
      : `http://localhost:3001/games`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => setGames(data));
  }, [search]);

  async function addToBacklog(gameId: number) {
    const game = games.find((g) => g.id === gameId);
    if (!game) return;

    await fetch("http://localhost:3001/backlog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameId,
        status: "planned",
      }),
    });

    setBacklogIds((prev) => [...prev, gameId]);
    setMessage(`${game.title} was added to the backlog!`);
    setTimeout(() => setMessage(""), 3000); //dissappear after 3 sec
  }

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
            <b>{game.title}</b> ({game.year}) — {game.genre}{" "}
            {!backlogIds.includes(game.id) && (
              <button onClick={() => addToBacklog(game.id)}>
                Add to backlog
              </button>
            )}
          </li>
        ))}
      </ul>

      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
}
