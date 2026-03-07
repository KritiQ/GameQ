import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const collapse = document.getElementById("mainNav");
      if (!collapse) return;

      if (window.innerWidth >= 992) {
        collapse.classList.remove("show");
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg main-navbar">
      <div className="container" style={{ maxWidth: "1220px" }}>
        <div className="container-fluid d-flex align-items-center">
          <Link className="navbar-brand logo-neon fw-bold fs-3" to="/">
            GameQ
          </Link>

          {/* Mobile right side */}
          <div className="d-flex ms-auto align-items-center d-lg-none">
            {user ? (
              <button
                className="btn border-0 account-icon"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right fs-3"></i>
              </button>
            ) : (
              <Link
                className="nav-link text-decoration-none account-icon"
                to="/login"
              >
                <i className="bi bi-person-circle fs-3"></i>
              </Link>
            )}

            <button
              className="navbar-toggler border-0"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#mainNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

          {/* Menu */}
          <div
            className="collapse navbar-collapse justify-content-center"
            id="mainNav"
          >
            <ul className="navbar-nav fs-5">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/games">
                  Games
                </Link>
              </li>
              {user && (
                <li className="nav-item">
                  <Link className="nav-link" to="/backlog">
                    Backlog
                  </Link>
                </li>
              )}
            </ul>

            {/* Desktop right side */}
            <div className="ms-auto d-flex align-items-center">
              {user ? (
                <div className="dropdown">
                  <button
                    className="btn border-0 account-icon"
                    data-bs-toggle="dropdown"
                  >
                    <i className="bi bi-person-circle fs-2"></i>
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end">
                    {/* Future items */}
                    <li>
                      <Link className="dropdown-item" to="/">
                        Settings
                      </Link>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
