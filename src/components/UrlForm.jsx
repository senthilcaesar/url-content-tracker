import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './UrlForm.css';

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Read', 'Archived'];

export function UrlForm({ onSubmit, onClose, editingEntry }) {
  const initialFormState = {
    url: '',
    description: '',
    category: '',
    priority: 3,
    colorCode: '#6366f1',
    status: 'Pending',
    comments: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (editingEntry) {
      setFormData(editingEntry);
    } else {
      setFormData(initialFormState);
    }
  }, [editingEntry]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'priority' ? parseInt(value, 10) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.url) return;
    onSubmit(formData);
    setFormData(initialFormState);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content url-form-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} title="Close">
          <X size={20} />
        </button>
        <form className="url-form" onSubmit={handleSubmit}>
          <h2>{editingEntry ? 'Update Entry' : 'Add New Tracker'}</h2>
      <div className="form-grid">
        <div className="form-group full-width">
          <label htmlFor="url">URL</label>
          <input
            type="url"
            name="url"
            id="url"
            placeholder="https://example.com"
            value={formData.url}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            name="description"
            id="description"
            placeholder="What's this link about?"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            type="text"
            name="category"
            id="category"
            placeholder="Development, Reading, etc."
            value={formData.category}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select name="priority" id="priority" value={formData.priority} onChange={handleChange}>
            <option value="1">1 - Low</option>
            <option value="2">2 - Medium</option>
            <option value="3">3 - High</option>
            <option value="4">4 - Urgent</option>
            <option value="5">5 - Critical</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select name="status" id="status" value={formData.status} onChange={handleChange}>
            {STATUS_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="colorCode">Color Tag</label>
          <div className="color-picker-wrapper">
            <input
              type="color"
              name="colorCode"
              id="colorCode"
              value={formData.colorCode}
              onChange={handleChange}
            />
            <span>{formData.colorCode}</span>
          </div>
        </div>

        <div className="form-group full-width">
          <label htmlFor="comments">Comments</label>
          <textarea
            name="comments"
            id="comments"
            rows="3"
            placeholder="Add some notes..."
            value={formData.comments}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {editingEntry ? 'Save Changes' : 'Add Entry'}
          </button>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
  );
}
