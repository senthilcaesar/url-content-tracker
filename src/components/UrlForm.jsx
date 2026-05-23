import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Read'];
const CATEGORIES = ['Read Later', 'Work', 'Personal', 'Research', 'Tech', 'Inspiration'];
const PRIORITIES = ['Low', 'Medium', 'High'];

const COLOR_OPTIONS = [
  { value: 'none',   label: 'No color', hex: null },
  { value: 'red',    label: 'Red',      hex: '#ef4444' },
  { value: 'orange', label: 'Orange',   hex: '#f97316' },
  { value: 'yellow', label: 'Yellow',   hex: '#eab308' },
  { value: 'green',  label: 'Green',    hex: '#22c55e' },
  { value: 'cyan',   label: 'Cyan',     hex: '#06b6d4' },
  { value: 'blue',   label: 'Blue',     hex: '#3b82f6' },
  { value: 'purple', label: 'Purple',   hex: '#a855f7' },
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{editingEntry ? 'Edit Item' : 'Add to Shelf'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="url-form">
          <div className="form-group">
            <label>URL</label>
            <input 
              type="url" 
              required 
              placeholder="https://example.com"
              value={formData.url}
              onChange={e => setFormData({...formData, url: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>Title</label>
            <input 
              type="text" 
              placeholder="Give it a name..."
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              placeholder="What is this about?"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select 
                value={formData.priority}
                onChange={e => setFormData({...formData, priority: e.target.value})}
              >
                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                {STATUS_OPTIONS.map(status => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Created Date</label>
              <input
                type="date"
                value={formData.createdDate}
                onChange={e => setFormData({...formData, createdDate: e.target.value})}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Reminder Color</label>
            <div className="color-swatch-row">
              {COLOR_OPTIONS.map(({ value, label, hex }) => (
                <button
                  key={value}
                  type="button"
                  title={label}
                  className={`color-swatch${formData.color === value ? ' selected' : ''}`}
                  style={hex ? { background: hex } : undefined}
                  onClick={() => setFormData({ ...formData, color: value })}
                  aria-label={label}
                  aria-pressed={formData.color === value}
                >
                  {value === 'none' && <span className="color-swatch-none">∅</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Tags</label>
            <div
              className="tag-input-area"
              onClick={() => tagInputRef.current?.focus()}
            >
              {(formData.tags || []).map(tag => (
                <span key={tag} className="tag-chip tag-chip-form">
                  {tag}
                  <button
                    type="button"
                    className="tag-chip-remove"
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
                className="tag-text-input"
                placeholder={(formData.tags || []).length === 0 ? 'Add tags… press Enter or comma' : ''}
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={() => { if (tagInput.trim()) { addTag(tagInput); setTagInput(''); } }}
              />
            </div>
          </div>

          <button type="submit" className="btn-submit" style={{ background: 'var(--primary-color)' }}>
            {editingEntry ? 'Save Changes' : 'Add to Shelf'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
