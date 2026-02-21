import { useEffect, useState } from "react";
import type { BacklogEntry } from "../types";
import BacklogCard from "../components/BacklogCard";
import "./BacklogList.css";

export default function MyBacklog() {
  const [entries, setEntries] = useState<BacklogEntry[]>([]);

  async function loadBacklog() {
    try {
      const res = await fetch("http://localhost:3001/backlog/1"); //endpoint for id = 1 for user
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
    <div className="container mt-3 backlog-container">
      <h2 className="mb-4">My Backlog</h2>

      {entries.length === 0 ? (
        <p>No games in backlog yet.</p>
      ) : (
        <div className="row">
          {entries.map((entry) => (
            <div key={entry.id} className="col-lg-4 col-md-6 col-sm-12 mb-4">
              <BacklogCard entry={entry} onRemove={remove} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
