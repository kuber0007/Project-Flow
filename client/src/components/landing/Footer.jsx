function Footer() {
  return (
    <footer
      id="contact"
      className="site-footer"
    >
      <div className="container">

        <div className="footer-divider" />

        <div className="footer-main">

          {/* Brand */}
          <a
            href="/"
            className="footer-brand"
            aria-label="ProjectFlow home"
          >
            <span className="footer-brand-icon">
              ✓
            </span>

            <span className="footer-brand-name">
              Project<span>Flow</span>
            </span>
          </a>


          {/* Socials */}
          <div className="footer-right">

            <div className="footer-socials">

              {/* LinkedIn */}
              <a
                href="#"
                className="footer-social"
                aria-label="ProjectFlow LinkedIn"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M6.5 8.5H3V21h3.5V8.5ZM4.75 3A2.05 2.05 0 1 0 4.75 7.1 2.05 2.05 0 0 0 4.75 3ZM21 13.8c0-3.75-2-5.5-4.7-5.5-2.15 0-3.1 1.18-3.65 2v-1.8H9.2V21h3.45v-6.18c0-1.63.3-3.2 2.32-3.2 1.99 0 2.02 1.86 2.02 3.3V21H21v-7.2Z" />
                </svg>
              </a>


              {/* GitHub */}
              <a
                href="#"
                className="footer-social"
                aria-label="ProjectFlow GitHub"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.77-1.34-1.77-1.09-.75.08-.74.08-.74 1.2.09 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.62-2.81 5.65-5.49 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .5Z" />
                </svg>
              </a>


              <span className="footer-made-with">
                Made with
                <span> ♥ </span>
                for teams
              </span>

            </div>

          </div>

        </div>


        {/* Bottom */}
        <div className="footer-bottom">

          <p>
            © {new Date().getFullYear()} ProjectFlow.
            All rights reserved.
          </p>

          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>

        </div>

      </div>
    </footer>
  );
}

export default Footer;