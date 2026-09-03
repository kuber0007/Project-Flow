import {
  ArrowRight,
  CheckCircle2,
  PlayCircle,
} from "lucide-react";

function DashboardPreview() {
  return (
    <div className="dashboard-preview">

      <div className="dashboard-window">

        <div className="dashboard-window-header">
          <div className="window-dots">
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className="dashboard-content">

          <h3>Project Overview</h3>

          <div className="dashboard-stats">

            <div className="mini-stat">
              <span>Total Projects</span>
              <strong>24</strong>
            </div>

            <div className="mini-stat">
              <span>Tasks Completed</span>
              <strong>68%</strong>
            </div>

            <div className="mini-stat">
              <span>Team Members</span>
              <strong>12</strong>
            </div>

            <div className="mini-stat">
              <span>On Track</span>
              <strong>89%</strong>
            </div>

          </div>

          <div className="dashboard-lower">

            <div className="recent-projects">

              <h4>Recent Projects</h4>

              <div className="project-row">
                <span className="project-icon">
                  □
                </span>

                <div>
                  <strong>Website Redesign</strong>
                  <small>In Progress</small>
                </div>

                <span className="progress-text">
                  75%
                </span>
              </div>

              <div className="project-row">
                <span className="project-icon">
                  □
                </span>

                <div>
                  <strong>Mobile App</strong>
                  <small>In Progress</small>
                </div>

                <span className="progress-text">
                  45%
                </span>
              </div>

              <div className="project-row">
                <span className="project-icon orange">
                  □
                </span>

                <div>
                  <strong>Marketing Campaign</strong>
                  <small>Review</small>
                </div>

                <span className="progress-text">
                  60%
                </span>
              </div>

            </div>

            <div className="task-summary">

              <h4>Task Summary</h4>

              <div className="donut-chart">
                <span>128</span>
              </div>

              <div className="summary-items">
                <span>● Completed 68</span>
                <span>● In Progress 32</span>
                <span>● To Do 28</span>
              </div>

            </div>

          </div>
        </div>
      </div>

      <div
        className="hero-decoration hero-circle-one"
        aria-hidden="true"
      />

      <div
        className="hero-decoration hero-circle-two"
        aria-hidden="true"
      />

    </div>
  );
}

function Hero() {
  return (
    <section className="hero-section">

      <div className="hero-glow hero-glow-one" />
      <div className="hero-glow hero-glow-two" />

      <div className="container">

        <div className="hero-grid">

          <div className="hero-content">

            <div className="hero-label">
              Organize
              <span>•</span>
              Collaborate
              <span>•</span>
              Deliver
            </div>

            <h1>
              Manage Projects
              <span>Like a Pro</span>
            </h1>

            <p>
              A complete project management solution for teams.
              Track tasks, manage members, and deliver projects
              on time.
            </p>

            <div className="hero-actions">

              <a
                href="/signup"
                className="primary-button"
              >
                Get Started Free
                <ArrowRight size={18} />
              </a>

              <a
                href="#demo"
                className="secondary-button"
              >
                <PlayCircle size={18} />
                Watch Demo
              </a>

            </div>

            <div className="hero-benefits">

              <div>
                <CheckCircle2 size={18} />
                <span>Free forever</span>
              </div>

              <div>
                <CheckCircle2 size={18} />
                <span>No credit card</span>
              </div>

              <div>
                <CheckCircle2 size={18} />
                <span>Easy setup</span>
              </div>

            </div>

          </div>

          <DashboardPreview />

        </div>

      </div>
    </section>
  );
}

export default Hero;