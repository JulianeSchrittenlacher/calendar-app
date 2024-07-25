import React from "react";
import "../styles/Modal.css";

type ModalProps = {
    show: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

export default function Modal({ show, onClose, children }: ModalProps) {
    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
}
