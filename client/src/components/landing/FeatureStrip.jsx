import {
  BarChart3,
  CheckSquare,
  FolderKanban,
  UsersRound,
} from "lucide-react";

const features = [
  {
    icon: FolderKanban,
    title: "Project Management",
    description:
      "Create and manage projects with deadlines and status tracking.",
    type: "blue",
  },
  {
    icon: CheckSquare,
    title: "Task Tracking",
    description:
      "Assign tasks, set priorities, and track progress in real-time.",
    type: "green",
  },
  {
    icon: UsersRound,
    title: "Team Collaboration",
    description:
      "Manage your team, assign roles, and collaborate efficiently.",
    type: "purple",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description:
      "Get insights on project progress and team performance.",
    type: "orange",
  },
];

function FeatureStrip() {
  return (
    <section
      id="features"
      className="feature-section"
    >
      <div className="container">

        <div className="feature-strip">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="feature-item"
              >
                <div
                  className={`feature-icon ${feature.type}`}
                >
                  <Icon size={23} />
                </div>

                <div>
                  <h2>{feature.title}</h2>

                  <p>{feature.description}</p>
                </div>
              </article>
            );
          })}

        </div>

      </div>
    </section>
  );
}

export default FeatureStrip;