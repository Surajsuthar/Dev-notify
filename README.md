# DevNotify 🚀

A GitHub tracker that notifies developers about issues from starred and trending repositories — so they stay updated and contribute faster.

## ✨ Features

- **GitHub Integration**: Connect your GitHub account and track starred repositories
- **Issue Tracking**: Monitor issues from your starred repositories
- **Repository Management**: View and manage all your repositories in one place
- **User Dashboard**: Comprehensive dashboard with tabs for repositories, issues, and user info

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Radix UI components
- **Authentication**: NextAuth.js with GitHub OAuth
- **Database**: PostgreSQL with Prisma ORM
- **External APIs**: GitHub API
- **Package Manager**: pnpm

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL database
- GitHub OAuth App

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd open-info
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/devnotify"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"

   # GitHub OAuth
   GITHUB_ID="your-github-oauth-app-id"
   GITHUB_SECRET="your-github-oauth-app-secret"

   ```

4. **Set up the database**

   ```bash
   pnpm db:push
   ```

5. **Run the development server**

   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 How It Works

### 1. Authentication

- Users sign in with their GitHub account using NextAuth.js
- The app requests necessary permissions to access starred repositories and create webhooks

### 2. Repository Tracking

- The app fetches your starred repositories from GitHub
- For each repository, it creates a webhook to monitor new issues
- If you don't have admin access to a repo, it forks the repository to set up webhooks

### 3. Issue Monitoring

- When new issues are created in tracked repositories, GitHub sends webhooks to the app
- The app processes these webhooks and identifies users tracking those repositories

---

Made with ❤️ for the developer community
