import { Menu, Sun } from "lucide-react";

function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar-inner">

        <a
          href="/"
          className="brand"
          aria-label="ProjectFlow home"
        >
          <span className="brand-icon">
            ✓
          </span>

          <span className="brand-name">
            Project<span>Flow</span>
          </span>
        </a>

        <nav
          className="desktop-nav"
          aria-label="Main navigation"
        >
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="navbar-actions">

          <button
            type="button"
            className="theme-button"
            aria-label="Toggle theme"
          >
            <Sun size={18} />
          </button>

          <a
            href="/login"
            className="login-button"
          >
            Login
          </a>

          <a
            href="/signup"
            className="signup-button"
          >
            Sign Up
          </a>

        </div>

        <button
          type="button"
          className="mobile-menu-button"
          aria-label="Open navigation menu"
        >
          <Menu size={21} />
        </button>

      </div>
    </header>
  );
}

export default Navbar;