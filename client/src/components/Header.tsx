import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function Header() {
  // Auto-close mobile menu when switching to desktop
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

  return (
    <nav className="navbar navbar-expand-lg main-navbar px-4">
      <div className="container-fluid d-flex align-items-center">
        {/* Logo */}
        <Link className="navbar-brand logo-neon fw-bold fs-3" to="/">
          GameQ
        </Link>

        {/* Mobile right side: account + hamburger */}
        <div className="d-flex ms-auto align-items-center d-lg-none">
          <Link
            className="nav-link fs-4 me-2 text-decoration-none"
            to="/login"
            title="Login / Account"
          >
            <i
              className="bi bi-person-circle fs-3"
              style={{ color: "#c77dff" }}
            ></i>
          </Link>

          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
            aria-controls="mainNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        {/* Desktop and mobile menu links */}
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

            <li className="nav-item">
              <Link className="nav-link" to="/backlog">
                Backlog
              </Link>
            </li>
          </ul>

          {/* Desktop account icon on the right */}
          <div className="ms-auto d-none d-lg-flex align-items-center">
            <Link
              className="nav-link fs-4 text-decoration-none"
              to="/login"
              title="Login / Account"
            >
              <i
                className="bi bi-person-circle fs-3"
                style={{ color: "#c77dff" }}
              ></i>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
