import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import './DeleteConfirmModal.css';

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content delete-confirm-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} title="Cancel">
          <X size={18} />
        </button>
        
        <div className="delete-confirm-container">
          <div className="delete-icon-wrapper">
            <AlertTriangle size={32} className="warning-icon" />
          </div>
          
          <h2>Delete Entry?</h2>
          <p className="delete-item-name">{itemName || 'This item'} will be permanently removed from your collection.</p>
          
          <div className="delete-actions">
            <button className="btn-secondary" onClick={onClose}>
              No, Keep it
            </button>
            <button className="btn-danger" onClick={onConfirm}>
              <Trash2 size={18} /> Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
