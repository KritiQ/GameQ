import { Link } from "react-router-dom";

export default function Header() {
  return (
    <>
      {/* NAVBAR PANEL */}
      <nav className="navbar navbar-expand-lg main-navbar px-4">
        {/* Hamburger menu for mobile*/}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          {/* TOP BAR (GAMEQ //TODO: with logo) */}
          <div className="text-center py-3">
            <Link
              className="logo-neon text-decoration-none fw-bold display-6"
              to="/"
            >
              GameQ
            </Link>
          </div>
          <div className="d-flex w-100 align-items-center">
            {/* LEFT SIDE (Navigator to switch pages) */}
            <ul className="navbar-nav fs-4">
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

              <li className="nav-item">
                <Link className="nav-link" to="/backlog">
                  Backlog
                </Link>
              </li>
            </ul>

            {/* RIGHT SIDE (account //TODO: IN THE FUTURE) */}
            <ul className="navbar-nav ms-auto fs-4">
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
