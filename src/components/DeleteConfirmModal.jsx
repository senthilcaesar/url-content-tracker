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

          <div className="delete-copy">
            <span className="delete-eyebrow">Destructive action</span>
            <h2>Delete this entry?</h2>
            <p className="delete-description">
              This will permanently remove it from your ZenShelf collection.
            </p>
          </div>

          <div className="delete-item-preview">
            <span className="delete-item-label">Selected entry</span>
            <p className="delete-item-name">{itemName || 'This item'}</p>
          </div>

          <p className="delete-warning-text">This action cannot be undone.</p>
          
          <div className="delete-actions">
            <button className="delete-cancel-btn" onClick={onClose}>
              Keep Entry
            </button>
            <button className="btn-danger" onClick={onConfirm}>
              <Trash2 size={18} /> Delete Entry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
