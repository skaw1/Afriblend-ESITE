
# Developer Setup & Configuration Guide

This document provides a comprehensive guide for setting up, configuring, and contributing to the Afriblend E-commerce project.

## Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Local Development Setup](#2-local-development-setup)
3. [Firebase Configuration](#3-firebase-configuration)
4. [Vercel Deployment](#4-vercel-deployment)
5. [Git Workflow & Rules](#5-git-workflow--rules)

---

### 1. Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Node.js**: Version 18.x or higher.
- **npm**: Version 9.x or higher (usually comes with Node.js).
- **Git**: For version control.

---

### 2. Local Development Setup

Follow these steps to get the project running on your local machine.

1.  **Clone the Repository**
    ```sh
    git clone https://github.com/your-username/afriblend-esite.git
    cd afriblend-esite
    ```

2.  **Install Dependencies**
    ```sh
    npm install
    ```

3.  **Configure Environment Variables**
    - Create a new file named `.env` in the root of the project directory.
    - This file will store your Firebase configuration keys. **It should not be committed to Git.**
    - Add the following variable to your `.env` file, which you will populate in the next section:
      ```
      # This is a placeholder. You will get the actual value from Firebase.
      API_KEY="YOUR_GEMINI_API_KEY"
      ```

4.  **Run the Development Server**
    ```sh
    npm run dev
    ```
    The application will start and be accessible at `http://localhost:5173`.

---

### 3. Firebase Configuration

The project uses Firebase for its backend services (Database, Authentication, Storage).

1.  **Create a Firebase Project**
    - Go to the [Firebase Console](https://console.firebase.google.com/).
    - Click "Add project" and follow the on-screen instructions to create a new project.

2.  **Create a Web App**
    - Inside your new project, click the Web icon (`</>`) to add a new web app.
    - Give your app a nickname and click "Register app".

3.  **Enable Firebase Services**
    In the Firebase console sidebar, navigate to the "Build" section and enable the following services:
    - **Firestore Database**: Create a new database. Start in **test mode** for easy local development. You can secure it with rules later.
    - **Authentication**: Enable the **Email/Password** sign-in method.
    - **Storage**: Create a default storage bucket.

4.  **Get Firebase Config**
    - Go to your Project Settings (click the gear icon ⚙️ next to "Project Overview").
    - In the "Your apps" card, find your web app.
    - Click on the **SDK setup and configuration** section and select **Config**.
    - You will see a `firebaseConfig` object. This is what you need for your environment variable.
      ```javascript
      const firebaseConfig = {
        apiKey: "AIza...",
        authDomain: "your-project.firebaseapp.com",
        projectId: "your-project",
        storageBucket: "your-project.appspot.com",
        messagingSenderId: "...",
        appId: "1:..."
      };
      ```
    - The content of this object is what you need to put into the `services/firebase.ts` file.

---

### 4. Vercel Deployment

This project is optimized for deployment on [Vercel](https://vercel.com/).

1.  **Connect Your Repository**
    - Sign up or log in to Vercel.
    - Create a "New Project" and import your Git repository.

2.  **Configure Project Settings**
    - **Framework Preset**: Vercel should automatically detect **Vite**. If not, select it manually.
    - **Build and Output Settings**: The default settings should work correctly.
      - Build Command: `npm run build`
      - Output Directory: `dist`

3.  **Add Environment Variables**
    - In your Vercel project's settings, go to the "Environment Variables" section.
    - Add the `API_KEY` variable with the same value you used in your local `.env` file.
    - **Important**: This keeps your secret keys out of the public Git repository.

4.  **Deploy**
    - Click "Deploy". Vercel will build and deploy your project.
    - Future pushes to your connected Git branch (e.g., `main`) will automatically trigger new deployments.

---

### 5. Git Workflow & Rules

To maintain code quality and a stable production environment, please follow these guidelines.

#### Branching Strategy

-   **`main`**: This branch is the production branch. Direct pushes are disabled. All changes must come from pull requests.
-   **`develop`**: This is the primary development branch. Features are merged here for testing before being merged into `main`.
-   **Feature Branches**: Create a new branch from `develop` for every new feature or bugfix.
    -   Name your branches descriptively, e.g., `feature/product-filtering` or `fix/checkout-bug`.

#### Commit Messages

Use the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. This makes the commit history clean and easy to read.
-   **`feat:`**: A new feature.
-   **`fix:`**: A bug fix.
-   **`docs:`**: Documentation only changes.
-   **`style:`**: Changes that do not affect the meaning of the code (white-space, formatting, etc).
-   **`refactor:`**: A code change that neither fixes a bug nor adds a feature.
-   **`chore:`**: Changes to the build process or auxiliary tools.

**Example:**
```
feat: add dark mode toggle to header
```
```
fix: correct price calculation in shopping cart
```

#### Pull Request (PR) Process

1.  Push your feature branch to GitHub.
2.  Create a Pull Request from your feature branch into the **`develop`** branch.
3.  Add a clear title and description to your PR, explaining the changes.
4.  Once the PR is reviewed and approved, it will be merged into `develop`.
5.  Periodically, the `develop` branch will be merged into `main` to release new features to production.
