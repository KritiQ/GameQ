import { useEffect, useState } from "react";

type Game = {
  id: number;
  title: string;
  genre: string;
  year: number;
};

type Backlog = {
  id: number;
  status: string;
  addedAt: string;
  game: Game | null;
};

export default function MyBacklog() {
  const [entries, setEntries] = useState<Backlog[]>([]);

  async function loadBacklog() {
    const res = await fetch("http://localhost:3001/backlog");
    const data = await res.json();
    setEntries(data);
  }

  async function remove(id: number) {
    await fetch(`http://localhost:3001/backlog/${id}`, {
      method: "DELETE",
    });

    loadBacklog();
  }

  useEffect(() => {
    loadBacklog();
  }, []);

  return (
    <div>
      <h2>My Backlog</h2>

      <ul>
        {entries.map((entry) => (
          <li key={entry.id}>
            {entry.game
              ? `${entry.game.title} (${entry.game.year}) - ${entry.game.genre}`
              : "Unknown Game"}{" "}
            - {entry.status}{" "}
            <button onClick={() => remove(entry.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
