# ZenShelf: URL Content Tracker 🌌

ZenShelf is a premium, high-performance web application designed to help users track, categorize, and prioritize web content with a "Zen Deck" aesthetic.

## 🏗️ Technical Stack
- **Frontend**: React 19 + Vite
- **Styling**: Vanilla CSS (Glassmorphism, Dark Mode)
- **Icons**: Lucide React
- **Backend/Auth**: Google Firebase (Firestore, Google Sign-In)
- **State Management**: React Hooks (`useState`, `useMemo`, Custom Hooks)

## 📁 Key Files & Directories
- `src/App.jsx`: Main application controller and UI.
- `src/firebase.js`: Firebase initialization logic.
- `src/hooks/useAuth.js`: Custom hook for Google Authentication.
- `src/hooks/useFirestore.js`: Custom hook for CRUD operations with Firestore.
- `firestore.rules`: Security rules for user-specific data privacy.
- `TUTORIAL.md`: Step-by-step guide for building this app with Agent Skills & MCP.

## 🛠️ Development Guidelines
- **Aesthetics First**: Maintain the "Zen Deck" look (amber/emerald accents, glassmorphism).
- **Optimistic UI**: Modals should close immediately on action; sync happens in the background.
- **Privacy**: All Firestore queries MUST be scoped to the `auth.currentUser.uid`.
- **Frameworks**: Avoid adding CSS frameworks like Tailwind unless explicitly requested.

## 🚀 AI Agent Context
When working on this project, ensure you use the following tools:
- **Firebase MCP**: For infrastructure management.
- **Agent Skills**: `npx skills update --all` to ensure latest Firebase expertise.
- **Gemini CLI**: Use for terminal-based deployments.

---
*This file serves as the core context for AI assistants to understand the project architecture and design philosophy.*
