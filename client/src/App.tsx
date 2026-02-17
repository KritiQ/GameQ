import { useState } from "react";
import GamesList from "./components/GamesList";
import BacklogList from "./components/BacklogList";

function App() {
  const [page, setPage] = useState<"games" | "backlog">("games");
  return (
    <div>
      <h1>GameQ</h1>

      <button onClick={() => setPage("games")}>Games</button>
      <button onClick={() => setPage("backlog")}>My Backlog</button>

      {page === "games" && <GamesList />}
      {page === "backlog" && <BacklogList />}
    </div>
  );
}

export default App;
