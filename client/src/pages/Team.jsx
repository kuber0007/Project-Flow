import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import {
  getWorkspace,
  getWorkspaceMembers,
  updateMemberRole,
  removeWorkspaceMember,
  leaveWorkspace,
} from "../services/workspaceService";

import "../styles/team.css";


const Team = () => {
  const navigate = useNavigate();

  const token =
    localStorage.getItem("accessToken");

  const selectedWorkspaceId =
    localStorage.getItem(
      "selectedWorkspaceId"
    );

  const [workspace, setWorkspace] =
    useState(null);

  const [members, setMembers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState("");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [search, setSearch] =
    useState("");


  /* =========================================================
     CURRENT USER
  ========================================================= */

  const getCurrentUser = () => {
    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(
        storedUser
      );
    } catch {
      return null;
    }
  };

  const currentUser =
    getCurrentUser();


  const currentUserId =
    currentUser?._id ||
    currentUser?.id ||
    "";


  /* =========================================================
     LOAD DATA
  ========================================================= */

  const loadData = async () => {
    if (!selectedWorkspaceId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [
        workspaceResult,
        membersResult,
      ] = await Promise.all([
        getWorkspace(
          selectedWorkspaceId
        ),
        getWorkspaceMembers(
          selectedWorkspaceId
        ),
      ]);


      const workspaceData =
        workspaceResult?.workspace ||
        workspaceResult;

      const memberList =
        Array.isArray(membersResult)
          ? membersResult
          : Array.isArray(
              membersResult?.members
            )
            ? membersResult.members
            : [];


      setWorkspace(
        workspaceData
      );

      setMembers(
        memberList
      );

    } catch (err) {

      console.error(
        "Failed to load team:",
        err
      );

      setError(
        err.message ||
        "Failed to load workspace members"
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadData();
  }, [selectedWorkspaceId]);


  /* =========================================================
     CURRENT MEMBER
  ========================================================= */

  const currentMember =
    useMemo(() => {

      return members.find(
        (member) => {

          const memberUserId =
            typeof member.user ===
            "string"
              ? member.user
              : member.user?._id;

          return (
            memberUserId ===
            currentUserId
          );
        }
      );

    }, [
      members,
      currentUserId,
    ]);


  const currentRole =
    currentMember?.role ||
    "MEMBER";


  /* =========================================================
     FILTER MEMBERS
  ========================================================= */

  const filteredMembers =
    useMemo(() => {

      const value =
        search
          .trim()
          .toLowerCase();

      if (!value) {
        return members;
      }

      return members.filter(
        (member) => {

          const user =
            typeof member.user ===
            "object"
              ? member.user
              : null;

          const name =
            user?.name ||
            "";

          const email =
            user?.email ||
            "";

          const role =
            member?.role ||
            "";

          return (
            name
              .toLowerCase()
              .includes(value) ||
            email
              .toLowerCase()
              .includes(value) ||
            role
              .toLowerCase()
              .includes(value)
          );
        }
      );

    }, [
      members,
      search,
    ]);


  /* =========================================================
     SUCCESS MESSAGE
  ========================================================= */

  const showSuccess = (
    message
  ) => {

    setSuccess(
      message
    );

    setTimeout(() => {
      setSuccess("");
    }, 2500);
  };


  /* =========================================================
     CHANGE ROLE
  ========================================================= */

  const handleRoleChange = async (
    member,
    newRole
  ) => {

    const memberUserId =
      typeof member.user ===
      "string"
        ? member.user
        : member.user?._id;

    if (!memberUserId) {
      return;
    }

    try {

      setActionLoading(
        `role-${memberUserId}`
      );

      setError("");

      await updateMemberRole(
        selectedWorkspaceId,
        memberUserId,
        newRole
      );

      setMembers(
        (previous) =>
          previous.map(
            (item) => {

              const itemUserId =
                typeof item.user ===
                "string"
                  ? item.user
                  : item.user?._id;

              if (
                itemUserId !==
                memberUserId
              ) {
                return item;
              }

              return {
                ...item,
                role: newRole,
              };
            }
          )
      );

      showSuccess(
        "Member role updated successfully."
      );

    } catch (err) {

      console.error(
        "Failed to update member role:",
        err
      );

      setError(
        err.message ||
        "Failed to update member role"
      );

    } finally {

      setActionLoading("");
    }
  };


  /* =========================================================
     REMOVE MEMBER
  ========================================================= */

  const handleRemoveMember = async (
    member
  ) => {

    const memberUserId =
      typeof member.user ===
      "string"
        ? member.user
        : member.user?._id;

    const userName =
      member.user?.name ||
      member.user?.email ||
      "this member";

    if (!memberUserId) {
      return;
    }

    const confirmed =
      window.confirm(
        `Remove ${userName} from this workspace?`
      );

    if (!confirmed) {
      return;
    }

    try {

      setActionLoading(
        `remove-${memberUserId}`
      );

      setError("");

      await removeWorkspaceMember(
        selectedWorkspaceId,
        memberUserId
      );

      setMembers(
        (previous) =>
          previous.filter(
            (item) => {

              const itemUserId =
                typeof item.user ===
                "string"
                  ? item.user
                  : item.user?._id;

              return (
                itemUserId !==
                memberUserId
              );
            }
          )
      );

      showSuccess(
        "Member removed successfully."
      );

    } catch (err) {

      console.error(
        "Failed to remove member:",
        err
      );

      setError(
        err.message ||
        "Failed to remove member"
      );

    } finally {

      setActionLoading("");
    }
  };


  /* =========================================================
     LEAVE WORKSPACE
  ========================================================= */

  const handleLeaveWorkspace =
    async () => {

      const confirmed =
        window.confirm(
          `Are you sure you want to leave "${workspace?.name || "this workspace"}"?`
        );

      if (!confirmed) {
        return;
      }

      try {

        setActionLoading(
          "leave"
        );

        setError("");

        await leaveWorkspace(
          selectedWorkspaceId
        );

        localStorage.removeItem(
          "selectedWorkspaceId"
        );

        navigate(
          "/dashboard",
          {
            replace: true,
          }
        );

      } catch (err) {

        console.error(
          "Failed to leave workspace:",
          err
        );

        setError(
          err.message ||
          "Failed to leave workspace"
        );

        setActionLoading("");
      }
    };


  /* =========================================================
     ROLE HELPERS
  ========================================================= */

  const getRoleClass = (
    role
  ) => {

    switch (role) {

      case "OWNER":
        return "team-role-owner";

      case "ADMIN":
        return "team-role-admin";

      case "VIEWER":
        return "team-role-viewer";

      default:
        return "team-role-member";
    }
  };


  const canManageMembers =
    ["OWNER", "ADMIN"].includes(
      currentRole
    );


  const canChangeRole = (
    member
  ) => {

    if (!canManageMembers) {
      return false;
    }

    if (member.role === "OWNER") {
      return false;
    }

    /*
     * Keep the frontend aligned with
     * the backend's current permission
     * model.
     */

    if (
      currentRole === "ADMIN" &&
      member.role === "ADMIN"
    ) {
      return false;
    }

    return true;
  };


  const canRemoveMember = (
    member
  ) => {

    if (!canManageMembers) {
      return false;
    }

    if (member.role === "OWNER") {
      return false;
    }

    if (
      currentRole === "ADMIN" &&
      member.role === "ADMIN"
    ) {
      return false;
    }

    return true;
  };


  /* =========================================================
     NO TOKEN
  ========================================================= */

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  /* =========================================================
     NO WORKSPACE
  ========================================================= */

  if (
    !loading &&
    !selectedWorkspaceId
  ) {

    return (
      <div className="team-page">

        <main className="team-main">

          <div className="team-empty-page">

            <h2>
              No workspace selected
            </h2>

            <p>
              Select a workspace from
              the dashboard first.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/dashboard"
                )
              }
            >
              ← Back to Dashboard
            </button>

          </div>

        </main>

      </div>
    );
  }


  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {

    return (
      <div className="team-loading">

        <div className="team-loading-card">

          <div className="team-spinner"></div>

          <h2>
            Loading team...
          </h2>

          <p>
            Getting your workspace
            members ready.
          </p>

        </div>

      </div>
    );
  }


  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div className="team-page">


      {/* =====================================================
          SIDEBAR (matches Projects page)
      ===================================================== */}

      <aside className="projects-sidebar">

        {/* BRAND */}

        <Link
          to="/dashboard"
          className="dashboard-brand"
        >
          <span className="dashboard-brand-icon">
            ✓
          </span>

          <span>
            Project<span>Flow</span>
          </span>
        </Link>


        {/* NAVIGATION */}

        <nav className="dashboard-nav">

          <Link
            to="/dashboard"
            className="dashboard-nav-item"
          >
            <span>
              ▦
            </span>

            Dashboard
          </Link>


          <Link
            to="/projects"
            className="dashboard-nav-item"
          >
            <span>
              □
            </span>

            Projects
          </Link>


          <Link
            to="/team"
            className="dashboard-nav-item active"
          >
            <span>
              ♧
            </span>

            Team
          </Link>


          <Link
            to="/tasks"
            className="dashboard-nav-item"
          >
            <span>
              ☑
            </span>

            My Tasks
          </Link>

        </nav>


        {/* PROFILE */}

        <div className="projects-sidebar-profile">

          <div className="profile-avatar">
            {currentUser?.name
              ?.charAt(0)
              ?.toUpperCase() ||
              "U"}
          </div>

          <div className="profile-info">

            <strong>
              {currentUser?.name ||
                "User"}
            </strong>

            <span>
              Profile
            </span>

          </div>

        </div>

      </aside>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="team-main">


        {/* TOPBAR */}

        <header className="team-topbar">

          <button
            type="button"
            className="team-back"
            onClick={() =>
              navigate(
                "/dashboard"
              )
            }
          >
            ← Dashboard
          </button>


          <div className="team-user">

            <div className="team-user-avatar">
              {(
                currentUser?.name ||
                "U"
              )
                .charAt(0)
                .toUpperCase()}
            </div>

            <span>
              {currentUser?.name ||
                "User"}
            </span>

          </div>

        </header>


        {/* CONTENT */}

        <section className="team-content">


          {/* HEADER */}

          <div className="team-header">

            <div>

              <span className="team-eyebrow">
                WORKSPACE TEAM
              </span>

              <h1>
                {workspace?.name ||
                  "Workspace"}
              </h1>

              <p>
                Manage members and
                workspace roles.
              </p>

            </div>


            <button
              type="button"
              className="team-dashboard-button"
              onClick={() =>
                navigate(
                  "/dashboard"
                )
              }
            >
              ← Back to Dashboard
            </button>

          </div>


          {/* ERROR */}

          {error && (

            <div className="team-error">
              {error}
            </div>

          )}


          {/* SUCCESS */}

          {success && (

            <div className="team-success">
              {success}
            </div>

          )}


          {/* STATS */}

          <div className="team-stats">

            <div className="team-stat-card">

              <span>
                Total Members
              </span>

              <strong>
                {members.length}
              </strong>

            </div>


            <div className="team-stat-card">

              <span>
                Your Role
              </span>

              <strong>
                {currentRole}
              </strong>

            </div>


            <div className="team-stat-card">

              <span>
                Administrators
              </span>

              <strong>
                {
                  members.filter(
                    (member) =>
                      member.role ===
                      "ADMIN"
                  ).length
                }
              </strong>

            </div>

          </div>


          {/* MEMBER SECTION */}

          <section className="team-section">

            <div className="team-section-header">

              <div>

                <h2>
                  Workspace Members
                </h2>

                <p>
                  Everyone who belongs
                  to this workspace.
                </p>

              </div>


              <div className="team-search">

                <span>
                  ⌕
                </span>

                <input
                  type="text"
                  placeholder="Search members..."
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                />

              </div>

            </div>


            {filteredMembers.length ===
            0 ? (

              <div className="team-empty">

                <div className="team-empty-icon">
                  ♙
                </div>

                <h3>
                  No members found
                </h3>

                <p>
                  Try a different search.
                </p>

              </div>

            ) : (

              <div className="team-member-list">

                {filteredMembers.map(
                  (member) => {

                    const user =
                      typeof member.user ===
                      "object"
                        ? member.user
                        : null;

                    const memberUserId =
                      typeof member.user ===
                      "string"
                        ? member.user
                        : user?._id;

                    const isCurrentUser =
                      memberUserId ===
                      currentUserId;

                    const displayName =
                      user?.name ||
                      user?.email ||
                      "Workspace Member";

                    const initials =
                      displayName
                        .charAt(0)
                        .toUpperCase();

                    const roleChanging =
                      actionLoading ===
                      `role-${memberUserId}`;

                    const removing =
                      actionLoading ===
                      `remove-${memberUserId}`;

                    return (

                      <div
                        key={
                          memberUserId ||
                          member._id
                        }
                        className="team-member-row"
                      >


                        {/* USER */}

                        <div className="team-member-user">

                          <div className="team-member-avatar">

                            {initials}

                          </div>


                          <div className="team-member-info">

                            <div className="team-member-name">

                              <strong>
                                {displayName}
                              </strong>

                              {isCurrentUser && (
                                <span>
                                  You
                                </span>
                              )}

                            </div>


                            {user?.email && (

                              <p>
                                {user.email}
                              </p>

                            )}

                          </div>

                        </div>


                        {/* ROLE */}

                        <div className="team-member-role">

                          {canChangeRole(
                            member
                          ) ? (

                            <select
                              value={
                                member.role ||
                                "MEMBER"
                              }
                              onChange={(
                                event
                              ) =>
                                handleRoleChange(
                                  member,
                                  event.target.value
                                )
                              }
                              disabled={
                                roleChanging ||
                                removing
                              }
                            >

                              <option value="ADMIN">
                                Admin
                              </option>

                              <option value="MEMBER">
                                Member
                              </option>

                              <option value="VIEWER">
                                Viewer
                              </option>

                            </select>

                          ) : (

                            <span
                              className={`team-role ${getRoleClass(
                                member.role
                              )}`}
                            >
                              {member.role}
                            </span>

                          )}

                        </div>


                        {/* ACTION */}

                        <div className="team-member-action">

                          {canRemoveMember(
                            member
                          ) && (

                            <button
                              type="button"
                              className="team-remove-button"
                              onClick={() =>
                                handleRemoveMember(
                                  member
                                )
                              }
                              disabled={
                                removing ||
                                roleChanging
                              }
                            >
                              {removing
                                ? "Removing..."
                                : "Remove"}
                            </button>

                          )}

                        </div>

                      </div>

                    );
                  }
                )}

              </div>

            )}

          </section>


          {/* LEAVE */}

          <section className="team-danger-section">

            <div>

              <span>
                LEAVE WORKSPACE
              </span>

              <h2>
                Leave this workspace
              </h2>

              <p>
                You will lose access to
                this workspace and its
                projects.
              </p>

            </div>


            <button
              type="button"
              className="team-leave-button"
              onClick={
                handleLeaveWorkspace
              }
              disabled={
                currentRole ===
                "OWNER" ||
                actionLoading ===
                "leave"
              }
            >
              {currentRole === "OWNER"
                ? "Transfer ownership first"
                : actionLoading ===
                    "leave"
                  ? "Leaving..."
                  : "Leave Workspace"}
            </button>

          </section>

        </section>

      </main>

    </div>
  );
};


export default Team;