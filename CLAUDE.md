# CLAUDE.md — ZenShelf (URL Content Tracker)

## Project Overview

ZenShelf is a personal link-curation web app. Authenticated users can save, organise, and track URLs with metadata like status, priority, category, and a reminder colour. Data is stored per-user in Firestore and synced in real time.

The app is branded **ZenShelf** in the UI (logo text `ZS`). The repo folder is named `url-content-tracker`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 (Vite) |
| Animation | Framer Motion |
| Icons | Lucide React |
| Backend / Auth | Firebase (Firestore + Google Auth) |
| Styling | Vanilla CSS (`index.css` + `App.css` + per-component CSS files) |
| Fonts | Bricolage Grotesque (headings), Outfit (body) — loaded via Google Fonts |

**No Tailwind. No CSS-in-JS. No component library.** All styling is plain CSS with custom properties.

---

## Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build production bundle
npm run build
```

---

## Project Structure

```
src/
├── main.jsx                  # Entry point
├── App.jsx                   # Root component — all state, routing, layout
├── App.css                   # All component-level styles (~1200 lines)
├── index.css                 # CSS custom properties (design tokens) + global reset
├── firebase.js               # Firebase app init, exports: auth, db, googleProvider
│
├── hooks/
│   ├── useAuth.js            # Google Sign-In, sign-out, onAuthStateChanged listener
│   ├── useFirestore.js       # Real-time entries CRUD (onSnapshot)
│   └── useLocalStorage.js    # Generic localStorage hook (used for theme/viewMode)
│
└── components/
    ├── UrlForm.jsx            # Add / Edit modal form
    ├── UrlCard.jsx            # Card and list-row display for a single entry
    ├── Login.jsx              # Google sign-in splash screen
    ├── SearchBar.jsx          # Search input (standalone, not currently wired into App)
    ├── DeleteConfirmModal.jsx # Confirmation dialog before deleting an entry
    ├── TechStackModal.jsx     # Info modal showing the tech stack
    └── *.css                  # Per-component CSS files
```

---

## Data Model

Firestore collection: **`entries`**

Each document belongs to one user, identified by `userId`.

```js
{
  userId: string,          // Firebase Auth UID — used to scope all queries
  url: string,             // Required
  title: string,
  description: string,
  status: 'Pending' | 'In Progress' | 'Read' | 'Archived',
  priority: 'Low' | 'Medium' | 'High',
  category: 'Read Later' | 'Work' | 'Personal' | 'Research' | 'Tech' | 'Inspiration',
  color: 'none' | 'red' | 'orange' | 'yellow' | 'green' | 'cyan' | 'blue' | 'purple',
  createdDate: string,     // YYYY-MM-DD (user-visible date)
  createdAt: string,       // ISO timestamp derived from createdDate (for ordering)
  updatedAt: string,       // ISO timestamp, set on every update
}
```

**Important:** `createdAt` is derived from `createdDate` (via `toCreatedAtIso`), not the server write time. The Firestore query orders by `createdAt` descending.

---

## Key Patterns

### Authentication gate
`App.jsx` checks `useAuth()`. While loading it shows a spinner. If no user, it renders `<Login />`. All Firestore calls require `userId`.

### Real-time sync
`useFirestore(userId)` opens a persistent `onSnapshot` listener. All CRUD operations (`addEntry`, `updateEntry`, `deleteEntry`) are async and call the Firebase SDK directly — there is **no optimistic local state**; the UI updates when Firestore fires the snapshot.

### Offline persistence
Firestore is initialised with `persistentLocalCache` + `persistentSingleTabManager`, so reads are available offline in a single-tab context.

### Filtering
Filtering by status and search query is done client-side in `App.jsx` with `useMemo` — there are no extra Firestore queries for filters.

### Theme & view mode
Both `theme` (`dark`/`light`) and `viewMode` (`card`/`list`) are persisted to `localStorage` and initialised via lazy state. Theme is applied by setting `data-theme` on `<html>`.

### Animations
Framer Motion `layout` + `layoutId` are used on every `UrlCard` so adding, deleting, and reordering animates smoothly. The shelf grid wraps everything in a `<LayoutGroup>`.

---

## Design System (CSS Custom Properties)

Defined in `src/index.css`. Dark mode is the default; light mode overrides via `[data-theme='light']`.

| Token | Purpose |
|---|---|
| `--bg-color` | Page background |
| `--surface-color` | Card / header surfaces |
| `--primary-color` | Sage green accent (#9aad99 dark / #7d8c7c light) |
| `--secondary-color` | Primary text / headings (#f3efe4 dark / #2c3333 light) |
| `--accent-color` | Warm amber highlight (#d4a373) |
| `--text-main` / `--text-muted` | Body and de-emphasised text |
| `--radius-sm/md/lg` | 8px / 16px / 24px |
| `--font-heading` | Bricolage Grotesque |
| `--font-body` | Outfit |
| `--status-*` | Background + text colours for each status badge |

All component styles live in `App.css`, prefixed with meaningful class names. There is no CSS module system.

---

## Component Notes

### `UrlCard`
- Renders in two modes controlled by `viewMode` prop: `'card'` (grid) or `'list'`
- The **reminder colour** (`item.color`) is rendered as a full-card diagonal gradient background with a matching coloured border and glow. `COLOR_HEX` maps color names → hex values.
- Status can be changed inline via a `<select>` dropdown on the card itself (calls `onStatusUpdate`).
- Priority badge classes are `low` / `medium` / `high`.

### `UrlForm`
- Used for both **Add** and **Edit** (controlled by `editingEntry` prop).
- `COLOR_OPTIONS` array drives the reminder colour swatch picker (8 options including `none`).
- `createdDate` defaults to today's local date. On edit, it restores from `entry.createdDate`.

### `useFirestore`
- Date handling: always store `createdDate` as `YYYY-MM-DD` and derive `createdAt` ISO string from it with noon UTC time (`T12:00:00`) to avoid timezone off-by-one issues.
- `updateEntry` only writes `createdDate` / `createdAt` if the caller explicitly includes `createdDate` in the payload.

---

## Adding New Entry Fields

1. Add the field to `initialFormState` in `UrlForm.jsx`.
2. Add a corresponding form control in the `UrlForm` render.
3. Display the field in `UrlCard.jsx` where appropriate.
4. The field is automatically persisted — `useFirestore.addEntry` spreads the entire `entry` object into Firestore.
5. For existing documents that lack the new field, handle `undefined` gracefully in the card (e.g. `item.newField || 'default'`).

---

## Firebase Project

- **Project ID:** `zenshelf-tracker-9f2b3`
- **Auth domain:** `zenshelf-tracker-9f2b3.firebaseapp.com`
- Auth provider: Google (popup flow)
- Firestore rules must allow read/write only when `request.auth.uid == resource.data.userId`

---

## Known Conventions / Gotchas

- **Do not use Tailwind** — all styling is plain CSS.
- **Do not add a router** — the app is a single view; state (form open/closed, modals) is managed locally in `App.jsx`.
- `SearchBar.jsx` exists as a standalone component but the search input is currently inlined directly in `App.jsx`'s header — the file is unused.
- Status strings use spaces (`'In Progress'`) but CSS class names strip spaces (`inprogress`): `status.replace(/\s+/g, '').toLowerCase()`.
- Entry ordering is always newest-first (Firestore query), with no client-side re-sort.
