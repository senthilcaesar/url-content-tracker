import React from 'react';
import { X, Code, Atom, Zap, Palette, Boxes, Lock, Cloud, ArrowRight, User as UserIcon, Monitor, Smartphone } from 'lucide-react';
import './TechStackModal.css';

export const TechStackModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const techStack = [
    {
      name: 'React 19',
      description: 'The foundation for our component-driven UI, utilizing the latest concurrent features for a fluid user experience.',
      icon: <Atom size={20} />,
      color: 'var(--primary)'
    },
    {
      name: 'Vite 6',
      description: 'Next-generation frontend tooling providing lightning-fast development cycles and optimized production assets.',
      icon: <Zap size={20} />,
      color: '#646CFF'
    },
    {
      name: 'Firebase Auth',
      description: 'Secure identity management providing seamless Google Sign-In and protected user sessions.',
      icon: <Lock size={20} />,
      color: '#FFCA28'
    },
    {
      name: 'Cloud Firestore',
      description: 'Real-time NoSQL database ensuring your curation is instantly synced across all your devices.',
      icon: <Cloud size={20} />,
      color: '#4285F4'
    },
    {
      name: 'Modern CSS',
      description: 'Vanilla CSS with 0.57 CSS Variables for a lightweight, high-performance glassmorphic design system.',
      icon: <Palette size={20} />,
      color: '#3B82F6'
    },
    {
      name: 'Lucide Icons',
      description: 'Clean and consistent iconography that complements the premium Zen Deck aesthetic.',
      icon: <Boxes size={20} />,
      color: 'var(--text-muted)'
    }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content tech-stack-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} title="Close Tech Stack">
          <X size={18} />
        </button>
        <div className="tech-stack-container">
          <div className="tech-stack-header">
            <h2>System Architecture</h2>
            <p className="intro-text">High-performance foundations powering your personal intelligence Nexus.</p>
          </div>
          
          <div className="tech-stack-body">
            <div className="architecture-section">
              <h3>System Data Flow</h3>
              <div className="architecture-diagram">
                <div className="arch-node">
                  <div className="arch-icon-box"><UserIcon size={20} /></div>
                  <span>User</span>
                </div>
                <ArrowRight className="arch-arrow" size={16} />
                <div className="arch-node">
                  <div className="arch-icon-box primary"><Monitor size={20} /></div>
                  <span>Frontend</span>
                </div>
                <ArrowRight className="arch-arrow" size={16} />
                <div className="arch-node">
                  <div className="arch-icon-box auth"><Lock size={20} /></div>
                  <span>Auth</span>
                </div>
                <ArrowRight className="arch-arrow" size={16} />
                <div className="arch-node">
                  <div className="arch-icon-box cloud"><Cloud size={20} /></div>
                  <span>Sync</span>
                </div>
              </div>
            </div>

            <div className="divider"></div>

            <div className="tech-list">
              {techStack.map((tech, index) => (
                <div key={index} className="tech-item">
                  <div className="tech-icon-box" style={{ color: tech.color }}>
                    {tech.icon}
                  </div>
                  <div className="tech-info">
                    <span className="tech-name">{tech.name}</span>
                    <p className="tech-description">{tech.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
