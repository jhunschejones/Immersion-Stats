import { createPortal } from "react-dom";
import { useEffect } from "react";
import PropTypes from "prop-types";
import { HiX } from "react-icons/hi";

Modal.propTypes = {
  onClose: PropTypes.func,
  children: PropTypes.element,
};

export default function Modal({onClose, children}) {

  // Disable body scrolling when modal is open, and re-enable when it is closed.
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => document.body.style.overflow = "unset";
  }, []);

  return createPortal(
    <>
      <div className="modal-backdrop" data-testid="modal-backdrop" onClick={onClose}></div>
      <dialog className="modal-dialog" open>
        <button className="modal-close-button" onClick={onClose}>
          <HiX style={{color: "#b7b7b7"}}  />
        </button>
        <div className="modal-content-container">
          {children}
        </div>
      </dialog>
    </>,
    document.getElementById("modals")
  );
}
