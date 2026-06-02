<div align="center">

# 📚 Study Pal

**Your all-in-one study companion

## 🌐 Live Demo

Check it out here → [study-pal-re48.vercel.app](https://study-pal-re48.vercel.app/)

---

## Screenshots
<img width="1366" height="601" alt="Screenshot (131)" src="https://github.com/user-attachments/assets/487a1d6f-ec66-474f-af12-d107f1f510ca" />
<img width="1366" height="599" alt="Screenshot (134)" src="https://github.com/user-attachments/assets/fd078114-8cf6-4a1b-acb3-1c1a99b01cff" />
<img width="1366" height="593" alt="Screenshot (135)" src="https://github.com/user-attachments/assets/82e64544-e2e0-45c9-8891-2849611b13b9" />
<img width="1366" height="604" alt="Screenshot (132)" src="https://github.com/user-attachments/assets/1d7f52ec-59bd-427c-bb1b-2e29595342a8" />


## ✨ About

Study Pal is a personal productivity web app designed to help students stay organized and focused. It brings together everything you need — notes, timetables, reminders, a planner, and group chat — all in one clean interface.

---

## 🚀 Features

- 📝 **Notes** — Write, save, and organize your study notes
- 🗓️ **Timetable** — Plan your weekly schedule at a glance
- ✅ **Reminders** — Never miss a deadline or important task
- 📅 **Planner** — Day-by-day planning to stay on track
- 💬 **Group Chat** — Collaborate and study with peers in real time
- 🔐 **Auth** — Secure login and signup powered by Supabase

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [React](https://reactjs.org/) | Frontend UI |
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [Supabase](https://supabase.com/) | Backend, database & auth |
| [Vercel](https://vercel.com/) | Deployment |

---

## 🏃 Running Locally

```bash
# Clone the repo
git clone https://github.com/Raheeba15/study-pal.git
cd study-pal

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Supabase URL and anon key to .env

# Start the dev server
npm run dev
```

### Environment Variables

Create a `.env` file in the root with:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 📁 Project Structure

```
study-pal/
├── src/
│   ├── screens/
│   │   ├── Dashboard.jsx
│   │   ├── Notes.jsx
│   │   ├── Timetable.jsx
│   │   ├── Planner.jsx
│   │   ├── Reminders.jsx
│   │   ├── Chat.jsx
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   ├── App.jsx
│   └── index.css
├── __tests__/
├── supabase/
└── public/
```
