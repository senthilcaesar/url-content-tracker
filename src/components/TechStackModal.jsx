import React from 'react';
import { X, Atom, Zap, Palette, Boxes, Lock, Cloud, Sparkles, Workflow } from 'lucide-react';
import './TechStackModal.css';

export const TechStackModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const techStack = [
    {
      category: 'Framework',
      name: 'React 19',
      description: 'Component-driven UI with modern hooks, responsive state flows, and a clean single-page application structure.',
      icon: <Atom size={20} />,
      color: 'var(--primary-color)'
    },
    {
      category: 'Bundler',
      name: 'Vite 8',
      description: 'Fast local development, lean production builds, and a simple React toolchain that stays beginner-friendly.',
      icon: <Zap size={20} />,
      color: '#646CFF'
    },
    {
      category: 'Authentication',
      name: 'Firebase Auth',
      description: 'Google Sign-In handles secure authentication and keeps each user inside their own private workspace.',
      icon: <Lock size={20} />,
      color: '#FFCA28'
    },
    {
      category: 'Database',
      name: 'Cloud Firestore',
      description: 'Realtime document database for URL entries, with per-user filtering and browser persistence enabled.',
      icon: <Cloud size={20} />,
      color: '#4285F4'
    },
    {
      category: 'Motion',
      name: 'Framer Motion',
      description: 'Subtle motion powers modal transitions, card animations, and a more polished feel across the app.',
      icon: <Sparkles size={20} />,
      color: '#f0abfc'
    },
    {
      category: 'Styling',
      name: 'Themeable CSS System',
      description: 'Vanilla CSS variables drive the dual dark and light themes, responsive layout, and reusable surfaces.',
      icon: <Palette size={20} />,
      color: '#3B82F6'
    },
    {
      category: 'CI/CD',
      name: 'GitHub Actions',
      description: 'Automated build and deployment workflows can publish the app whenever changes are pushed to the main branch.',
      icon: <Workflow size={20} />,
      color: '#93c5fd'
    },
    {
      category: 'Icons',
      name: 'Lucide Icons',
      description: 'Consistent iconography keeps actions, status cues, and navigation lightweight and readable.',
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
            <h2>Current Tech Stack</h2>
          </div>

          <section className="tech-section">
            <div className="tech-section-header">
              <span className="tech-section-label">Stack Summary</span>
            </div>
            <div className="tech-stack-list">
              {techStack.map((tech) => (
                <article key={tech.name} className="tech-stack-row">
                  <div className="tech-stack-term">
                    <div className="tech-stack-icon" style={{ color: tech.color }}>
                      {tech.icon}
                    </div>
                    <div className="tech-stack-heading">
                      <span className="tech-stack-category">{tech.category}</span>
                      <h3 className="tech-stack-name">{tech.name}</h3>
                    </div>
                  </div>
                  <div className="tech-stack-detail">
                    <p className="tech-stack-description">{tech.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
