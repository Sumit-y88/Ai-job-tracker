# 🎯 JobTrackr — AI-Powered Job Application Tracker

<div align="center">

![JobTrackr Banner](https://img.shields.io/badge/JobTrackr-AI%20Powered-6366f1?style=for-the-badge&logo=briefcase&logoColor=white)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://ai-job-tracker-5zrn.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://ai-job-tracker-k4og.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Sumit--y88-181717?style=for-the-badge&logo=github)](https://github.com/Sumit-y88/Ai-job-tracker)

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-0055FF?style=flat-square&logo=framer&logoColor=white)

</div>

---

## 📸 Screenshots

> **Dashboard — Dark Mode**
> *(Add screenshot here)*

> **Job Detail + AI Cover Letter — Light Mode**
> *(Add screenshot here)*

> **Landing Page**
> *(Add screenshot here)*

---

## ✨ Features

- 🤖 **AI Match Scoring** — Paste any job description and get an instant 0–100 match score against your resume, with specific strengths and skill gaps highlighted
- ✍️ **AI Cover Letter Generation** — Generate personalized, tailored cover letters in seconds. Choose from Formal, Friendly, or Assertive tone
- 📊 **Smart Dashboard** — Visual charts showing application trends, status breakdowns, and weekly activity
- 📁 **Application Tracking** — Track every job with status updates (Saved → Applied → Interviewing → Offered → Rejected)
- 🔐 **Google OAuth + Email Auth** — Sign in with Google in one click or register with email and password
- 🌓 **Light & Dark Mode** — Fully themed interface that persists your preference
- 📝 **Resume Hub** — Store your resume once, used automatically across all AI features
- 📋 **Notes & Auto-save** — Add notes to any job, auto-saved on blur
- 📱 **Fully Responsive** — Works beautifully on mobile, tablet, and desktop

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite + TypeScript | Core framework |
| Tailwind CSS v3 | Styling |
| Framer Motion | Animations |
| React Router v6 | Routing |
| Zustand | State management |
| React Hook Form + Zod | Forms & validation |
| Recharts | Dashboard charts |
| Axios | HTTP client |
| Radix UI | Accessible primitives |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | Server framework |
| MongoDB + Mongoose | Database |
| JWT + bcryptjs | Authentication |
| Passport.js | Google OAuth 2.0 |
| Gemini AI API | Cover letter & match scoring |
| express-rate-limit | Rate limiting |
| helmet + cors | Security |

### Deployment
| Service | Purpose |
|---|---|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| MongoDB Atlas | Cloud database |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB running locally (or MongoDB Atlas URI)
- Gemini API key — [Get one here](https://aistudio.google.com/app/apikey)
- Google OAuth credentials — [Google Cloud Console](https://console.cloud.google.com)

### 1. Clone the repository

```bash
git clone https://github.com/Sumit-y88/Ai-job-tracker.git
cd Ai-job-tracker
```

### 2. Install dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 3. Configure environment variables

**Backend — create `backend/.env`:**

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/job-tracker
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Frontend — create `frontend/.env`:**

```env
VITE_API_URL=http://localhost:5000
```

### 4. Run the app

```bash
# From the root directory — runs both frontend and backend
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5000`

---

## 🌐 Deployment

### Frontend → Vercel

1. Push to GitHub
2. Import repo in [Vercel](https://vercel.com)
3. Set root directory to `frontend`
4. Add environment variable: `VITE_API_URL=https://your-render-url.onrender.com`
5. Deploy

> **Important:** Create `frontend/vercel.json` to fix client-side routing:
> ```json
> {
>   "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
> }
> ```

### Backend → Render

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repo, set root directory to `backend`
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add all environment variables from `backend/.env`
6. Set `NODE_ENV=production`

### Database → MongoDB Atlas

1. Create a free M0 cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Whitelist `0.0.0.0/0` under Network Access
3. Copy the connection string into `MONGO_URI` on Render

### Google OAuth — Production Setup

In [Google Cloud Console](https://console.cloud.google.com) → Credentials → your OAuth Client:

**Authorised JavaScript Origins:**
```
https://your-app.vercel.app
http://localhost:5173
```

**Authorised Redirect URIs:**
```
https://your-api.onrender.com/api/auth/google/callback
http://localhost:5000/api/auth/google/callback
```

---

## 📁 Project Structure

```
Ai-job-tracker/
├── backend/
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   └── passport.js         # Google OAuth strategy
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   └── coverLetterController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── validateMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   └── CoverLetter.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   └── coverLetterRoutes.js
│   ├── services/
│   │   └── geminiService.js    # All AI API calls
│   ├── validators/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/             # Button, Input, Modal, Toast...
│   │   │   ├── effects/        # Animations, backgrounds
│   │   │   ├── layout/         # Sidebar, Navbar
│   │   │   ├── jobs/           # JobCard, JobForm, JobFilters
│   │   │   ├── dashboard/      # StatCard, Charts
│   │   │   └── coverLetter/    # CoverLetterPanel, ToneSelector
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── JobsPage.tsx
│   │   │   ├── JobDetailPage.tsx
│   │   │   └── ProfilePage.tsx
│   │   ├── store/              # Zustand stores
│   │   ├── hooks/              # Custom hooks
│   │   ├── lib/                # Axios, validators, cn()
│   │   └── types/              # TypeScript interfaces
│   └── vercel.json
│
└── package.json                # Root scripts (concurrently)
```

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register with email | ❌ |
| POST | `/api/auth/login` | Login with email | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |
| PATCH | `/api/auth/me` | Update profile & resume | ✅ |
| GET | `/api/auth/google` | Initiate Google OAuth | ❌ |
| GET | `/api/auth/google/callback` | Google OAuth callback | ❌ |

### Jobs
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/jobs` | Get all jobs (with filters) | ✅ |
| POST | `/api/jobs` | Create job + AI match score | ✅ |
| GET | `/api/jobs/:id` | Get single job | ✅ |
| PATCH | `/api/jobs/:id` | Update job | ✅ |
| DELETE | `/api/jobs/:id` | Delete job + cover letter | ✅ |

### Cover Letters
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/cover-letters/generate` | Generate AI cover letter | ✅ |
| GET | `/api/cover-letters/job/:jobId` | Get cover letter for job | ✅ |
| PATCH | `/api/cover-letters/:id/finalize` | Mark as final | ✅ |
| DELETE | `/api/cover-letters/:id` | Delete cover letter | ✅ |

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Sumit Yadav**  
[![GitHub](https://img.shields.io/badge/GitHub-Sumit--y88-181717?style=flat-square&logo=github)](https://github.com/Sumit-y88)

---

<div align="center">

⭐ **If you found this project helpful, please give it a star!** ⭐

Made with ❤️ and lots of ☕

</div>