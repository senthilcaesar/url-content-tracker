import React from 'react';
import { Search, X } from 'lucide-react';
import './SearchBar.css';

export const SearchBar = ({ value, onChange, onClear }) => {
  return (
    <div className="search-container glass">
      <div className="search-icon">
        <Search size={18} />
      </div>
      <input
        type="text"
        className="search-input"
        placeholder="Search by URL, category, description or comments..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button className="search-clear" onClick={onClear} title="Clear search">
          <X size={16} />
        </button>
      )}
    </div>
  );
};
