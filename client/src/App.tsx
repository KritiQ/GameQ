import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import GamesList from "./pages/GamesList";
import BacklogList from "./pages/BacklogList";
import Home from "./pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Header />

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<GamesList />} />
          <Route path="/backlog" element={<BacklogList />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
