import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GamesList from "./pages/GamesList";
import BacklogList from "./pages/BacklogList";
import GameDetail from "./pages/GameDetail";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const { user } = useAuth();
  return (
    <BrowserRouter>
      <Header />

      <div className="container mt-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/games"
            element={
              <ProtectedRoute>
                <GamesList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/backlog"
            element={user ? <BacklogList /> : <Navigate to="/login" />}
          />

          <Route
            path="/game/:id"
            element={
              <ProtectedRoute>
                <GameDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
