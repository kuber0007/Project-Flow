import { useState } from "react";
import { Menu, Sun, X } from "lucide-react";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">

        <a
          href="/"
          className="brand"
          aria-label="ProjectFlow home"
          onClick={closeMenu}
        >
          <span className="brand-icon">
            ✓
          </span>

          <span className="brand-name">
            Project<span>Flow</span>
          </span>
        </a>

        {/* Desktop navigation */}
        <nav
          className="desktop-nav"
          aria-label="Main navigation"
        >
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        {/* Desktop actions */}
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

        {/* Mobile burger */}
        <button
          type="button"
          className="mobile-menu-button"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((previous) => !previous)}
        >
          {isMenuOpen ? (
            <X size={21} />
          ) : (
            <Menu size={21} />
          )}
        </button>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="mobile-nav-menu">

            <a href="#features" onClick={closeMenu}>
              Features
            </a>

            <a href="#pricing" onClick={closeMenu}>
              Pricing
            </a>

            <a href="#about" onClick={closeMenu}>
              About
            </a>

            <a href="#contact" onClick={closeMenu}>
              Contact
            </a>

            <div className="mobile-nav-divider" />

            <a
              href="/login"
              className="mobile-nav-login"
              onClick={closeMenu}
            >
              Login
            </a>

            <a
              href="/signup"
              className="mobile-nav-signup"
              onClick={closeMenu}
            >
              Sign Up
            </a>

          </div>
        )}

      </div>
    </header>
  );
}

export default Navbar;