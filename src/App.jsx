import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Clock, 
  Code, 
  LogOut, 
  User,
  X
} from 'lucide-react';

import { UrlForm } from './components/UrlForm';
import { UrlCard } from './components/UrlCard';
import { Login } from './components/Login';
import { TechStackModal } from './components/TechStackModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';

import { useAuth } from './hooks/useAuth';
import { useFirestore } from './hooks/useFirestore';

import './App.css';

const STATUSES = ['Pending', 'In Progress', 'Read', 'Archived'];

function App() {
  const { user, loading: authLoading, loginWithGoogle, logout } = useAuth();
  const { entries, loading: dbLoading, addEntry, updateEntry, deleteEntry } = useFirestore(user?.uid);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [isTechStackOpen, setIsTechStackOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const filteredEntries = useMemo(() => {
    return entries.filter(item => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = (item.title || '').toLowerCase().includes(q) || 
                          (item.url || '').toLowerCase().includes(q) ||
                          (item.description || '').toLowerCase().includes(q);
      const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [entries, searchQuery, filterStatus]);

  const handleAddOrUpdate = async (formData) => {
    setIsFormOpen(false);
    if (!formData) {
        setEditingEntry(null);
        return;
    }

    try {
      if (editingEntry) {
        await updateEntry(editingEntry.id, formData);
        setEditingEntry(null);
      } else {
        await addEntry(formData);
      }
    } catch (error) {
      console.error("Operation failed:", error);
    }
  };

  const startEditing = (item) => {
    setEditingEntry(item);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id) => {
    const item = entries.find(e => e.id === id);
    setDeleteModal({ isOpen: true, item });
  };

  const confirmDelete = async () => {
    const itemToDelete = deleteModal.item;
    if (itemToDelete) {
      setDeleteModal({ isOpen: false, item: null });
      try {
        await deleteEntry(itemToDelete.id);
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const updateItemStatus = async (id, newStatus) => {
    try {
      await updateEntry(id, { status: newStatus });
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  if (authLoading) {
    return (
      <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="stats-bar">Loading Shelf...</div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={loginWithGoogle} />;
  }

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <div className="header-brand">
            <div className="logo">
              <div className="logo-icon">ZS</div>
              <div className="logo-copy">
                <h1>ZenShelf</h1>
                <p className="logo-subtitle">Curate and revisit your best links</p>
              </div>
            </div>
          </div>
          
          <div className="header-search">
            <div className="search-bar">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Search your shelf..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="header-actions">
            <div className="header-controls-group">
              <button 
                className="btn-primary add-link-btn"
                onClick={() => { setEditingEntry(null); setIsFormOpen(true); }}
              >
                <Plus size={18} />
                <span>Add Link</span>
              </button>

              <button 
                onClick={() => setIsTechStackOpen(true)}
                className="header-icon-btn"
                title="View Tech Stack"
              >
                <Code size={18} />
              </button>
              
              <button 
                onClick={toggleTheme} 
                className="header-icon-btn"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? '☀️' : '🌙'}
              </button>

              <div className="user-profile" title={user.displayName || user.email}>
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="user-avatar" />
                ) : (
                  <User size={18} />
                )}
                <span className="user-name">{user.displayName?.split(' ')[0] || 'User'}</span>
                <button 
                  onClick={logout}
                  className="logout-btn"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <aside className="sidebar">
          <nav className="filter-nav">
            <h3>Status</h3>
            <button 
              className={`filter-btn ${filterStatus === 'All' ? 'active' : ''}`}
              onClick={() => setFilterStatus('All')}
            >
              All Links
            </button>
            {STATUSES.map(status => (
              <button 
                key={status}
                className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
                onClick={() => setFilterStatus(status)}
              >
                {status}
              </button>
            ))}
          </nav>
          
          <div className="stats-card">
            <h4>Shelf Stats</h4>
            <div className="stat-item">
              <span className="stat-label">Total Items</span>
              <span className="stat-value">{entries.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Pending</span>
              <span className="stat-value">{entries.filter(i => i.status === 'Pending').length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Archived</span>
              <span className="stat-value">{entries.filter(i => i.status === 'Archived').length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Read</span>
              <span className="stat-value">{entries.filter(i => i.status === 'Read').length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">In Progress</span>
              <span className="stat-value">{entries.filter(i => i.status === 'In Progress').length}</span>
            </div>
          </div>
        </aside>

        <section className="shelf-grid">
          <AnimatePresence mode="popLayout">
            {dbLoading ? (
               <div className="empty-state">
                    <h3>Synchronizing...</h3>
                </div>
            ) : filteredEntries.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="empty-state"
              >
                <div className="empty-icon">
                  <Clock size={48} strokeWidth={1} />
                </div>
                <h3>Your shelf is empty</h3>
                <p>Start adding links to organize your digital world.</p>
              </motion.div>
            ) : (
              filteredEntries.map((item) => (
                <UrlCard 
                  key={item.id}
                  item={item}
                  onEdit={startEditing}
                  onDelete={handleDeleteClick}
                  onStatusUpdate={updateItemStatus}
                />
              ))
            )}
          </AnimatePresence>
        </section>
      </main>

      <footer style={{ padding: '2rem', textAlign: 'center', opacity: 0.5, fontSize: '0.8rem' }}>
        <p>© 2026 URL Content Tracker • Built with React 19 & Firebase</p>
      </footer>

      <AnimatePresence>
        {isFormOpen && (
          <UrlForm 
            onSubmit={handleAddOrUpdate} 
            onClose={() => { setEditingEntry(null); setIsFormOpen(false); }} 
            editingEntry={editingEntry}
          />
        )}
      </AnimatePresence>

      <TechStackModal 
        isOpen={isTechStackOpen} 
        onClose={() => setIsTechStackOpen(false)} 
      />

      <DeleteConfirmModal 
        isOpen={deleteModal.isOpen} 
        onClose={() => setDeleteModal({ isOpen: false, item: null })}
        onConfirm={confirmDelete}
        itemName={deleteModal.item?.url || deleteModal.item?.title}
      />
    </div>
  );
}

export default App;
