import { useState, useMemo, useEffect } from 'react';
import { UrlForm } from './components/UrlForm';
import { UrlTable } from './components/UrlTable';
import { TechStackModal } from './components/TechStackModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { SearchBar } from './components/SearchBar';
import { Login } from './components/Login';
import { useAuth } from './hooks/useAuth';
import { useFirestore } from './hooks/useFirestore';
import { Layout, Plus, Code, LogOut, User } from 'lucide-react';
import './components/Login.css';

function App() {
  const { user, loading: authLoading, loginWithGoogle, logout } = useAuth();
  const { entries, loading: dbLoading, addEntry, updateEntry, deleteEntry } = useFirestore(user?.uid);
  
  const [editingEntry, setEditingEntry] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTechStackOpen, setIsTechStackOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [sortConfig, setSortConfig] = useState({ field: null, direction: 'none' });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // CRUD Operations
  const handleAddOrUpdate = async (formData) => {
    if (!formData) {
      setEditingEntry(null);
      setIsFormOpen(false);
      return;
    }

    // Optimistic UI: Close modal immediately
    const isEditing = !!editingEntry;
    const editingId = editingEntry?.id;
    setEditingEntry(null);
    setIsFormOpen(false);

    try {
      if (isEditing) {
        await updateEntry(editingId, formData);
      } else {
        await addEntry(formData);
      }
    } catch (error) {
      console.error("Operation failed:", error);
    }
  };

  const handleDelete = (id) => {
    const item = entries.find(e => e.id === id);
    setDeleteModal({ isOpen: true, item });
  };

  const confirmDelete = async () => {
    const itemToDelete = deleteModal.item;
    if (itemToDelete) {
      // Optimistic UI: Close modal immediately
      setDeleteModal({ isOpen: false, item: null });
      
      try {
        await deleteEntry(itemToDelete.id);
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const startEditing = (entry) => {
    setEditingEntry(entry);
    setIsFormOpen(true);
  };

  // Sorting Logic
  const handleSort = (field) => {
    let direction = 'asc';
    if (sortConfig.field === field) {
      if (sortConfig.direction === 'asc') direction = 'desc';
      else if (sortConfig.direction === 'desc') direction = 'none';
      else direction = 'asc';
    }
    setSortConfig({ field: direction === 'none' ? null : field, direction });
  };

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries;
    
    const query = searchQuery.toLowerCase();
    return entries.filter(entry => {
      const url = (entry.url || '').toLowerCase();
      const category = (entry.category || '').toLowerCase();
      const description = (entry.description || '').toLowerCase();
      const comments = (entry.comments || '').toLowerCase();
      
      return url.includes(query) || 
             category.includes(query) || 
             description.includes(query) || 
             comments.includes(query);
    });
  }, [entries, searchQuery]);

  const sortedEntries = useMemo(() => {
    if (!sortConfig.field || sortConfig.direction === 'none') {
      return filteredEntries;
    }

    return [...filteredEntries].sort((a, b) => {
      const aVal = a[sortConfig.field] || '';
      const bVal = b[sortConfig.field] || '';

      if (sortConfig.field === 'priority') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      // Alphabetical sorting for category
      const comparison = String(aVal).localeCompare(String(bVal));
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [filteredEntries, sortConfig]);

  if (authLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="stats-bar">Loading Sanctuary...</div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={loginWithGoogle} />;
  }

  return (
    <div className="container" style={{ paddingBottom: 'var(--spacing-xl)' }}>
      <header className="glass" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: 'var(--spacing-md)',
        padding: 'var(--spacing-md) var(--spacing-lg)',
        borderRadius: 'var(--radius-lg)',
        flexWrap: 'wrap',
        gap: 'var(--spacing-md)',
        position: 'sticky',
        top: 'var(--spacing-md)',
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
          <div style={{ 
            padding: 'var(--spacing-sm)', 
            background: 'var(--primary)', 
            borderRadius: 'var(--radius-md)', 
            color: 'white', 
            display: 'flex',
            boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)'
          }}>
            <Layout size={24} />
          </div>
          <div>
            <h1 className="brand-logo" style={{ margin: 0, fontSize: '1.5rem' }}>ZenShelf</h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Intelligence & Curation</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
          <div className="user-profile" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--spacing-sm)',
            padding: '4px 12px',
            background: 'var(--bg-muted)',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--border)'
          }}>
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName} style={{ width: 24, height: 24, borderRadius: '50%' }} />
            ) : (
              <User size={20} />
            )}
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }} className="hide-mobile">
              {user.displayName?.split(' ')[0]}
            </span>
            <button 
              onClick={logout}
              className="btn-secondary"
              title="Logout"
              style={{ padding: '6px', minWidth: 'auto', border: 'none', background: 'transparent' }}
            >
              <LogOut size={16} />
            </button>
          </div>
          <button 
            onClick={() => setIsTechStackOpen(true)}
            className="btn-secondary"
            title="View Tech Stack"
          >
            <Code size={18} /> <span className="hide-mobile">Tech Stack</span>
          </button>
          
          <button 
            onClick={toggleTheme} 
            className="btn-secondary"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            style={{ 
              fontSize: '1.2rem', 
              width: '40px',
              height: '40px',
              padding: 0,
              minWidth: '40px'
            }}
          >
            {theme === 'light' ? '☀️' : '🌙'}
          </button>

          <button 
            className="btn-primary" 
            onClick={() => { setEditingEntry(null); setIsFormOpen(true); }}
          >
            <Plus size={18} /> <span className="hide-mobile">Add New</span>
          </button>
        </div>
      </header>

      <SearchBar 
        value={searchQuery} 
        onChange={setSearchQuery} 
        onClear={() => setSearchQuery('')} 
      />

      <main>




        
        <div className="stats-bar" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-end', 
          marginBottom: 'var(--spacing-md)',
          padding: '0 var(--spacing-xs)'
        }}>
          <div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              {searchQuery.trim() ? (
                <span><strong>{filteredEntries.length}</strong> matching {filteredEntries.length === 1 ? 'item' : 'items'} found <span style={{ opacity: 0.5 }}>(out of {entries.length})</span></span>
              ) : (
                <span><strong>{entries.length}</strong> items tracked in your collection</span>
              )}
            </p>
          </div>
          {sortConfig.field && (
            <div style={{ 
              fontSize: '0.7rem', 
              color: 'var(--primary)', 
              fontWeight: 700, 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              background: 'rgba(245, 158, 11, 0.1)',
              padding: '2px 8px',
              borderRadius: '4px'
            }}>
              Sorted by {sortConfig.field}
            </div>
          )}
        </div>

        <UrlTable 
          entries={sortedEntries}
          searchQuery={searchQuery}
          sortConfig={sortConfig}
          onSort={handleSort}
          onEdit={startEditing}
          onDelete={handleDelete}
        />
      </main>

      <footer style={{ marginTop: 'var(--spacing-lg)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        <p>© 2026 URL Content Tracker • Built with React 19 & Vite</p>
      </footer>

      {isFormOpen && (
        <UrlForm 
          onSubmit={handleAddOrUpdate} 
          onClose={() => { setEditingEntry(null); setIsFormOpen(false); }} 
          editingEntry={editingEntry} 
        />
      )}

      <TechStackModal 
        isOpen={isTechStackOpen} 
        onClose={() => setIsTechStackOpen(false)} 
      />

      <DeleteConfirmModal 
        isOpen={deleteModal.isOpen} 
        onClose={() => setDeleteModal({ isOpen: false, item: null })}
        onConfirm={confirmDelete}
        itemName={deleteModal.item?.url}
      />
    </div>
  );
}

export default App;
