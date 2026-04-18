# 🎬 MovieRec - AI-Powered Movie Recommendation App

A modern movie discovery and recommendation platform built with React, TypeScript, and Tailwind CSS. Powered by the TMDB API.

**Created by [Aman Dubey](https://github.com/Amandubey9326)**

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-blue?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-6-purple?logo=vite)

---

## ✨ Features

### Core Features
- **🏠 Home Page** - Trending movies, top rated, and genre-based browsing
- **🔍 Smart Search** - Real-time search with debouncing and keyboard shortcuts (⌘K)
- **🎯 AI Recommendations** - Personalized suggestions based on your viewing history and favorites
- **📋 Movie Details** - Full info with trailers, cast, ratings, and more
- **❤️ Favorites** - Save movies you love with one click
- **📑 Watchlist** - Bookmark movies to watch later
- **📊 Dashboard** - View your stats, favorites, watchlist, and history

### Advanced Features
- **🤖 AI Movie Chatbot** - Natural language movie assistant ("Movies like Inception", "I'm feeling sad")
- **🎭 Mood-Based Recommendations** - Pick your mood, get perfect movie matches
- **🎬 Movie Trivia Quiz** - Test your movie knowledge with 10 random questions
- **🌙 Dark/Light Theme** - Toggle between themes
- **📱 PWA Support** - Install on your phone like a native app
- **🔐 Authentication** - Login/Signup with email and password

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or yarn
- A [TMDB API Key](https://www.themoviedb.org/settings/api) (free)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Amandubey9326/movie-recommendation-app.git
cd movie-recommendation-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:
```
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

4. **Start the development server**
```bash
npm run dev
```

5. **Open in browser**
```
http://localhost:5173
```

---

## 📱 How to Use

### 1. Sign Up / Login
- Create an account with your name, email, and password
- Login to access all features

### 2. Browse Movies
- **Home page** shows trending, top rated, and genre sections
- Click any movie card to see full details and trailers

### 3. Search Movies
- Go to **Search** page or press `⌘K` (Mac) / `Ctrl+K` (Windows)
- Type any movie name to find it instantly
- Use popular search suggestions for quick access

### 4. Get Recommendations
- Visit **Recommendations** page
- Filter by genre, year range, and minimum rating
- The more you browse and favorite, the better recommendations get

### 5. AI Movie Chatbot
- Go to **AI Chat** page
- Ask natural language questions like:
  - "Suggest an action movie"
  - "Movies like The Dark Knight"
  - "I'm feeling romantic"
  - "What's trending?"

### 6. Mood-Based Movies
- Visit **Mood** page
- Select your current mood (Happy, Sad, Excited, Scared, etc.)
- Get instant movie recommendations matching your vibe

### 7. Movie Quiz
- Go to **Quiz** page
- Answer 10 trivia questions about movie ratings and release years
- See your score and try to beat it

### 8. Manage Collections
- **Heart icon** on movie cards → Add to Favorites
- **Bookmark icon** on movie details → Add to Watchlist
- View all collections in your **Dashboard**

### 9. Install as Mobile App (PWA)
- Open the app on your phone browser
- **iOS**: Tap Share → "Add to Home Screen"
- **Android**: Tap the install prompt or browser menu → "Install app"

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 19 | UI Framework |
| TypeScript | Type Safety |
| Tailwind CSS 4 | Styling |
| Vite | Build Tool |
| React Router | Navigation |
| TMDB API | Movie Data |

---

## 📁 Project Structure

```
movie/
├── public/           # Static assets, PWA files
├── src/
│   ├── components/   # Reusable UI components
│   │   ├── common/   # Navbar, Footer, MovieCard, etc.
│   │   ├── dashboard/# Dashboard sections
│   │   ├── details/  # Movie detail components
│   │   ├── home/     # Home page sections
│   │   ├── recommendations/
│   │   └── search/
│   ├── context/      # React Context (Auth, Theme, User)
│   ├── hooks/        # Custom React hooks
│   ├── pages/        # Page components
│   ├── services/     # API and business logic
│   └── styles/       # Global styles
├── .env              # Environment variables
├── index.html        # Entry HTML
└── package.json
```

---

## 🔑 API Key Setup

1. Go to [TMDB](https://www.themoviedb.org/) and create a free account
2. Navigate to Settings → API
3. Request an API key (choose "Developer" option)
4. Copy the API key and add it to your `.env` file

---

## 🌐 Deployment

### Deploy on Vercel
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Import your repository
4. Set Root Directory to `movie`
5. Add environment variable: `VITE_TMDB_API_KEY`
6. Click Deploy

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Connect

- **GitHub**: [Amandubey9326](https://github.com/Amandubey9326)
- **X (Twitter)**: [Aman Dubey](https://x.com/home)
- **Instagram**: [amann.__03](https://www.instagram.com/amann.__03/)
- **Email**: amandubeycom2@gmail.com
