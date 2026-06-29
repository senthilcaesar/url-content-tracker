import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Trash2,
  Edit3,
  Tag,
  ChevronDown,
  CalendarDays,
  Archive,
  ArchiveRestore,
  Copy,
  Check,
  Folder,
} from "lucide-react";

const STATUSES = ["Pending", "In Progress", "Read"];

export function UrlCard({
  item,
  cardIndex = 0,
  viewMode = "card",
  onEdit,
  onDelete,
  onStatusUpdate,
  onArchiveToggle,
  folderEmojis = {},
}) {
  const enterDelay = Math.min(cardIndex * 0.08, 0.6);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleDown = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleDown);
    return () => document.removeEventListener("mousedown", handleDown);
  }, [dropdownOpen]);

  const motionProps = {
    initial: { opacity: 0, y: 32 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
        delay: enterDelay,
      },
    },
    exit: {
      opacity: 0,
      y: -12,
      transition: { duration: 0.2, ease: "easeIn", delay: 0 },
    },
  };

  const hoverTransition = {
    type: "spring",
    stiffness: 480,
    damping: 26,
    mass: 0.65,
  };

  const getPriorityMeta = (priority) => {
    if (typeof priority === "string") {
      const normalized = priority.toLowerCase();
      if (["low", "medium", "high"].includes(normalized)) {
        return {
          label: priority,
          className: normalized,
        };
      }
    }

    const numericPriority = Number(priority);
    if (!Number.isNaN(numericPriority)) {
      if (numericPriority >= 4) {
        return { label: `Priority ${numericPriority}`, className: "high" };
      }
      if (numericPriority >= 2) {
        return { label: `Priority ${numericPriority}`, className: "medium" };
      }
      return { label: `Priority ${numericPriority}`, className: "low" };
    }

    return { label: "Medium", className: "medium" };
  };

  const getFormattedDate = () => {
    const rawDate = item.createdDate || item.createdAt;
    if (!rawDate) return "Date unknown";

    const parsedDate = new Date(rawDate);
    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unknown";
    }

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(parsedDate);
  };

  const [copied, setCopied] = useState(false);

  const copyUrl = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(item.url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const statusClass = (item.status || "Pending")
    .replace(/\s+/g, "")
    .toLowerCase();
  const priorityMeta = getPriorityMeta(item.priority);
  const formattedDate = getFormattedDate();

  const COLOR_HEX = {
    red: "#ef4444",
    crimson: "#be123c",
    rose: "#f43f5e",
    pink: "#ec4899",
    fuchsia: "#d946ef",
    purple: "#a855f7",
    violet: "#8b5cf6",
    indigo: "#6366f1",
    blue: "#3b82f6",
    sky: "#0ea5e9",
    cyan: "#06b6d4",
    teal: "#14b8a6",
    emerald: "#10b981",
    green: "#22c55e",
    lime: "#84cc16",
    yellow: "#eab308",
    amber: "#f59e0b",
    orange: "#f97316",
    brown: "#78350f",
    slate: "#64748b",
    gray: "#9ca3af",
  };
  const accentColor =
    item.color && item.color !== "none" ? COLOR_HEX[item.color] : null;
  const accentStyle = accentColor
    ? {
        backgroundColor: `color-mix(in srgb, ${accentColor} 12%, var(--surface-color))`,
      }
    : {};

  if (viewMode === "list") {
    return (
      <motion.div
        {...motionProps}
        whileHover={{
          x: 4,
          transition: { type: "tween", duration: 0.08, ease: "easeOut" },
        }}
        className={`url-card list-view-card ${dropdownOpen ? "popover-open" : ""}`}
        style={accentStyle}
      >
        <div className="list-main">
          <div className="list-topline">
            <h3 className="card-title">{item.title || item.url}</h3>
            <div className="list-topline-meta">
              <span className={`priority-badge ${priorityMeta.className}`}>
                {priorityMeta.label}
              </span>
              <div className="status-dropdown" ref={dropdownRef}>
                <button
                  type="button"
                  className={`status-select-trigger ${statusClass} ${dropdownOpen ? "open" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setDropdownOpen(!dropdownOpen);
                  }}
                >
                  <span>{item.status || "Pending"}</span>
                  <ChevronDown size={13} className="status-chevron" />
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.12 }}
                      className="status-dropdown-menu"
                    >
                      {STATUSES.map((s) => {
                        const currentClass = s.replace(/\s+/g, "").toLowerCase();
                        return (
                          <li
                            key={s}
                            className={`status-dropdown-item ${currentClass} ${
                              item.status === s ? "selected" : ""
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onStatusUpdate(item.id, s);
                              setDropdownOpen(false);
                            }}
                          >
                            <span className="status-dot"></span>
                            <span>{s}</span>
                          </li>
                        );
                      })}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <p className="card-desc">
            {item.description || "No description provided."}
          </p>

          <div className="list-meta-row">
            {item.folder && (
              <span className="folder-tag">
                {folderEmojis[item.folder] ? (
                  <span className="card-folder-emoji" style={{ marginRight: "4px" }}>
                    {folderEmojis[item.folder]}
                  </span>
                ) : (
                  <Folder size={12} />
                )}
                {item.folder}
              </span>
            )}
            <span className="category-tag">
              <Tag size={12} />
              {item.category || "General"}
            </span>
            <span className="date-tag">
              <CalendarDays size={12} />
              {formattedDate}
            </span>
            {(item.tags || []).map((tag) => (
              <span key={tag} className="tag-chip">
                {tag}
              </span>
            ))}
            <div className="card-url">
              <ExternalLink size={14} />
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                {item.url}
              </a>
              <button
                className={`copy-url-btn${copied ? " copied" : ""}`}
                onClick={copyUrl}
                title={copied ? "Copied!" : "Copy URL"}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
              </button>
            </div>
          </div>
        </div>

        <div className="list-utility">
          <div className="card-actions">
            <button
              onClick={() => onArchiveToggle(item.id, !item.archived)}
              title={item.archived ? "Unarchive" : "Archive"}
              className={item.archived ? "archive-active" : ""}
            >
              {item.archived ? (
                <ArchiveRestore size={16} />
              ) : (
                <Archive size={16} />
              )}
            </button>
            <button onClick={() => onEdit(item)} title="Edit">
              <Edit3 size={16} />
            </button>
            <button onClick={() => onDelete(item.id)} title="Delete">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      {...motionProps}
      whileHover={{
        y: -6,
        transition: { type: "tween", duration: 0.08, ease: "easeOut" },
      }}
      className={`url-card ${viewMode === "list" ? "list-view-card" : ""} ${dropdownOpen ? "popover-open" : ""}`}
      style={accentStyle}
    >
      <div className="card-header">
        <span className={`priority-badge ${priorityMeta.className}`}>
          {priorityMeta.label}
        </span>
        <div className="card-actions">
          <button
            onClick={() => onArchiveToggle(item.id, !item.archived)}
            title={item.archived ? "Unarchive" : "Archive"}
            className={item.archived ? "archive-active" : ""}
          >
            {item.archived ? (
              <ArchiveRestore size={16} />
            ) : (
              <Archive size={16} />
            )}
          </button>
          <button onClick={() => onEdit(item)} title="Edit">
            <Edit3 size={16} />
          </button>
          <button onClick={() => onDelete(item.id)} title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="card-body">
        <h3 className="card-title">{item.title || item.url}</h3>
        <p className="card-desc">
          {item.description || "No description provided."}
        </p>
        {(item.tags || []).length > 0 && (
          <div
            className="card-tags"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "4px",
              margin: "6px 0",
            }}
          >
            {item.tags.map((tag) => (
              <span key={tag} className="tag-chip">
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="card-url">
          <ExternalLink size={14} />
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            {item.url}
          </a>
          <button className="copy-url-btn" onClick={copyUrl} title="Copy URL">
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>
        </div>
      </div>

      <div className="card-footer">
        <div className="card-meta">
          {item.folder && (
            <span className="folder-tag">
              {folderEmojis[item.folder] ? (
                <span className="card-folder-emoji" style={{ marginRight: "4px" }}>
                  {folderEmojis[item.folder]}
                </span>
              ) : (
                <Folder size={12} />
              )}
              {item.folder}
            </span>
          )}
          <span className="category-tag">
            <Tag size={12} />
            {item.category || "General"}
          </span>
          <span className="date-tag">
            <CalendarDays size={12} />
            {formattedDate}
          </span>
        </div>
        <div className="status-dropdown" ref={dropdownRef}>
          <button
            type="button"
            className={`status-select-trigger ${statusClass} ${dropdownOpen ? "open" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              setDropdownOpen(!dropdownOpen);
            }}
          >
            <span>{item.status || "Pending"}</span>
            <ChevronDown size={13} className="status-chevron" />
          </button>
          <AnimatePresence>
            {dropdownOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.12 }}
                className="status-dropdown-menu"
              >
                {STATUSES.map((s) => {
                  const currentClass = s.replace(/\s+/g, "").toLowerCase();
                  return (
                    <li
                      key={s}
                      className={`status-dropdown-item ${currentClass} ${
                        item.status === s ? "selected" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusUpdate(item.id, s);
                        setDropdownOpen(false);
                      }}
                    >
                      <span className="status-dot"></span>
                      <span>{s}</span>
                    </li>
                  );
                })}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
