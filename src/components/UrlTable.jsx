import React from 'react';
import { ArrowUp, ArrowDown, Edit2, Trash2, ExternalLink } from 'lucide-react';
import './UrlTable.css';

export function UrlTable({ entries, loading, searchQuery, sortConfig, onSort, onEdit, onDelete }) {
  const getSortIcon = (field) => {
    if (sortConfig.field !== field) return null;
    return sortConfig.direction === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />;
  };

  const getPriorityClass = (priority) => {
    if (priority >= 5) return 'prio-critical';
    if (priority >= 4) return 'prio-urgent';
    if (priority >= 3) return 'prio-high';
    if (priority >= 2) return 'prio-med';
    return 'prio-low';
  };

  const highlightText = (text, query) => {
    if (!query || !text) return text;
    const parts = String(text).split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="search-highlight">{part}</mark>
          ) : part
        )}
      </span>
    );
  };

  return (
    <div className="table-container shadow-md">
      <table className="url-table">
        <thead>
          <tr>
            <th>Tag</th>
            <th>URL</th>
            <th>Description</th>
            <th 
              onClick={() => onSort('category')} 
              className="sortable"
              aria-sort={sortConfig.field === 'category' ? sortConfig.direction + 'ending' : 'none'}
            >
              <button type="button" className="sort-btn">
                Category {getSortIcon('category')}
              </button>
            </th>
            <th 
              onClick={() => onSort('priority')} 
              className="sortable"
              aria-sort={sortConfig.field === 'priority' ? sortConfig.direction + 'ending' : 'none'}
            >
              <button type="button" className="sort-btn">
                Priority {getSortIcon('priority')}
              </button>
            </th>
            <th 
              onClick={() => onSort('status')} 
              className="sortable"
              aria-sort={sortConfig.field === 'status' ? sortConfig.direction + 'ending' : 'none'}
            >
              <button type="button" className="sort-btn">
                Status {getSortIcon('status')}
              </button>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7" className="empty-state">
                <div className="loading-spinner-container">
                  <div className="loading-dots">Initializing Collection...</div>
                </div>
              </td>
            </tr>
          ) : entries.length === 0 ? (
            <tr>
              <td colSpan="7" className="empty-state">No entries found. Add one above!</td>
            </tr>
          ) : (
            entries.map((entry) => (
              <tr key={entry.id} className="entry-row">
                <td data-label="Tag" className="tag-cell">
                  <div className="td-content">
                    <div 
                      className="color-tag" 
                      style={{ backgroundColor: entry.colorCode }}
                      title={entry.colorCode}
                    />
                  </div>
                </td>
                <td className="url-cell primary-cell" data-label="URL">
                  <div className="td-content">
                    <a href={entry.url} target="_blank" rel="noopener noreferrer">
                      {highlightText(entry.url, searchQuery)} <ExternalLink size={12} />
                    </a>
                  </div>
                </td>
                <td className="description-cell" data-label="Description">
                  <div className="td-content">
                    <div className="description-text">{highlightText(entry.description, searchQuery)}</div>
                    {entry.comments && (
                      <div className="comments-preview">
                        {highlightText(entry.comments, searchQuery)}
                      </div>
                    )}
                  </div>
                </td>
                <td className="category-cell meta-cell" data-label="Category">
                  <div className="td-content">
                    <span className="badge-category">
                      {highlightText(entry.category || 'None', searchQuery)}
                    </span>
                  </div>
                </td>
                <td className="priority-cell meta-cell" data-label="Priority">
                  <div className="td-content">
                    <span className={`badge-priority ${getPriorityClass(entry.priority)}`}>
                      {entry.priority}
                    </span>
                  </div>
                </td>
                <td className="status-cell meta-cell" data-label="Status">
                  <div className="td-content">
                    <span className={`badge-status status-${entry.status.toLowerCase().replace(' ', '-')}`}>
                      {entry.status}
                    </span>
                  </div>
                </td>
                <td className="actions-cell" data-label="Actions">
                  <div className="td-content">
                    <button onClick={() => onEdit(entry)} title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => onDelete(entry.id)} title="Delete" className="delete-btn">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
