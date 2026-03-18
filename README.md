# ZenShelf: URL Content Tracker 🌌

**ZenShelf** is a minimalist, intelligence-focused URL tracker designed for curation and focus. Built with a "Zen Deck" aesthetic, it helps you manage your digital library with ease and elegance.

![App Preview](file:///Users/senthilpalanivelu/.gemini/antigravity/brain/43116d99-a0d9-4d48-a350-e36e38db0965/tech_stack_modal_verification_1773814380280.png)

## ✨ Features

- **Cloud Synchronization**: Your data is stored in Firebase Cloud Firestore and synced across all your devices in real-time.
- **Google Authentication**: Secure and private login using Firebase Auth.
- **Optimistic UI**: Experience zero-latency interactions. Modals close instantly while data syncs in the background.
- **URL Curation**: Track URLs with categories, descriptions, priorities, and status (e.g., "Must Read", "Researching").
- **Zen Design**: A high-performance, responsive interface with Dark/Light mode support and smooth glassmorphism effects.
- **Instant Search & Sort**: Find anything in your collection with high-speed filtering and multi-column sorting.

## 🛠️ Tech Stack

- **Frontend Framework**: React 19
- **Build Tooling**: Vite 8 with `@vitejs/plugin-react`
- **Animations**: Framer Motion
- **Styling System**: Vanilla CSS with a custom token-based dark/light theme system
- **Icons**: Lucide React
- **Authentication**: Firebase Authentication with Google Sign-In
- **Database**: Cloud Firestore with realtime sync and persistent local cache
- **Deployment**: GitHub Pages via GitHub Actions CI/CD workflow

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- A Firebase Project (for the cloud features)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd url-content-tracker
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your Firebase credentials in `src/firebase.js`.
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🔒 Security
Data privacy is enforced via Firebase Security Rules. Each user can only read and write their own documents, ensuring a completely private sanctuary for your digital assets.

---
*Built with focus and intent.*
