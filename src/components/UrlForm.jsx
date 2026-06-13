import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Tag, Trash2, Link2, Terminal, SlidersHorizontal, Activity, Calendar, ChevronDown } from 'lucide-react';

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Read'];
const CATEGORIES = ['Read Later', 'Work', 'Personal', 'Research', 'Tech', 'Inspiration'];
const PRIORITIES = ['Low', 'Medium', 'High'];

const COLOR_OPTIONS = [
  { value: 'none',     label: 'No color', hex: null },
  { value: 'crimson',  label: 'Crimson',  hex: '#be123c' },  // deep blood red
  { value: 'red',      label: 'Red',      hex: '#ef4444' },  // bright red
  { value: 'coral',    label: 'Coral',    hex: '#f4694b' },  // warm salmon-red
  { value: 'magenta',  label: 'Magenta',  hex: '#e91e8c' },  // hot magenta
  { value: 'pink',     label: 'Pink',     hex: '#ec4899' },  // soft pink
  { value: 'fuchsia',  label: 'Fuchsia',  hex: '#d946ef' },  // electric fuchsia
  { value: 'purple',   label: 'Purple',   hex: '#a855f7' },  // medium purple
  { value: 'violet',   label: 'Violet',   hex: '#8b5cf6' },  // blue-violet
  { value: 'indigo',   label: 'Indigo',   hex: '#6366f1' },  // indigo
  { value: 'navy',     label: 'Navy',     hex: '#1e3a8a' },  // deep navy
  { value: 'blue',     label: 'Blue',     hex: '#3b82f6' },  // classic blue
  { value: 'steel',    label: 'Steel',    hex: '#4a7fa5' },  // cool steel blue
  { value: 'sky',      label: 'Sky',      hex: '#0ea5e9' },  // light sky
  { value: 'cyan',     label: 'Cyan',     hex: '#06b6d4' },  // cyan
  { value: 'teal',     label: 'Teal',     hex: '#14b8a6' },  // teal
  { value: 'emerald',  label: 'Emerald',  hex: '#10b981' },  // emerald green
  { value: 'green',    label: 'Green',    hex: '#22c55e' },  // bright green
  { value: 'sage',     label: 'Sage',     hex: '#6b8f71' },  // muted earthy sage
  { value: 'lime',     label: 'Lime',     hex: '#84cc16' },  // yellow-green lime
  { value: 'yellow',   label: 'Yellow',   hex: '#facc15' },  // bright yellow
  { value: 'gold',     label: 'Gold',     hex: '#d97706' },  // warm gold
  { value: 'orange',   label: 'Orange',   hex: '#f97316' },  // orange
  { value: 'brown',    label: 'Brown',    hex: '#78350f' },  // dark brown
  { value: 'slate',    label: 'Slate',    hex: '#64748b' },  // blue-gray slate
  { value: 'gray',     label: 'Gray',     hex: '#9ca3af' },  // neutral gray
];

const getTodayInputValue = () => {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
};

const getEntryDateValue = (entry) => {
  if (entry?.createdDate) return entry.createdDate;
  if (typeof entry?.createdAt === 'string' && entry.createdAt.length >= 10) {
    return entry.createdAt.slice(0, 10);
  }
  return getTodayInputValue();
};

export function UrlForm({ onSubmit, onClose, editingEntry }) {
  const initialFormState = {
    url: '',
    title: '',
    description: '',
    status: 'Pending',
    category: 'Read Later',
    priority: 'Medium',
    color: 'none',
    createdDate: getTodayInputValue(),
    tags: []
  };

  const [formData, setFormData] = useState(initialFormState);
  const [tagInput, setTagInput] = useState('');
  const tagInputRef = useRef(null);

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const categoryRef = useRef(null);
  const statusRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setCategoryOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setStatusOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (editingEntry) {
      setFormData({
        ...initialFormState,
        ...editingEntry,
        createdDate: getEntryDateValue(editingEntry)
      });
    } else {
      setFormData(initialFormState);
    }
  }, [editingEntry]);

  const addTag = (raw) => {
    const tag = raw.trim().toLowerCase();
    if (!tag || (formData.tags || []).includes(tag)) return;
    setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), tag] }));
  };

  const removeTag = (tag) => {
    setFormData(prev => ({ ...prev, tags: (prev.tags || []).filter(t => t !== tag) }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
      setTagInput('');
    } else if (e.key === 'Backspace' && !tagInput && formData.tags?.length) {
      removeTag(formData.tags[formData.tags.length - 1]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.url) return;
    if (tagInput.trim()) addTag(tagInput);
    onSubmit({ ...formData, tags: formData.tags || [] });
    setFormData(initialFormState);
    setTagInput('');
  };

  const getPriorityMeta = (priority) => {
    const normalized = (priority || '').toLowerCase();
    if (['low', 'medium', 'high'].includes(normalized)) {
      return { label: priority, className: normalized };
    }
    return { label: 'Medium', className: 'medium' };
  };

  const priorityMeta = getPriorityMeta(formData.priority);
  const statusClass = (formData.status || 'Pending').replace(/\s+/g, '').toLowerCase();

  const COLOR_HEX = {
    crimson:  '#be123c',
    red:      '#ef4444',
    coral:    '#f4694b',
    magenta:  '#e91e8c',
    pink:     '#ec4899',
    fuchsia:  '#d946ef',
    purple:   '#a855f7',
    violet:   '#8b5cf6',
    indigo:   '#6366f1',
    navy:     '#1e3a8a',
    blue:     '#3b82f6',
    steel:    '#4a7fa5',
    sky:      '#0ea5e9',
    cyan:     '#06b6d4',
    teal:     '#14b8a6',
    emerald:  '#10b981',
    green:    '#22c55e',
    sage:     '#6b8f71',
    lime:     '#84cc16',
    yellow:   '#facc15',
    gold:     '#d97706',
    orange:   '#f97316',
    brown:    '#78350f',
    slate:    '#64748b',
    gray:     '#9ca3af',
  };
  const accentColor = formData.color && formData.color !== 'none' ? COLOR_HEX[formData.color] : null;
  const accentStyle = accentColor
    ? {
        backgroundColor: `color-mix(in srgb, ${accentColor} 12%, var(--surface-color))`,
        borderColor: accentColor,
      }
    : {};

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div 
        initial={{ scale: 0.96, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 12 }}
        transition={{ duration: 0.22, ease: 'easeInOut' }}
        className="hud-modal" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="hud-header">
          <div className="hud-title-area">
            <Terminal size={16} className="hud-title-icon" />
            <h2>{editingEntry ? 'EDIT LINK DECK' : 'INGEST NEW LINK'}</h2>
            <div className="hud-status-indicator">
              <span className="status-dot green"></span>
              <span className="status-text">DECK ACTIVE</span>
            </div>
          </div>
          <button className="hud-close-btn" onClick={onClose} aria-label="Close Control Deck">
            <X size={16} />
          </button>
        </div>

        <div className="hud-body">
          {/* LEFT COLUMN: Visual Port & Telemetry */}
          <div className="hud-port-panel">
            <div className="hud-section-header">
              <Activity size={12} />
              <span>VISUAL PORT CARD PREVIEW</span>
            </div>

            <div 
              className="url-card preview-mode" 
              style={{ 
                ...accentStyle,
                margin: '1.25rem 0 0 0',
                width: '100%',
                pointerEvents: 'none'
              }}
            >
              <div className="card-header">
                <span className={`priority-badge ${priorityMeta.className}`}>
                  {priorityMeta.label}
                </span>
                <div className="card-actions" style={{ opacity: 0.3 }}>
                  <button type="button" style={{ padding: '6px' }}><Trash2 size={16} /></button>
                </div>
              </div>
              
              <div className="card-body">
                <h3 className="card-title">
                  {formData.title || formData.url || 'My Awesome Link'}
                </h3>
                <p className="card-desc">
                  {formData.description || 'Provide a brief summary of the URL shelf contents.'}
                </p>
                {(formData.tags || []).length > 0 && (
                  <div className="card-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', margin: '6px 0' }}>
                    {(formData.tags).map(tag => (
                      <span key={tag} className="tag-chip">{tag}</span>
                    ))}
                  </div>
                )}
                <div className="card-url">
                  <ExternalLink size={14} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {formData.url || 'https://example.com/some/path'}
                  </span>
                </div>
              </div>

              <div className="card-footer">
                <div className="card-meta">
                  <span className="category-tag">
                    <Tag size={12} />
                    {formData.category || 'Read Later'}
                  </span>
                </div>
                <div className="status-dropdown">
                  <span className={`status-select ${statusClass}`} style={{ display: 'inline-block', minWidth: '95px', textAlign: 'center' }}>
                    {formData.status || 'Pending'}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Control Console (Inputs) */}
          <div className="hud-console-panel">
            <form onSubmit={handleSubmit} className="hud-form">
              
              {/* URL Section */}
              <div className="hud-form-group">
                <label className="hud-input-label">
                  <Link2 size={12} /> URL
                </label>
                <div className="hud-input-wrapper">
                  <input 
                    type="url" 
                    required 
                    placeholder="https://example.com/data-feed"
                    value={formData.url}
                    onChange={e => setFormData({...formData, url: e.target.value})}
                    className="hud-input main-url-input"
                  />
                  <div className="input-glow-pulse"></div>
                </div>
              </div>

              {/* Title & Desc Grid */}
              <div className="hud-grid-row">
                <div className="hud-form-group">
                  <label className="hud-input-label">DISPLAY TITLE</label>
                  <input 
                    type="text" 
                    placeholder="Identify this stream..."
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="hud-input"
                  />
                </div>
                <div className="hud-form-group">
                  <label className="hud-input-label">DATE</label>
                  <div className="hud-date-wrapper">
                    <Calendar size={14} className="date-icon" />
                    <input
                      type="date"
                      value={formData.createdDate}
                      onChange={e => setFormData({...formData, createdDate: e.target.value})}
                      className="hud-input date-input"
                    />
                  </div>
                </div>
              </div>

              <div className="hud-form-group">
                <label className="hud-input-label">DESCRIPTION SUMMARY</label>
                <textarea 
                  placeholder="Record summary notes or metadata details for this link feed..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="hud-textarea"
                />
              </div>

              {/* Priority Pills Selector */}
              <div className="hud-form-group">
                <label className="hud-input-label">PRIORITY</label>
                <div className="hud-priority-deck">
                  {PRIORITIES.map(p => {
                    const active = formData.priority === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        className={`hud-priority-pill ${p.toLowerCase()} ${active ? 'active' : ''}`}
                        onClick={() => setFormData({...formData, priority: p})}
                      >
                        <span className="dot"></span>
                        {p.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category & Status Selectors */}
              <div className="hud-grid-row" style={{ zIndex: 10 }}>
                <div className="hud-form-group" ref={categoryRef} style={{ position: 'relative' }}>
                  <label className="hud-input-label">CATEGORY</label>
                  <div className="hud-custom-select-container">
                    <button
                      type="button"
                      className={`hud-custom-select-trigger ${categoryOpen ? 'open' : ''}`}
                      onClick={() => setCategoryOpen(!categoryOpen)}
                    >
                      <span>{formData.category}</span>
                      <ChevronDown size={14} className="chevron-icon" />
                    </button>
                    <AnimatePresence>
                      {categoryOpen && (
                        <motion.ul
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.15 }}
                          className="hud-custom-dropdown-list"
                        >
                          {CATEGORIES.map(c => (
                            <li
                              key={c}
                              className={`hud-custom-dropdown-item ${formData.category === c ? 'selected' : ''}`}
                              onClick={() => {
                                setFormData({...formData, category: c});
                                setCategoryOpen(false);
                              }}
                            >
                              {c}
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="hud-form-group" ref={statusRef} style={{ position: 'relative' }}>
                  <label className="hud-input-label">STATUS</label>
                  <div className="hud-custom-select-container">
                    <button
                      type="button"
                      className={`hud-custom-select-trigger ${statusOpen ? 'open' : ''}`}
                      onClick={() => setStatusOpen(!statusOpen)}
                    >
                      <span>{formData.status}</span>
                      <ChevronDown size={14} className="chevron-icon" />
                    </button>
                    <AnimatePresence>
                      {statusOpen && (
                        <motion.ul
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.15 }}
                          className="hud-custom-dropdown-list"
                        >
                          {STATUS_OPTIONS.map(s => (
                            <li
                              key={s}
                              className={`hud-custom-dropdown-item ${formData.status === s ? 'selected' : ''}`}
                              onClick={() => {
                                setFormData({...formData, status: s});
                                setStatusOpen(false);
                              }}
                            >
                              {s}
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Accent Color Swatches */}
              <div className="hud-form-group">
                <label className="hud-input-label">ACCENT DECK COLOR</label>
                <div className="hud-color-swatches">
                  {COLOR_OPTIONS.map(({ value, label, hex }) => (
                    <button
                      key={value}
                      type="button"
                      title={label}
                      className={`hud-color-node${formData.color === value ? ' active' : ''}`}
                      style={hex ? { '--node-color': hex } : undefined}
                      onClick={() => setFormData({ ...formData, color: value })}
                      aria-label={label}
                      aria-pressed={formData.color === value}
                    >
                      {value === 'none' && <span className="null-indicator">∅</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tag Management */}
              <div className="hud-form-group">
                <label className="hud-input-label">TAG REGISTER INDEX</label>
                <div
                  className="hud-tag-console"
                  onClick={() => tagInputRef.current?.focus()}
                >
                  {(formData.tags || []).map(tag => (
                    <span key={tag} className="hud-tag-chip">
                      {tag}
                      <button
                        type="button"
                        className="hud-tag-remove"
                        onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
                        aria-label={`Remove tag ${tag}`}
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                  <input
                    ref={tagInputRef}
                    type="text"
                    className="hud-tag-input"
                    placeholder={(formData.tags || []).length === 0 ? 'Enter tags (comma separated)...' : ''}
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    onBlur={() => { if (tagInput.trim()) { addTag(tagInput); setTagInput(''); } }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="hud-footer">
                <button type="button" className="hud-btn hud-btn-abort" onClick={onClose}>
                  ABORT
                </button>
                <button type="submit" className="hud-btn hud-btn-commit">
                  {editingEntry ? 'SAVE CONFIG' : 'COMMIT SHELF'}
                </button>
              </div>

            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
