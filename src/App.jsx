import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  Plus,
  Search,
  Clock,
  Code,
  LogOut,
  User,
  X,
  LayoutGrid,
  List,
  Archive,
  Folder,
  FolderOpen,
  ChevronLeft,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import { UrlForm } from "./components/UrlForm";
import { UrlCard } from "./components/UrlCard";
import { Login } from "./components/Login";
import { TechStackModal } from "./components/TechStackModal";
import { DeleteConfirmModal } from "./components/DeleteConfirmModal";

import { useAuth } from "./hooks/useAuth";
import { useFirestore } from "./hooks/useFirestore";

import "./App.css";

const STATUSES = ["Pending", "In Progress", "Read"];

// Sentinel key for entries that have no folder assigned.
const FOLDER_NONE = "__none__";

// Swatches offered when customizing a folder's color.
const FOLDER_COLOR_OPTIONS = [
  { value: "red", hex: "#ef4444" },
  { value: "orange", hex: "#f97316" },
  { value: "amber", hex: "#f59e0b" },
  { value: "green", hex: "#22c55e" },
  { value: "teal", hex: "#14b8a6" },
  { value: "blue", hex: "#3b82f6" },
  { value: "indigo", hex: "#6366f1" },
  { value: "violet", hex: "#8b5cf6" },
  { value: "pink", hex: "#ec4899" },
  { value: "slate", hex: "#64748b" },
];

function App() {
  const { user, loading: authLoading, loginWithGoogle, logout } = useAuth();
  const {
    entries,
    loading: dbLoading,
    addEntry,
    updateEntry,
    deleteEntry,
  } = useFirestore(user?.uid);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [isTechStackOpen, setIsTechStackOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterTag, setFilterTag] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark",
  );
  const [viewMode, setViewMode] = useState(
    () => localStorage.getItem("viewMode") || "card",
  );
  // Always start minimized whenever the app is opened; toggling is
  // session-only (not persisted), so a fresh load is always collapsed.
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const goHome = () => {
    setSearchQuery("");
    setFilterStatus("All");
    setFilterTag(null);
    setActiveFolder(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const allTags = useMemo(() => {
    const tagSet = new Set();
    entries.forEach((item) => (item.tags || []).forEach((t) => tagSet.add(t)));
    return [...tagSet].sort();
  }, [entries]);

  const filteredEntries = useMemo(() => {
    return entries.filter((item) => {
      if (!showArchived && item.archived === true) return false;
      if (showArchived && item.archived !== true) return false;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        (item.title || "").toLowerCase().includes(q) ||
        (item.url || "").toLowerCase().includes(q) ||
        (item.description || "").toLowerCase().includes(q) ||
        (item.tags || []).some((tag) => tag.toLowerCase().includes(q));
      const matchesStatus =
        filterStatus === "All" || item.status === filterStatus;
      const matchesTag = !filterTag || (item.tags || []).includes(filterTag);
      return matchesSearch && matchesStatus && matchesTag;
    });
  }, [entries, searchQuery, filterStatus, filterTag, showArchived]);

  // All distinct folder names across entries — feeds the form's folder picker.
  const allFolders = useMemo(() => {
    const set = new Set();
    entries.forEach((item) => {
      const name = (item.folder || "").trim();
      if (name) set.add(name);
    });
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [entries]);

  // Group the already-filtered entries by folder. Named folders sort
  // alphabetically; the catch-all "Unfiled" group is always rendered last.
  const folderGroups = useMemo(() => {
    const map = new Map();
    filteredEntries.forEach((item) => {
      const key = (item.folder || "").trim() || FOLDER_NONE;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(item);
    });
    const names = [...map.keys()]
      .filter((k) => k !== FOLDER_NONE)
      .sort((a, b) => a.localeCompare(b));
    if (map.has(FOLDER_NONE)) names.push(FOLDER_NONE);
    return names.map((name) => ({ name, items: map.get(name) }));
  }, [filteredEntries]);

  // Folder navigation: null = folder browser (top level); otherwise the key
  // (folder name or FOLDER_NONE) of the folder the user has drilled into.
  const [activeFolder, setActiveFolder] = useState(null);

  // The group currently being viewed, recomputed as entries/filters change so
  // counts and contents stay live. Falls back to an empty group if the active
  // folder no longer matches anything (e.g. after a filter or deletion).
  const activeGroup = useMemo(() => {
    if (activeFolder === null) return null;
    return (
      folderGroups.find((g) => g.name === activeFolder) || {
        name: activeFolder,
        items: [],
      }
    );
  }, [activeFolder, folderGroups]);

  // Per-folder colors, keyed by folder name → hex. Persisted locally like the
  // other view preferences (theme / viewMode). `colorPickerFor` tracks which
  // folder tile currently has its swatch popover open.
  const [folderColors, setFolderColors] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("folderColors") || "{}");
    } catch {
      return {};
    }
  });
  const [colorPickerFor, setColorPickerFor] = useState(null);
  const colorPickerRef = useRef(null);

  // Footer tints to the most recently applied folder color (null = default).
  const [footerColor, setFooterColor] = useState(
    () => localStorage.getItem("footerColor") || null,
  );

  useEffect(() => {
    if (footerColor) localStorage.setItem("footerColor", footerColor);
    else localStorage.removeItem("footerColor");
  }, [footerColor]);

  useEffect(() => {
    localStorage.setItem("folderColors", JSON.stringify(folderColors));
  }, [folderColors]);

  useEffect(() => {
    if (colorPickerFor === null) return;
    const handleDown = (event) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target)
      ) {
        setColorPickerFor(null);
      }
    };
    document.addEventListener("mousedown", handleDown);
    return () => document.removeEventListener("mousedown", handleDown);
  }, [colorPickerFor]);

  const setFolderColor = (name, hex) => {
    setFolderColors((prev) => {
      const next = { ...prev };
      if (hex) next[name] = hex;
      else delete next[name];
      return next;
    });
    setFooterColor(hex || null);
  };

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
    const item = entries.find((e) => e.id === id);
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

  const updateItemArchived = async (id, archived) => {
    try {
      await updateEntry(id, { archived });
    } catch (error) {
      console.error("Archive update failed:", error);
    }
  };

  if (authLoading) {
    return (
      <div
        className="app-container"
        style={{ justifyContent: "center", alignItems: "center" }}
      >
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
            <div className="logo" onClick={goHome} title="Go home">
              <div className="logo-icon">ZS</div>
              <div className="logo-copy">
                <h1>ZenShelf</h1>
                <p className="logo-subtitle">
                  Curate and revisit your best links
                </p>
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
                  onClick={() => setSearchQuery("")}
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
                onClick={() => {
                  setEditingEntry(null);
                  setIsFormOpen(true);
                }}
              >
                <Plus size={18} />
                <span>Add Link</span>
              </button>

              <div className="view-toggle-group">
                <button
                  onClick={() => setViewMode("card")}
                  className={`header-icon-btn ${viewMode === "card" ? "active" : ""}`}
                  title="Grid view"
                  aria-label="Switch to grid view"
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`header-icon-btn ${viewMode === "list" ? "active" : ""}`}
                  title="List view"
                  aria-label="Switch to list view"
                >
                  <List size={18} />
                </button>
              </div>

              <button
                onClick={() => setShowArchived((prev) => !prev)}
                className={`header-icon-btn archive-toggle-btn ${showArchived ? "active" : ""}`}
                title={showArchived ? "Hide archived" : "Show archived"}
                aria-label={showArchived ? "Hide archived" : "Show archived"}
              >
                <Archive size={18} />
                {!showArchived &&
                  entries.filter((i) => i.archived === true).length > 0 && (
                    <span className="archive-count-badge">
                      {entries.filter((i) => i.archived === true).length}
                    </span>
                  )}
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
                title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              >
                {theme === "light" ? "☀️" : "🌙"}
              </button>

              <div
                className="user-profile"
                title={user.displayName || user.email}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="user-avatar"
                  />
                ) : (
                  <User size={18} />
                )}
                <span className="user-name">
                  {user.displayName?.split(" ")[0] || "User"}
                </span>
                <button onClick={logout} className="logout-btn" title="Logout">
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main
        className={`main-content ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}
      >
        {sidebarCollapsed && (
          <button
            type="button"
            className="sidebar-expand-btn"
            onClick={() => setSidebarCollapsed(false)}
            title="Expand sidebar"
            aria-label="Expand sidebar"
            aria-expanded={false}
          >
            <PanelLeftOpen size={18} />
          </button>
        )}
        <aside className="sidebar">
          <nav className="filter-nav status-nav">
            <div className="filter-nav-header">
              <h3>Status</h3>
              <button
                type="button"
                className="sidebar-toggle"
                onClick={() => setSidebarCollapsed(true)}
                title="Minimize sidebar"
                aria-label="Minimize sidebar"
                aria-expanded={true}
              >
                <PanelLeftClose size={16} />
              </button>
            </div>
            <button
              className={`filter-btn ${filterStatus === "All" ? "active" : ""}`}
              onClick={() => setFilterStatus("All")}
            >
              All Links
            </button>
            {STATUSES.map((status) => (
              <button
                key={status}
                className={`filter-btn ${filterStatus === status ? "active" : ""}`}
                onClick={() => setFilterStatus(status)}
              >
                {status}
              </button>
            ))}
          </nav>

          {allTags.length > 0 && (
            <nav className="filter-nav">
              <h3>Tags</h3>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  className={`filter-btn filter-btn-tag ${filterTag === tag ? "active" : ""}`}
                  onClick={() =>
                    setFilterTag((prev) => (prev === tag ? null : tag))
                  }
                >
                  {tag}
                </button>
              ))}
            </nav>
          )}

          <div className="stats-card">
            <h4>Shelf Stats</h4>
            <div className="stat-item">
              <span className="stat-label">Total Items</span>
              <span className="stat-value">{entries.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Pending</span>
              <span className="stat-value">
                {entries.filter((i) => i.status === "Pending").length}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Archived</span>
              <span className="stat-value">
                {entries.filter((i) => i.archived === true).length}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Read</span>
              <span className="stat-value">
                {entries.filter((i) => i.status === "Read").length}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">In Progress</span>
              <span className="stat-value">
                {entries.filter((i) => i.status === "In Progress").length}
              </span>
            </div>
          </div>
        </aside>

        <div className="content-column">
          <LayoutGroup id="shelf-layout">
            {showArchived && (
              <div className="archive-mode-banner">
                <div className="archive-mode-banner-left">
                  <Archive size={16} />
                  <span>
                    Viewing{" "}
                    <strong>
                      {entries.filter((i) => i.archived === true).length}
                    </strong>{" "}
                    archived link
                    {entries.filter((i) => i.archived === true).length !== 1
                      ? "s"
                      : ""}
                  </span>
                </div>
                <button
                  className="archive-back-btn"
                  onClick={() => setShowArchived(false)}
                >
                  ← Back to All Links
                </button>
              </div>
            )}
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
            ) : activeFolder === null ? (
              /* ── Folder browser: click a folder to go inside ── */
              <motion.section
                className="folder-browser-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {folderGroups.map(({ name, items }) => {
                  const isNone = name === FOLDER_NONE;
                  const label = isNone ? "Unfiled" : name;
                  const accent = folderColors[name];
                  return (
                    <motion.div
                      layout
                      role="button"
                      tabIndex={0}
                      key={name}
                      className={`folder-tile ${isNone ? "unfiled" : ""} ${accent ? "colored" : ""}`}
                      style={accent ? { "--folder-accent": accent } : undefined}
                      onClick={() => setActiveFolder(name)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setActiveFolder(name);
                        }
                      }}
                      title={`Open “${label}”`}
                      whileHover={{
                        y: -2,
                        transition: {
                          type: "tween",
                          duration: 0.15,
                          ease: "easeOut",
                        },
                      }}
                    >
                      <div
                        className="folder-color-control"
                        ref={colorPickerFor === name ? colorPickerRef : null}
                      >
                        <button
                          type="button"
                          className="folder-color-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setColorPickerFor(
                              colorPickerFor === name ? null : name,
                            );
                          }}
                          onDoubleClick={(e) => e.stopPropagation()}
                          title="Customize folder color"
                          aria-label="Customize folder color"
                        >
                          <Palette size={15} />
                        </button>
                        <AnimatePresence>
                          {colorPickerFor === name && (
                            <motion.div
                              className="folder-color-popover"
                              initial={{ opacity: 0, y: -6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              transition={{ duration: 0.14 }}
                              onClick={(e) => e.stopPropagation()}
                              onDoubleClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                className={`folder-swatch none ${!accent ? "active" : ""}`}
                                onClick={() => {
                                  setFolderColor(name, null);
                                  setColorPickerFor(null);
                                }}
                                title="Default"
                                aria-label="Default color"
                              >
                                <span className="null-indicator">∅</span>
                              </button>
                              {FOLDER_COLOR_OPTIONS.map(({ value, hex }) => (
                                <button
                                  key={value}
                                  type="button"
                                  className={`folder-swatch ${accent === hex ? "active" : ""}`}
                                  style={{ "--swatch": hex }}
                                  onClick={() => {
                                    setFolderColor(name, hex);
                                    setColorPickerFor(null);
                                  }}
                                  title={value}
                                  aria-label={value}
                                />
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="folder-tile-icon">
                        <div className="folder-graphic">
                          <span className="folder-graphic-back" />
                          <span className="folder-graphic-paper" />
                          <span className="folder-graphic-front" />
                        </div>
                      </div>
                      <div className="folder-tile-body">
                        <span className="folder-tile-name">{label}</span>
                        <span className="folder-tile-count">
                          {items.length} link{items.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.section>
            ) : (
              /* ── Inside a folder: its links + a way back ── */
              <>
                <div className="folder-crumb-bar">
                  <button
                    type="button"
                    className="folder-back-btn"
                    onClick={() => setActiveFolder(null)}
                  >
                    <ChevronLeft size={16} />
                    <span>Folders</span>
                  </button>
                  <div className="folder-crumb-title">
                    <FolderOpen
                      size={18}
                      className="folder-section-icon"
                      style={
                        folderColors[activeFolder]
                          ? { color: folderColors[activeFolder] }
                          : undefined
                      }
                    />
                    <span
                      className={activeFolder === FOLDER_NONE ? "unfiled" : ""}
                    >
                      {activeFolder === FOLDER_NONE ? "Unfiled" : activeFolder}
                    </span>
                    <span className="folder-section-count">
                      {activeGroup.items.length}
                    </span>
                  </div>
                </div>

                {activeGroup.items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="empty-state"
                  >
                    <div className="empty-icon">
                      <Folder size={48} strokeWidth={1} />
                    </div>
                    <h3>Nothing here</h3>
                    <p>This folder has no links matching the current view.</p>
                  </motion.div>
                ) : (
                  <motion.section
                    key={activeFolder}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className={`shelf-grid ${viewMode === "list" ? "list-view" : "card-view"}`}
                  >
                    <AnimatePresence mode="popLayout">
                      {activeGroup.items.map((item, index) => (
                        <UrlCard
                          key={item.id}
                          item={item}
                          cardIndex={index}
                          viewMode={viewMode}
                          onEdit={startEditing}
                          onDelete={handleDeleteClick}
                          onStatusUpdate={updateItemStatus}
                          onArchiveToggle={updateItemArchived}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.section>
                )}
              </>
            )}
          </LayoutGroup>
        </div>
      </main>

      <footer
        style={{
          padding: "2rem",
          textAlign: "center",
          opacity: footerColor ? 0.85 : 0.5,
          fontSize: "0.8rem",
          color: footerColor || undefined,
          transition: "color 0.25s ease, opacity 0.25s ease",
        }}
      >
        <p>© 2026 URL Content Tracker • Built with React 19 & Firebase</p>
      </footer>

      <AnimatePresence>
        {isFormOpen && (
          <UrlForm
            onSubmit={handleAddOrUpdate}
            onClose={() => {
              setEditingEntry(null);
              setIsFormOpen(false);
            }}
            editingEntry={editingEntry}
            existingFolders={allFolders}
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
