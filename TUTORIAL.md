# Tutorial: Build and Deploy App using Antigravity with Agent Skills and MCP 🌌

Welcome! This tutorial will guide you through building a modern web application from scratch using **Antigravity** (AI Coding Agent), **Firebase** (Cloud Services), and **GitHub** (Version Control & CI/CD).

## 🛠️ Stage 1: Environment Setup
Before we start coding, we need to prepare our "Agentic" tools.

> [!NOTE]
> **Project Limits**: Most users have a limit on how many free Google Cloud projects they can own. If you get an error creating a project in Prompt 3, you may need to delete an old project or link a billing account (the Free Spark plan still applies).

### 1. Install Gemini CLI & Firebase Extension
The Gemini CLI brings terminal-based AI to your fingertips.
```bash
# Install the Firebase extension for Gemini CLI
gemini extensions install https://github.com/gemini-cli-extensions/firebase/
```

### 2. Configure Mandatory MCP Servers in Antigravity
The Model Context Protocol (MCP) gives your AI agent "hands" to manage your cloud infrastructure and UI designs.
1. Open **Antigravity**.
2. Go to **Settings** > **Antigravity settings** > **Customizations** > **Add MCP servers**.
3. Install the following servers from the MCP Store:
   - **StitchMCP**: For advanced UI generation.
   - **Cloud Run**: For containerized deployments.
   - **Firebase**: For project management and databases.
   - **GitHub**: For repo management and CI/CD.
   - **21st.dev Magic**: For premium UI components.

### 3. Install & Authenticate Firebase CLI
The Firebase CLI is the foundation for all cloud operations. Run these in your terminal:
```bash
# Install the Firebase tools globally
npm install -g firebase-tools

# Log in to your Google Account
firebase login
```

### 4. Add Firebase Agent Skills
Skills give the AI the "expertise" to write perfect Firebase code.
```bash
npx skills add firebase/agent-skills
```

---

## 🏗️ Stage 2: 3-Stage Development Prompts
### 0. Prepare Your Workspace
Before pasting the prompts, create a new folder for your project and open it in **Antigravity**.
```bash
mkdir url-content-tracker
cd url-content-tracker
```

### Prompt 1: The Soul (Logic & Data)
> "I want to build a 'ZenShelf' React application using Vite. Use Lucide icons. The app is a URL tracker where users can save links, **descriptions, status (Pending, In Progress, Read, Archived),** categories, and priority levels. Implement the core logic using React hooks (useState, useMemo) and local storage for now. Focus on a clean data structure and functional CRUD (Create, Read, Update, Delete) operations."
> *(**Invokes**: General Coding Assistant + local fs tools)*

### Prompt 2: The Vessel (Premium Design)
> "Now, give ZenShelf a 'Zen Deck' aesthetic. Use vanilla CSS for styling. Implement a high-end dark mode by default with glassmorphism effects, vibrant accents (amber/emerald), and smooth micro-animations. **The app must be fully responsive, with a card-based layout for mobile and a compact sticky header.** The search bar should be prominent with a subtle glow. **Add sorting for all columns, including Status.** Ensure every interaction, like a horizontal slide row hover effect, feels fluid and premium. Use a modern font like 'Inter' or 'Outfit'."
> *(**Invokes**: **21st.dev magic** & **StitchMCP** for UI system design and component inspiration)*

#### 🧪 Milestone: Visual Verification
1. If Antigravity hasn't already, run `npm install` to download dependencies.
2. Run `npm run dev` in your terminal. 
3. Open the provided local URL (usually `http://localhost:5173`).

You should see your URL tracker transformed into a beautiful, glowing 'Zen' interface. Don't move to Prompt 3 until you love how it looks!

### Prompt 3: The Cloud (Firebase Integration)
> "/firebase_init. Use the Firebase MCP tools to create a new project called 'ZenShelf Tracker'. **Provision a Firestore database in the '(default)' instance (region: us-central1).** Integrate Google Sign-In so each user has their own private workspace. Replace local storage with Cloud Firestore for real-time synchronization. Implement Security Rules so users can ONLY access their own data. Finally, use the 'Agent Skills' to ensure the code follows Firebase best practices for React 19."
> *(**Invokes**: **firebase-mcp-server** via slash command and terminal tools)*

---

### 🔓 Stage 2.5: The One Manual Step
Now that the AI has created your project, you need to enable Authentication manually in the console:
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your newly created **ZenShelf Tracker** project.
3. Go to **Build** > **Authentication** > **Get Started**.
4. In **Sign-in method**, select **Google** and click **Enable**. 
   *(**Why?**: The AI cannot do this for you because it requires your personal approval of Google's OAuth Terms of Service.)*

---

## 🚀 Stage 3: Automated Deployment (GitHub CI/CD)
Now we'll make sure your app deploys automatically whenever you push code.

1. **Create GitHub Repo**: Go to GitHub and create a new repository called `url-content-tracker`.
2. **Configure GitHub Pages**: In your repo, go to **Settings** > **Pages**. Under **Build and deployment**, change the **Source** to **GitHub Actions**.
3. **Initialize Git Local**:
   Run these commands in your local project terminal (replace `<your-username>` with your actual GitHub name):
   ```bash
   git init
   git add .
   git commit -m "first commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/url-content-tracker.git
   ```
4. **Configure Deployment Workflow**:
   Ask Antigravity:
   > "Create a GitHub Actions workflow that automatically builds and deploys my app to GitHub Pages whenever I push to the 'main' branch."
   > *(**Invokes**: **github-mcp-server** for repository management and workflow creation)*

5. **Deploy Your First Release**:
   Now that the workflow file exists, push your code to trigger the first deploy:
   ```bash
   git add .
   git commit -m "add deployment workflow"
   git push -u origin main
   ```

   > [!IMPORTANT]
   > **Vite & GitHub Pages (The "Base" Path)**: 
   > If your app is hosted at `https://<your-username>.github.io/url-content-tracker/`, Vite needs to know about the `/url-content-tracker/` subfolder.
   > 
   > Ask Antigravity:
   > *"Update my vite.config.js to set the 'base' to '/url-content-tracker/' so that it builds correctly for GitHub Pages."*
   > 
   > This is the #1 reason why beginners see a blank white page after deploying!

## ✨ Stage 4: Polishing & Mobile Optimization
Once the core app is running in the cloud, it's time to refine the user experience for all devices.

### 1. Advanced Sorting
Users can now sort their curation by **Priority** (numeric), **Category** (alphabetical), and **Status** (alphabetical). 
- **Status Sorting**: Crucial for tracking your progress through "Read" or "Archived" items.
- **Micro-Animations**: Table rows now feature a horizontal slide effect on hover, providing instant visual feedback.

### 2. Mobile-First Experience
ZenShelf is designed to be fully functional on the go.
- **Card View**: On mobile devices, rows automatically transform into beautiful, easy-to-read cards.
- **Adaptive Forms**: Complex grids switch to a single-column layout on small screens for easy input.
- **Responsive Header**: Actions like "Add New" and "Theme Toggle" dynamically adjust their labels or stack to stay within reach.

---

## 📚 Important Concepts for Beginners
- **Agent Skills (The "Brain")**: These provide the AI with **authoritative expertise** on specific technologies like Firebase. They ensure the code follow the latest best practices, preventing bugs and security vulnerabilities.
- **MCP Server (The "Hands")**: This is the **bridge** that gives the AI the **capability** to perform real-world actions (like creating a database, repository, or UI design) through specialized tools.
- **Slash Commands (e.g., `/firebase_init`)**: These are shortcuts provided by the **Firebase MCP server**. When you type them, the AI knows exactly which specialized tool to use to configure your project.
- **Optimistic UI**: A trick where the app *appears* to finish an action (like deleting a row) instantly, while it syncs with the database in the background.
- **Responsive Transformation**: The technique of switching from a data table to a card-based layout to maintain usability on vertical mobile screens.

## 🐞 Solving UI Glitches
AI isn't perfect! If you see a button that doesn't work or a window that's clipped (like a modal hiding at the bottom), just tell Antigravity exactly what you see:
> "The tech stack modal is partially hidden at the bottom and I can't see the full content. Fix the CSS so it fits or scrolls properly."

---
*Created for the "Build and Deploy with Agent Skills and MCP" tutorial session. Updated March 2026 with Mobile & Sorting Enhancements.*
