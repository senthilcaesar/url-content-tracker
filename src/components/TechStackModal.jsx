import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Atom, Zap, Palette, Boxes, Lock, Cloud, Sparkles, Workflow } from 'lucide-react';
import './TechStackModal.css';

const techStack = [
  { category: 'Framework',      name: 'React 19',        icon: <Atom size={24} />,     color: '#61DAFB', bg: '#e0f7ff', rotate: -1.5 },
  { category: 'Bundler',        name: 'Vite 8',           icon: <Zap size={24} />,      color: '#7c3aed', bg: '#ede9fe', rotate: 1.2  },
  { category: 'Auth',           name: 'Firebase Auth',    icon: <Lock size={24} />,     color: '#d97706', bg: '#fef3c7', rotate: -1.0 },
  { category: 'Database',       name: 'Cloud Firestore',  icon: <Cloud size={24} />,    color: '#1d4ed8', bg: '#dbeafe', rotate: 1.5  },
  { category: 'Animation',      name: 'Framer Motion',    icon: <Sparkles size={24} />, color: '#9d174d', bg: '#fce7f3', rotate: -1.2 },
  { category: 'Styling',        name: 'CSS Variables',    icon: <Palette size={24} />,  color: '#065f46', bg: '#d1fae5', rotate: 1.0  },
  { category: 'CI/CD',          name: 'GitHub Actions',   icon: <Workflow size={24} />, color: '#1e3a5f', bg: '#bfdbfe', rotate: -0.8 },
  { category: 'Icons',          name: 'Lucide Icons',     icon: <Boxes size={24} />,    color: '#7c2d12', bg: '#ffedd5', rotate: 1.3  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24, rotate: 0 },
  visible: (i) => ({
    opacity: 1, y: 0,
    rotate: techStack[i]?.rotate ?? 0,
    transition: { duration: 0.35, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }
  }),
  hover: (i) => ({
    rotate: 0,
    y: -6,
    scale: 1.03,
    transition: { duration: 0.18, ease: 'easeOut' }
  })
};

export const TechStackModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="ts-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
        >
          <motion.div
            className="ts-modal"
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={e => e.stopPropagation()}
          >
            {/* Deco dots */}
            <span className="ts-deco ts-deco-1">★</span>
            <span className="ts-deco ts-deco-2">✦</span>
            <span className="ts-deco ts-deco-3">◆</span>

            {/* Close */}
            <button className="ts-close" onClick={onClose} aria-label="Close">
              <X size={16} strokeWidth={3} />
            </button>

            {/* Header */}
            <div className="ts-header">
              <div className="ts-title-wrap">
                <span className="ts-eyebrow">🛠 built with</span>
                <h2 className="ts-title">Tech Stack!</h2>
              </div>
              <p className="ts-subtitle">The tools powering every corner of this app.</p>
            </div>

            {/* Cards grid */}
            <div className="ts-grid">
              {techStack.map((tech, i) => (
                <motion.article
                  key={tech.name}
                  className="ts-card"
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  style={{
                    '--card-color': tech.color,
                    '--card-bg': tech.bg,
                    rotate: `${tech.rotate}deg`
                  }}
                >
                  <div className="ts-card-icon">
                    {tech.icon}
                  </div>
                  <div className="ts-card-text">
                    <span className="ts-card-category">{tech.category}</span>
                    <h3 className="ts-card-name">{tech.name}</h3>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Footer stamp */}
            <div className="ts-footer">
              <span className="ts-stamp">© 2026 URL Content Tracker</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
