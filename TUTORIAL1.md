# Tutorial: Build ZenShelf From Scratch with Antigravity, Firebase, and GitHub

This guide is written for a complete beginner. If you follow it from top to bottom, you will end up with a working version of the ZenShelf web application: a responsive URL tracker built with React, Vite, Firebase Authentication, and Cloud Firestore.

The tutorial assumes you are using:

- Antigravity as your coding agent
- Node.js and npm on your computer
- Firebase for login and database
- GitHub for source control and optional deployment

If you have never built a web app before, that is okay. This guide explains what each tool does, what you need to click, what commands to run, and what to check before moving on.

## What You Will Build

ZenShelf is a web application where a signed-in user can:

- Save a URL
- Add a description and optional notes
- Assign a category
- Set a numeric priority
- Track a reading status such as `Pending`, `In Progress`, `Read`, or `Archived`
- Search, sort, edit, and delete entries
- Use the app on desktop, tablet, and mobile screens

## What Each Tool Does

- `Antigravity`: your AI coding assistant. You will use it to generate and refine the app.
- `Node.js`: lets you run JavaScript tools locally.
- `npm`: installs project dependencies such as React and Firebase.
- `Vite`: creates and serves the React app during development.
- `Firebase Authentication`: lets users sign in with Google.
- `Cloud Firestore`: stores each user’s entries in the cloud.
- `GitHub`: stores your code online and can deploy the app.

## Before You Start

You need these accounts and tools ready first:

- A Google account
- A GitHub account
- Node.js 18 or newer
- npm, which is included with Node.js
- Git
- Antigravity installed and working

## Step 1: Install Node.js

1. Go to [https://nodejs.org/](https://nodejs.org/).
2. Download the current LTS version.
3. Install it using the default options.
4. Open a terminal and confirm it worked:

```bash
node -v
npm -v
```

You should see version numbers printed for both commands.

If either command says “not found”, close and reopen the terminal and try again.

## Step 2: Install Git

1. Go to [https://git-scm.com/downloads](https://git-scm.com/downloads).
2. Install Git using the default options.
3. Verify it:

```bash
git --version
```

## Step 3: Install Firebase CLI

The Firebase CLI is the command-line tool that lets you connect your project to Firebase.

Run:

```bash
npm install -g firebase-tools
firebase --version
```

Then sign in:

```bash
firebase login
```

Your browser should open so you can sign in with your Google account.

## Step 4: Prepare Antigravity

Open Antigravity and make sure it is ready to work in your project folder.

### 4.1 Install the MCP servers you need

In Antigravity:

1. Open `Settings`
2. Go to the area where MCP servers can be added
3. Install these if available in your environment:
   - `Firebase`
   - `GitHub`
   - `Cloud Run` or deployment-related server if you plan to deploy beyond GitHub Pages
   - UI or design MCP servers such as `StitchMCP` or `21st.dev Magic` if you want design help

### 4.2 Install helpful skills or extensions

If your setup includes Gemini CLI extensions or agent skills, install the ones your team uses. For a Firebase-heavy build, make sure Antigravity has access to Firebase-related skills or guidance.

If your environment supports these commands, run them:

```bash
gemini extensions install https://github.com/gemini-cli-extensions/firebase/
gemini extensions install https://github.com/obra/superpowers
npx skills add firebase/agent-skills
```

If one of those commands is unavailable in your setup, skip it and continue. The app can still be built manually in Antigravity.

## Step 5: Create the Project Folder

In your terminal:

```bash
mkdir url-content-tracker
cd url-content-tracker
```

Open this folder in Antigravity.

This folder will contain the entire app.

## Step 6: Create the React App with Vite

Run this in the `url-content-tracker` folder:

```bash
npm create vite@latest . -- --template react
```

When it finishes, install the dependencies:

```bash
npm install
```

Then install the main libraries used in ZenShelf:

```bash
npm install firebase lucide-react
```

## Step 7: Start the App and Confirm the Baseline

Run:

```bash
npm run dev
```

Vite will print a local development URL, usually:

```text
http://localhost:5173
```

Open that URL in your browser. You should see the default Vite React starter app.

If you can see it, your local environment is ready.

## Step 8: Build the App Structure with Antigravity

At this point, you can let Antigravity help generate the app in stages. This is the easiest beginner path because it breaks the build into smaller, understandable steps.

### Prompt 1: Core app logic and local UI

Paste this into Antigravity:

> I want to build a React app using Vite called ZenShelf. It should be a URL tracker where users can save a URL, description, comments, category, numeric priority, color tag, and status. Use React hooks and build CRUD functionality first. Start with local state or local storage before connecting Firebase. Use Lucide React icons and keep the code organized into components and hooks.

What Antigravity should produce:

- A main app component
- A form component to add and edit entries
- A table or list component to display entries
- Search and sorting support
- A clean component structure such as `src/components` and `src/hooks`

Before moving on:

- Run `npm run dev`
- Verify you can add, edit, search, and delete items locally

### Prompt 2: Styling and responsiveness

Paste this into Antigravity:

> Style the ZenShelf app with vanilla CSS. Use a premium glassmorphism look with amber accents, dark and light theme support, smooth motion, and responsive layouts. Keep desktop strong, but make tablet and mobile layouts feel intentional. For tabular data, use a compact tablet view and a card-style mobile view instead of a squeezed table.

What Antigravity should improve:

- Global CSS variables
- Styled header and search bar
- Responsive form layout
- Responsive data list or table
- Better spacing, hover states, and mobile layout

Before moving on:

- Check desktop width
- Check tablet width around `768px` to `1024px`
- Check phone width around `375px` to `430px`

If something looks broken, be specific. Example:

> On mobile, the table still looks cramped. Change the row layout to cards and reduce visible metadata.

## Step 9: Create a Firebase Project

Now you will create the cloud backend.

### Option A: Use Antigravity and Firebase MCP

If your setup supports it, ask Antigravity:

> Help me create a Firebase project for ZenShelf, enable Firestore, and prepare it for React web app integration.

### Option B: Do it manually in the Firebase Console

1. Go to [https://console.firebase.google.com/](https://console.firebase.google.com/).
2. Click `Create a project`.
3. Name it something like `zenshelf-tracker`.
4. Continue through the setup screens.
5. You can disable Google Analytics if you do not need it.

When the project is created, stay in the Firebase Console.

## Step 10: Register the Web App in Firebase

1. Inside your Firebase project, click the Web icon `</>`.
2. Register a web app.
3. Give it a nickname, for example `ZenShelf Web`.
4. Click through the setup.

Firebase will show you a config object that contains values like:

- `apiKey`
- `authDomain`
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`

You will need these values for `src/firebase.js`.

## Step 11: Enable Google Authentication

This step is manual and important.

1. In Firebase Console, go to `Build` > `Authentication`.
2. Click `Get started`.
3. Open the `Sign-in method` tab.
4. Select `Google`.
5. Click `Enable`.
6. Choose a support email address.
7. Save.

If you skip this step, Google login will fail in the app.

## Step 12: Create the Firestore Database

1. In Firebase Console, go to `Build` > `Firestore Database`.
2. Click `Create database`.
3. Choose production mode if you are ready to use rules, or test mode only temporarily.
4. Pick a region, such as `us-central1`.
5. Finish setup.

## Step 13: Add Firebase to the App

Create or update `src/firebase.js` so it:

- Initializes the Firebase app
- Exports `auth`
- Exports a Google provider
- Exports Firestore

In this project, the app uses `initializeFirestore` with a persistent local cache so it works smoothly in the browser.

Your `src/firebase.js` should include:

- `initializeApp`
- `getAuth`
- `GoogleAuthProvider`
- `initializeFirestore`

After Antigravity generates the file, compare it to your Firebase config values and make sure your own project values are present.

Important beginner note:

- The config values are meant to identify your web app
- They are not the same thing as a private server secret
- Security comes from Firebase Authentication and Firestore Rules, not from hiding these values in the client UI

## Step 14: Add Google Sign-In Logic

Create a hook like `src/hooks/useAuth.js`.

It should:

- Listen for auth state changes with `onAuthStateChanged`
- Expose the signed-in user
- Expose a loading state
- Provide a `loginWithGoogle` function using `signInWithPopup`
- Provide a `logout` function

What to verify:

- When the app loads, signed-out users see a login screen
- Clicking the Google sign-in button opens a popup
- After login, the user lands inside the app

## Step 15: Add Firestore CRUD Logic

Create a hook like `src/hooks/useFirestore.js`.

This hook should:

- Read from a collection called `entries`
- Filter records to the current user with `where('userId', '==', userId)`
- Sort newest first with `orderBy('createdAt', 'desc')`
- Use `onSnapshot` for live updates
- Provide `addEntry`, `updateEntry`, and `deleteEntry`

Important data shape:

Every document you create in Firestore must include:

- `userId`
- `url`
- `description`
- `comments` if used
- `category`
- `priority`
- `status`
- `colorCode`
- `createdAt`

Why `userId` matters:

- The UI uses it to fetch only the signed-in user’s entries
- Firestore rules use it to decide who is allowed to read and write

## Step 16: Add Firestore Security Rules

Create or update `firestore.rules`.

This project uses a single collection named `entries`, and each document stores the owner’s `userId`.

The rules should allow:

- Signed-in users to create a document only if `request.resource.data.userId == request.auth.uid`
- Signed-in users to read, update, or delete only documents where `resource.data.userId == request.auth.uid`

In simple words:

- You can only create your own records
- You can only read your own records
- You can only edit or delete your own records

After updating the rules, deploy them:

```bash
firebase deploy --only firestore:rules
```

If Firebase asks you to initialize the project locally first, run:

```bash
firebase init firestore
```

Choose your existing Firebase project when prompted.

## Step 17: Connect the UI to Firebase

Now update the app so it uses:

- `useAuth()` for login state
- `useFirestore(user?.uid)` for data

Your app should behave like this:

- If auth is still loading, show a loading state
- If there is no user, show the login screen
- If the user is signed in, show the main app
- Adding, editing, and deleting should update Firestore

## Step 18: Test the Complete App Locally

Run:

```bash
npm run dev
```

Then test this checklist:

1. The login screen appears when signed out.
2. Google sign-in works.
3. You can add a new entry.
4. The entry appears without refreshing the page.
5. You can edit the entry.
6. You can delete the entry.
7. Search works.
8. Sorting works.
9. The layout works on phone and tablet widths.
10. Refreshing the browser keeps you signed in.

## Step 19: Build for Production

Run:

```bash
npm run build
```

If it succeeds, Vite will create a `dist` folder.

That means the app is ready to deploy.

## Step 20: Save the Project in Git

Inside the project folder:

```bash
git init
git add .
git commit -m "Build ZenShelf app"
```

If Git says your name or email is not configured, set them:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

Then run the commit again.

## Step 21: Create the GitHub Repository

1. Go to [https://github.com/](https://github.com/).
2. Click `New repository`.
3. Name it `url-content-tracker`.
4. Create the repository.

Then connect your local project:

```bash
git branch -M main
git remote add origin https://github.com/<your-username>/url-content-tracker.git
git push -u origin main
```

Replace `<your-username>` with your real GitHub username.

## Step 22: Optional Deployment to GitHub Pages

If you want to publish the app on GitHub Pages:

1. In GitHub, open your repository.
2. Go to `Settings` > `Pages`.
3. Under deployment source, choose `GitHub Actions`.

Then ask Antigravity:

> Create a GitHub Actions workflow that builds this Vite app and deploys it to GitHub Pages whenever I push to main.

Important:

If your site URL will be:

```text
https://<your-username>.github.io/url-content-tracker/
```

then Vite usually needs a matching base path in `vite.config.js`.

Ask Antigravity:

> Update `vite.config.js` so the Vite base path is `/url-content-tracker/` for GitHub Pages deployment.

If you forget this, the app may deploy as a blank page.

## Suggested Project Structure

By the end of the tutorial, your project will usually look something like this:

```text
url-content-tracker/
  public/
  src/
    assets/
    components/
      Login.jsx
      Login.css
      SearchBar.jsx
      SearchBar.css
      UrlForm.jsx
      UrlForm.css
      UrlTable.jsx
      UrlTable.css
      DeleteConfirmModal.jsx
      DeleteConfirmModal.css
      TechStackModal.jsx
      TechStackModal.css
    hooks/
      useAuth.js
      useFirestore.js
      useLocalStorage.js
    App.jsx
    index.css
    firebase.js
    main.jsx
  firestore.rules
  package.json
  vite.config.js
```

## Common Problems and Fixes

### `npm` or `node` is not recognized

Node.js is not installed correctly, or your terminal needs to be restarted.

### The Google login popup closes and nothing happens

Check these:

- Google sign-in is enabled in Firebase Authentication
- Your Firebase config values in `src/firebase.js` are correct
- The browser is not blocking the popup

### Firestore says permission denied

Usually one of these is true:

- The user is not signed in
- The document is missing `userId`
- Firestore rules were not deployed
- The document’s `userId` does not match the signed-in user’s UID

### Firestore query needs an index

If Firebase asks for an index, follow the link in the error message to create it. This can happen when combining filters and ordering.

### The page is blank after deployment

For GitHub Pages, this is usually because `vite.config.js` does not have the correct `base` path.

### Changes do not show up in the browser

Try:

- Refreshing the browser
- Restarting `npm run dev`
- Checking the terminal for compile errors

## How to Ask Antigravity for Better Results

When something is not right, avoid saying only “it is broken.” Instead, explain:

- What you clicked
- What you expected
- What happened instead
- Whether it happens on desktop, tablet, or mobile

Examples:

> The add form saves the entry, but the modal does not close after submit.

> On tablet, the table is too cramped. Hide low-priority columns and reduce cell padding.

> Firestore says permission denied when I add a new item. Check whether `userId` is being written during document creation and whether my rules match the data shape.

## Beginner Glossary

- `Component`: a reusable UI building block in React.
- `Hook`: a React function that manages state or logic.
- `CRUD`: Create, Read, Update, Delete.
- `State`: data that changes while the app is running.
- `Props`: values passed from one component to another.
- `Authentication`: logging a user into the app.
- `Firestore`: Firebase’s cloud database.
- `Security Rules`: permissions that control who can access data.
- `Responsive design`: layouts that adapt to different screen sizes.
- `Build`: the optimized production version of the app.

## Final Checklist

Before you call the project complete, make sure all of these are true:

- Node.js, npm, Git, and Firebase CLI are installed
- The Vite React app runs locally
- Firebase project exists
- Google sign-in is enabled
- Firestore database exists
- `src/firebase.js` uses your real Firebase config
- Login works
- Entries save to Firestore
- Firestore rules protect user data
- Search and sorting work
- Desktop, tablet, and mobile layouts look good
- `npm run build` succeeds
- Code is pushed to GitHub

If you reach this point, you have built a complete full-stack web app from scratch.

---

Updated March 18, 2026 for the current ZenShelf codebase and beginner-friendly setup flow.
