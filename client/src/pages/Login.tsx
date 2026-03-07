import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      login(data.token, data.user);
      navigate("/games");
    } catch {
      setError("Server error");
    }
  };

  return (
    <div className="login-container mt-5">
      <h2 className="login-title mb-4">Login</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          className="form-control login-input mb-3"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="form-control login-input mb-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="btn-login w-100">Login</button>
      </form>

      <p className="login-register mt-3">
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
