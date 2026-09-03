import {
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
  UsersRound,
} from "lucide-react";

function PlatformPreview() {
  return (
    <div
      className="platform-visual"
      aria-hidden="true"
    >
      <div className="platform-window">

        <div className="platform-window-top">
          <span />
          <span />
          <span />
        </div>

        <div className="platform-window-body">

          <div className="platform-window-title">
            <LayoutDashboard size={15} />
            Project Workspace
          </div>

          <div className="platform-progress">

            <div>
              <span />
              <span />
            </div>

            <div>
              <span />
              <span />
            </div>

            <div>
              <span />
              <span />
            </div>

          </div>

          <div className="platform-columns">

            <div>
              <small>Planning</small>
              <i />
              <i />
              <i />
            </div>

            <div>
              <small>Active</small>
              <i />
              <i />
              <i />
            </div>

            <div>
              <small>Complete</small>
              <i />
              <i />
              <i />
            </div>

          </div>

        </div>
      </div>

      <div className="platform-orb orb-one" />
      <div className="platform-orb orb-two" />
      <div className="platform-orb orb-three" />

      <div className="platform-user user-one">
        <div />
        <span />
      </div>

      <div className="platform-user user-two">
        <div />
        <span />
      </div>

    </div>
  );
}

const platformFeatures = [
  {
    icon: CheckCircle2,
    title: "One organized workspace",
    description:
      "Keep projects, tasks, deadlines, and progress together.",
  },
  {
    icon: UsersRound,
    title: "Better collaboration",
    description:
      "Give every team member the right place to contribute.",
  },
];

function PlatformSection() {
  return (
    <section className="platform-section">
      <div className="container">

        <div className="platform-grid">

          <PlatformPreview />

          <div className="platform-content">

            <p className="section-label">
              EVERYTHING WORKS TOGETHER
            </p>

            <h2>
              Turn scattered work
              <span>into one clear workflow.</span>
            </h2>

            <p className="platform-description">
              From the first idea to the final task, ProjectFlow
              gives your team a clear view of what needs to happen,
              who is responsible, and how the project is progressing.
            </p>

            <div className="platform-features">

              {platformFeatures.map((feature) => {
                const Icon = feature.icon;

                return (
                  <article
                    key={feature.title}
                    className="platform-feature"
                  >
                    <div className="platform-feature-icon">
                      <Icon size={19} />
                    </div>

                    <div>
                      <h3>{feature.title}</h3>

                      <p>{feature.description}</p>
                    </div>
                  </article>
                );
              })}

            </div>

            <a
              href="/signup"
              className="platform-cta"
            >
              Start for free
              <ArrowRight size={17} />
            </a>

          </div>

        </div>

      </div>
    </section>
  );
}

export default PlatformSection;