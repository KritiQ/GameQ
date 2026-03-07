import { useEffect, useState } from "react";
import type { BacklogEntry } from "../types";
import BacklogCard from "../components/BacklogCard";
import { useAuth } from "../context/AuthContext";
import "./BacklogList.css";

export default function MyBacklog() {
  const [entries, setEntries] = useState<BacklogEntry[]>([]);
  const { token } = useAuth();

  async function changeStatus(id: number, status: string) {
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:3001/backlog/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update");

      loadBacklog();
    } catch (err) {
      console.error(err);
    }
  }

  async function loadBacklog() {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:3001/backlog", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setEntries(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function remove(id: number) {
    if (!token) return;
    await fetch(`http://localhost:3001/backlog/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    loadBacklog();
  }

  useEffect(() => {
    loadBacklog();
  }, [token]);

  return (
    <div className="games-list-container">
      <div className="page-section">
        <div className="container mt-3 backlog-container">
          <h2 className="mb-4">Backlog</h2>

          {entries.length === 0 ? (
            <p>No games in backlog yet.</p>
          ) : (
            <div className="row">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="col-lg-4 col-md-6 col-sm-12 mb-4"
                >
                  <BacklogCard
                    entry={entry}
                    onRemove={remove}
                    onStatusChange={changeStatus}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
