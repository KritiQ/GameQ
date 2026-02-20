import { useEffect, useState } from "react";
import type { BacklogEntry } from "../types";

export default function MyBacklog() {
  const [entries, setEntries] = useState<BacklogEntry[]>([]);

  async function loadBacklog() {
    try {
      const res = await fetch("http://localhost:3001/backlog/1"); // endpoint /backlog/1 or /backlog/)
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setEntries(data);
    } catch (err) {
      console.error(err);
    }
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

      {entries.length === 0 ? (
        <p>No games in backlog yet.</p>
      ) : (
        <div className="backlog-grid">
          {" "}
          {/* games-grid */}
          {entries.map((entry) => (
            <div key={entry.id} className="backlog-card">
              {entry.game ? (
                <>
                  {entry.game.cover && (
                    <img
                      src={entry.game.cover}
                      alt={entry.game.title}
                      width={100}
                      style={{ objectFit: "cover" }}
                    />
                  )}
                  <h3>{entry.game.title}</h3>
                  <p>Released: {entry.game.released || "N/A"}</p>
                  <p>
                    Rating:{" "}
                    {entry.game.rating ? entry.game.rating.toFixed(1) : "N/A"}
                  </p>
                  <p>
                    Status: <strong>{entry.status}</strong>
                  </p>
                  <p>Added: {new Date(entry.addedAt).toLocaleDateString()}</p>
                </>
              ) : (
                <p>Game not found</p>
              )}
              <button onClick={() => remove(entry.id)}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
