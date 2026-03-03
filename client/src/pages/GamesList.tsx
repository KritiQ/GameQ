import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Game } from "../types";
import { getDefaultGames } from "../api/games";
import GameCard from "../components/GameCard";
import "./GamesList.css";

export default function GamesList() {
  const [games, setGames] = useState<Game[]>([]);
  const [backlogRawgIds, setBacklogRawgIds] = useState<number[]>([]);
  const [message, setMessage] = useState("");

  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";
  const pageSize = 24;

  /* Load backlog IDs */
  useEffect(() => {
    fetch("http://localhost:3001/backlog/1")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load backlog");
        return res.json();
      })
      .then((data: any[]) =>
        setBacklogRawgIds(data.map((entry) => entry.game.rawgId)),
      )
      .catch(console.error);
  }, []);

  /* Load games when page changes */
  useEffect(() => {
    let isMounted = true;

    async function loadGames() {
      try {
        const data = await getDefaultGames(page, searchQuery);

        if (!isMounted) return;

        setGames(data.results);
        setTotal(data.total);

        if (page !== 1) {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadGames();

    return () => {
      isMounted = false;
    };
  }, [page, searchQuery]);
  /* Pagination handlers */
  const changePage = (newPage: number) => {
    setSearchParams({
      page: String(newPage),
      ...(searchQuery ? { search: searchQuery } : {}),
    });
  };

  /* Search */
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setSearchParams({
      page: "1",
      ...(value ? { search: value } : {}),
    });
  };

  /* Add backlog */
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

      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage("Error adding to backlog");
    }
  }

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="games-list-container">
      <div className="page-section">
        <div className="container mt-3">
          <h2 className="mb-4">Games</h2>

          <div className="mb-3">
            <input
              type="text"
              placeholder="What do you want to play next?"
              value={searchQuery}
              onChange={handleSearch}
              className="form-control"
            />
          </div>

          <div className="row">
            {games.map((game) => (
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

        <div className="d-flex justify-content-center align-items-center mt-4 gap-3">
          <button
            className="btn btn-outline-light"
            disabled={page === 1}
            onClick={() => changePage(page - 1)}
          >
            Prev
          </button>

          <span>
            Page {page} of {totalPages || 1}
          </span>

          <button
            className="btn btn-outline-light"
            disabled={page === totalPages}
            onClick={() => changePage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
