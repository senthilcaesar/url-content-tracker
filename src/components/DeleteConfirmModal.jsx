import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, X } from 'lucide-react';
import './DeleteConfirmModal.css';

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="dcm-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
        >
          <motion.div
            className="dcm-modal"
            initial={{ opacity: 0, y: 40, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.93 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={e => e.stopPropagation()}
          >
            {/* Doodle decorations */}
            <span className="dcm-deco dcm-deco-1">💥</span>
            <span className="dcm-deco dcm-deco-2">✦</span>
            <span className="dcm-deco dcm-deco-3">!</span>

            {/* Close button */}
            <button className="dcm-close" onClick={onClose} aria-label="Cancel">
              <X size={14} strokeWidth={3} />
            </button>

            {/* Trash icon */}
            <div className="dcm-icon-wrap">
              <div className="dcm-icon-box">
                <Trash2 size={30} strokeWidth={2.5} />
              </div>
            </div>

            {/* Copy */}
            <div className="dcm-body">
              <span className="dcm-eyebrow">⚠ Woah, hold on!</span>
              <h2 className="dcm-title">Delete this?</h2>
              <p className="dcm-desc">
                This will permanently zap this entry from your shelf. No undo!
              </p>
            </div>

            {/* Item preview */}
            {itemName && (
              <div className="dcm-preview">
                <span className="dcm-preview-label">Entry to delete</span>
                <p className="dcm-preview-name">{itemName}</p>
              </div>
            )}

            {/* Warning */}
            <p className="dcm-warning">☠ This action cannot be undone.</p>

            {/* Actions */}
            <div className="dcm-actions">
              <button className="dcm-cancel-btn" onClick={onClose}>
                Nope, Keep it!
              </button>
              <button className="dcm-confirm-btn" onClick={onConfirm}>
                <Trash2 size={16} strokeWidth={2.5} />
                Yes, Delete!
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
