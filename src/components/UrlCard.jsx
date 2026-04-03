import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Trash2, Edit3, Tag, ChevronDown, CalendarDays } from 'lucide-react';

const STATUSES = ['Pending', 'In Progress', 'Read', 'Archived'];

export function UrlCard({ item, viewMode = 'card', onEdit, onDelete, onStatusUpdate }) {
  const motionProps = {
    layout: true,
    layoutId: `entry-${item.id}`,
    transition: {
      layout: {
        duration: 0.34,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const getPriorityMeta = (priority) => {
    if (typeof priority === 'string') {
      const normalized = priority.toLowerCase();
      if (['low', 'medium', 'high'].includes(normalized)) {
        return {
          label: priority,
          className: normalized
        };
      }
    }

    const numericPriority = Number(priority);
    if (!Number.isNaN(numericPriority)) {
      if (numericPriority >= 4) {
        return { label: `Priority ${numericPriority}`, className: 'high' };
      }
      if (numericPriority >= 2) {
        return { label: `Priority ${numericPriority}`, className: 'medium' };
      }
      return { label: `Priority ${numericPriority}`, className: 'low' };
    }

    return { label: 'Medium', className: 'medium' };
  };

  const getFormattedDate = () => {
    const rawDate = item.createdDate || item.createdAt;
    if (!rawDate) return 'Date unknown';

    const parsedDate = new Date(rawDate);
    if (Number.isNaN(parsedDate.getTime())) {
      return 'Date unknown';
    }

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(parsedDate);
  };

  const statusClass = (item.status || 'Pending').replace(/\s+/g, '').toLowerCase();
  const priorityMeta = getPriorityMeta(item.priority);
  const formattedDate = getFormattedDate();

  const COLOR_HEX = {
    red:    '#ef4444',
    orange: '#f97316',
    yellow: '#eab308',
    green:  '#22c55e',
    cyan:   '#06b6d4',
    blue:   '#3b82f6',
    purple: '#a855f7',
  };
  const accentColor = item.color && item.color !== 'none' ? COLOR_HEX[item.color] : null;
  const accentStyle = accentColor
    ? {
        background: `linear-gradient(135deg, ${accentColor}33 0%, ${accentColor}22 50%, ${accentColor}14 100%)`,
        borderColor: `${accentColor}88`,
        boxShadow: `0 0 0 1px ${accentColor}44, 0 8px 32px ${accentColor}28`,
      }
    : {};

  if (viewMode === 'list') {
    return (
      <motion.div
        {...motionProps}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        whileHover={{ y: -3, scale: 1.003 }}
        className="url-card list-view-card"
        style={accentStyle}
      >
        <div className="list-main">
          <div className="list-topline">
            <h3 className="card-title">{item.title || item.url}</h3>
            <div className="list-topline-meta">
              <span className={`priority-badge ${priorityMeta.className}`}>
                {priorityMeta.label}
              </span>
              <div className="status-dropdown">
                <select
                  value={item.status || 'Pending'}
                  onChange={(e) => onStatusUpdate(item.id, e.target.value)}
                  className={`status-select ${statusClass}`}
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown size={14} className="status-chevron" aria-hidden="true" />
              </div>
            </div>
          </div>

          <p className="card-desc">{item.description || 'No description provided.'}</p>

          <div className="list-meta-row">
            <span className="category-tag">
              <Tag size={12} />
              {item.category || 'General'}
            </span>
            <span className="date-tag">
              <CalendarDays size={12} />
              {formattedDate}
            </span>
            <div className="card-url">
              <ExternalLink size={14} />
              <a href={item.url} target="_blank" rel="noopener noreferrer">{item.url}</a>
            </div>
          </div>
        </div>

        <div className="list-utility">
          <div className="card-actions">
            <button onClick={() => onEdit(item)} title="Edit"><Edit3 size={16} /></button>
            <button onClick={() => onDelete(item.id)} title="Delete"><Trash2 size={16} /></button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      {...motionProps}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={viewMode === 'card' ? { y: -8 } : undefined}
      className={`url-card ${viewMode === 'list' ? 'list-view-card' : ''}`}
      style={accentStyle}
    >
      <div className="card-header">
        <span className={`priority-badge ${priorityMeta.className}`}>
          {priorityMeta.label}
        </span>
        <div className="card-actions">
          <button onClick={() => onEdit(item)} title="Edit"><Edit3 size={16} /></button>
          <button onClick={() => onDelete(item.id)} title="Delete"><Trash2 size={16} /></button>
        </div>
      </div>
      
      <div className="card-body">
        <h3 className="card-title">{item.title || item.url}</h3>
        <p className="card-desc">{item.description || 'No description provided.'}</p>
        <div className="card-url">
          <ExternalLink size={14} />
          <a href={item.url} target="_blank" rel="noopener noreferrer">{item.url}</a>
        </div>
      </div>

      <div className="card-footer">
        <div className="card-meta">
          <span className="category-tag">
            <Tag size={12} />
            {item.category || 'General'}
          </span>
          <span className="date-tag">
            <CalendarDays size={12} />
            {formattedDate}
          </span>
        </div>
        <div className="status-dropdown">
          <select 
            value={item.status || 'Pending'} 
            onChange={(e) => onStatusUpdate(item.id, e.target.value)}
            className={`status-select ${statusClass}`}
          >
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown size={14} className="status-chevron" aria-hidden="true" />
        </div>
      </div>
    </motion.div>
  );
}
