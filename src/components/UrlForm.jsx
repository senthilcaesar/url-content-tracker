import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Read', 'Archived'];
const CATEGORIES = ['Read Later', 'Work', 'Personal', 'Research', 'Tech', 'Inspiration'];
const PRIORITIES = ['Low', 'Medium', 'High'];

export function UrlForm({ onSubmit, onClose, editingEntry }) {
  const initialFormState = {
    url: '',
    title: '',
    description: '',
    status: 'Pending',
    category: 'Read Later',
    priority: 'Medium'
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (editingEntry) {
      setFormData(editingEntry);
    } else {
      setFormData(initialFormState);
    }
  }, [editingEntry]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.url) return;
    onSubmit(formData);
    setFormData(initialFormState);
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

          <button type="submit" className="btn-submit">
            {editingEntry ? 'Save Changes' : 'Add to Shelf'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
