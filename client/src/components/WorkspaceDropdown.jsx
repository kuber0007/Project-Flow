import { useState } from "react";
import {
  BriefcaseBusiness,
  Check,
  ChevronDown,
  Plus,
} from "lucide-react";

import { useNavigate } from "react-router-dom";


const WorkspaceDropdown = ({
  workspaces = [],
  workspace = null,
  onChange,
  disabled = false,
}) => {

  const navigate =
    useNavigate();

  const [
    open,
    setOpen,
  ] = useState(false);


  const handleChange = (
    selectedWorkspace
  ) => {

    if (
      !selectedWorkspace?._id
    ) {
      return;
    }

    localStorage.setItem(
      "selectedWorkspaceId",
      selectedWorkspace._id
    );

    onChange?.(
      selectedWorkspace
    );

    setOpen(false);
  };


  return (
    <div className="workspace-selector">

      <button
        type="button"
        className="workspace-selector-button"
        onClick={() =>
          setOpen(
            (previous) =>
              !previous
          )
        }
        disabled={
          disabled ||
          workspaces.length === 0
        }
      >

        <span className="workspace-selector-icon">

          <BriefcaseBusiness
            size={16}
            strokeWidth={1.8}
          />

        </span>


        <span className="workspace-selector-content">

          <small>
            WORKSPACE
          </small>

          <strong>
            {workspace?.name ||
              "No workspace"}
          </strong>

        </span>


        <span className="workspace-selector-arrow">

          <ChevronDown
            size={15}
            strokeWidth={1.8}
          />

        </span>

      </button>


      {open &&
        workspaces.length > 0 && (

          <div className="workspace-dropdown">

            <div className="workspace-dropdown-header">
              Select workspace
            </div>


            {workspaces.map(
              (item) => {

                if (!item?._id) {
                  return null;
                }

                const selected =
                  String(
                    workspace?._id
                  ) ===
                  String(
                    item._id
                  );


                return (
                  <button
                    key={item._id}
                    type="button"
                    className={`workspace-dropdown-item ${
                      selected
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleChange(
                        item
                      )
                    }
                  >

                    <span className="workspace-dropdown-icon">

                      {item?.name
                        ?.charAt(0)
                        ?.toUpperCase() ||
                        "W"}

                    </span>


                    <span className="workspace-dropdown-info">

                      <strong>
                        {item?.name ||
                          "Unnamed workspace"}
                      </strong>

                      <small>
                        {item?.role ||
                          "MEMBER"}
                      </small>

                    </span>


                    {selected && (

                      <span className="workspace-dropdown-check">

                        <Check
                          size={16}
                          strokeWidth={2}
                        />

                      </span>

                    )}

                  </button>
                );
              }
            )}


            <div className="workspace-dropdown-divider" />


            <button
              type="button"
              className="workspace-dropdown-item"
              onClick={() =>
                navigate(
                  "/workspaces/new"
                )
              }
            >

              <span className="workspace-dropdown-icon">

                <Plus
                  size={16}
                  strokeWidth={1.9}
                />

              </span>


              <span className="workspace-dropdown-info">

                <strong>
                  Create new workspace
                </strong>

                <small>
                  Start a new workspace
                </small>

              </span>

            </button>

          </div>

        )}

    </div>
  );
};


export default WorkspaceDropdown;