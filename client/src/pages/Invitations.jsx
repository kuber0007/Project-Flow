import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Mail,
  Check,
  X,
  ArrowLeft,
  Users,
  Clock,
} from "lucide-react";

import {
  getMyWorkspaceInvitations,
  acceptWorkspaceInvitation,
  rejectWorkspaceInvitation,
} from "../services/workspaceService";

import Sidebar from "../components/Sidebar";

import "../styles/invitations.css";

const Invitations = () => {
  const navigate = useNavigate();

  const token =
    localStorage.getItem("accessToken");

  const [invitations, setInvitations] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [actionLoading, setActionLoading] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /* =========================================================
     LOAD INVITATIONS
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadInvitations = async () => {
      try {
        setLoading(true);
        setError("");

        const result =
          await getMyWorkspaceInvitations();

        if (cancelled) {
          return;
        }

        const invitationList =
          Array.isArray(result)
            ? result
            : Array.isArray(
              result?.invitations
            )
              ? result.invitations
              : Array.isArray(
                result?.data
              )
                ? result.data
                : [];

        setInvitations(
          invitationList
        );
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load invitations:",
          err
        );

        setError(
          err?.message ||
          "Failed to load invitations."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadInvitations();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =========================================================
     ACCEPT
  ========================================================= */

  const handleAccept = async (
    invitationId
  ) => {
    try {
      setActionLoading(
        `accept-${invitationId}`
      );

      setError("");
      setSuccess("");

      await acceptWorkspaceInvitation(
        invitationId
      );

      setInvitations(
        (previous) =>
          previous.filter(
            (invitation) =>
              invitation._id !==
              invitationId
          )
      );

      setSuccess(
        "Invitation accepted successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);

    } catch (err) {
      console.error(
        "Failed to accept invitation:",
        err
      );

      setError(
        err.message ||
        "Failed to accept invitation."
      );
    } finally {
      setActionLoading("");
    }
  };

  /* =========================================================
     REJECT
  ========================================================= */

  const handleReject = async (
    invitationId
  ) => {
    try {
      setActionLoading(
        `reject-${invitationId}`
      );

      setError("");
      setSuccess("");

      await rejectWorkspaceInvitation(
        invitationId
      );

      setInvitations(
        (previous) =>
          previous.filter(
            (invitation) =>
              invitation._id !==
              invitationId
          )
      );

      setSuccess(
        "Invitation rejected."
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);

    } catch (err) {
      console.error(
        "Failed to reject invitation:",
        err
      );

      setError(
        err.message ||
        "Failed to reject invitation."
      );
    } finally {
      setActionLoading("");
    }
  };

  /* =========================================================
     AUTH PROTECTION
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
     PAGE
  ========================================================= */

  return (
    <div className="invitations-page">

      <Sidebar
        active="invitations"
        showProjects={false}
      />

      <main className="invitations-main">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="invitations-header">

          <button
            type="button"
            className="invitations-back-button"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <ArrowLeft size={17} />

            Dashboard
          </button>

        </header>

        <section className="invitations-content">

          {/* =================================================
              PAGE TITLE
          ================================================= */}

          <div className="invitations-title">

            <div className="invitations-title-icon">
              <Mail size={24} />
            </div>

            <div>
              <span>
                WORKSPACE
              </span>

              <h1>
                Invitations
              </h1>

              <p>
                Review workspace invitations
                sent to your account.
              </p>
            </div>

          </div>

          {/* =================================================
              SUCCESS
          ================================================= */}

          {success && (
            <div className="invitations-message invitations-success">
              <Check size={17} />

              {success}
            </div>
          )}

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="invitations-message invitations-error">
              <X size={17} />

              {error}
            </div>
          )}

          {/* =================================================
              LOADING
          ================================================= */}

          {loading ? (

            <div className="invitations-loading">

              <div className="invitations-spinner"></div>

              <p>
                Loading invitations...
              </p>

            </div>

          ) : invitations.length === 0 ? (

            /* ===============================================
               EMPTY STATE
            =============================================== */

            <div className="invitations-empty">

              <div className="invitations-empty-icon">
                <Mail size={28} />
              </div>

              <h2>
                No pending invitations
              </h2>

              <p>
                You're all caught up. New
                workspace invitations will
                appear here.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/dashboard")
                }
              >
                Back to Dashboard
              </button>

            </div>

          ) : (

            /* ===============================================
               INVITATION LIST
            =============================================== */

            <div className="invitations-list">

              <div className="invitations-list-header">

                <div>
                  <h2>
                    Pending Invitations
                  </h2>

                  <p>
                    {invitations.length}{" "}
                    {invitations.length === 1
                      ? "invitation"
                      : "invitations"}{" "}
                    waiting for your response.
                  </p>
                </div>

                <span className="invitations-count">
                  {invitations.length}
                </span>

              </div>

              {invitations.map(
                (invitation) => {

                  const workspace =
                    invitation.workspace;

                  const invitedBy =
                    invitation.invitedBy;

                  const accepting =
                    actionLoading ===
                    `accept-${invitation._id}`;

                  const rejecting =
                    actionLoading ===
                    `reject-${invitation._id}`;

                  const busy =
                    accepting ||
                    rejecting;

                  return (

                    <article
                      key={
                        invitation._id
                      }
                      className="invitation-card"
                    >

                      {/* CARD ICON */}

                      <div className="invitation-card-icon">
                        <Users size={21} />
                      </div>

                      {/* CARD CONTENT */}

                      <div className="invitation-card-content">

                        <div className="invitation-card-heading">

                          <div>

                            <h3>
                              {workspace?.name ||
                                "Workspace"}
                            </h3>

                            <span className="invitation-pending-badge">
                              Pending
                            </span>

                          </div>

                        </div>

                        <p className="invitation-description">

                          {workspace?.description ||
                            "You've been invited to join this workspace."}

                        </p>

                        <div className="invitation-meta">

                          <span>
                            Invited by{" "}
                            <strong>
                              {invitedBy?.name ||
                                invitedBy?.email ||
                                "Workspace admin"}
                            </strong>
                          </span>

                          <span className="invitation-meta-divider">
                            •
                          </span>

                          <span>
                            Role:{" "}
                            <strong>
                              {invitation.role ||
                                "MEMBER"}
                            </strong>
                          </span>

                          {invitation.expiresAt && (
                            <>
                              <span className="invitation-meta-divider">
                                •
                              </span>

                              <span>
                                <Clock
                                  size={13}
                                />

                                Expires{" "}
                                {new Date(
                                  invitation.expiresAt
                                ).toLocaleDateString()}
                              </span>
                            </>
                          )}

                        </div>

                      </div>

                      {/* ACTIONS */}

                      <div className="invitation-card-actions">

                        <button
                          type="button"
                          className="invitation-reject-button"
                          onClick={() =>
                            handleReject(
                              invitation._id
                            )
                          }
                          disabled={busy}
                        >
                          {rejecting
                            ? "Rejecting..."
                            : "Reject"}
                        </button>

                        <button
                          type="button"
                          className="invitation-accept-button"
                          onClick={() =>
                            handleAccept(
                              invitation._id
                            )
                          }
                          disabled={busy}
                        >
                          <Check size={15} />

                          {accepting
                            ? "Accepting..."
                            : "Accept"}
                        </button>

                      </div>

                    </article>

                  );
                }
              )}

            </div>

          )}

        </section>

      </main>

    </div>
  );
};

export default Invitations;