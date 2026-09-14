import {
  AlertTriangle,
  CheckCircle2,
  X,
} from "lucide-react";

import "../styles/actionModal.css";


const ActionModal = ({
  isOpen,
  type = "confirm",
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onClose,
  loading = false,
}) => {

  if (!isOpen) {
    return null;
  }


  const isConfirm =
    type === "confirm";

  const isError =
    type === "error";

  const isSuccess =
    type === "success";


  return (
    <div
      className="action-modal-overlay"
      onMouseDown={(event) => {

        if (
          event.target ===
          event.currentTarget &&
          !loading
        ) {
          onClose();
        }

      }}
    >

      <div
        className={`action-modal ${
          isError
            ? "action-modal-error"
            : isSuccess
              ? "action-modal-success"
              : "action-modal-confirm"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="action-modal-title"
      >

        {/* =================================================
            CLOSE BUTTON
        ================================================= */}

        <button
          type="button"
          className="action-modal-close"
          onClick={onClose}
          disabled={loading}
          aria-label="Close"
        >
          <X
            size={17}
            strokeWidth={1.8}
          />
        </button>


        {/* =================================================
            ICON
        ================================================= */}

        <div className="action-modal-icon">

          {isError && (
            <AlertTriangle
              size={23}
              strokeWidth={1.8}
            />
          )}

          {isSuccess && (
            <CheckCircle2
              size={23}
              strokeWidth={1.8}
            />
          )}

          {isConfirm && (
            <AlertTriangle
              size={23}
              strokeWidth={1.8}
            />
          )}

        </div>


        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="action-modal-content">

          <h2 id="action-modal-title">
            {title}
          </h2>

          <p>
            {message}
          </p>

        </div>


        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="action-modal-actions">

          {isConfirm && (
            <button
              type="button"
              className="action-modal-cancel"
              onClick={onClose}
              disabled={loading}
            >
              {cancelText}
            </button>
          )}


          {isConfirm && (
            <button
              type="button"
              className="action-modal-confirm-button"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : confirmText}
            </button>
          )}


          {isError && (
            <button
              type="button"
              className="action-modal-error-button"
              onClick={onClose}
            >
              Okay
            </button>
          )}


          {isSuccess && (
            <button
              type="button"
              className="action-modal-success-button"
              onClick={onClose}
            >
              Okay
            </button>
          )}

        </div>

      </div>

    </div>
  );
};


export default ActionModal;