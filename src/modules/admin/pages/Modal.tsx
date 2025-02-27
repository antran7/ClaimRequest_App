// Modal.tsx
import { ReactNode } from "react";
import "./Modal.css";

interface ModalProps {
  isOpen: boolean;
  title: string;
  content: ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
}

export default function Modal({ isOpen, title, content, onClose, onConfirm }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <div>{content}</div>
        <div className="modal-actions">
          {onConfirm && <button className="confirm-btn" onClick={onConfirm}>Confirm</button>}
          <button className="cancel-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
