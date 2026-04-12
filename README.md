
# 🎤 AI Interview Platform — Frontend (React)

Modern React frontend for the real-time voice-based AI Interview Platform. Built with React, React Router, and Tailwind CSS, it provides a seamless experience for both **individual users** practicing interviews and **organizations** conducting automated AI candidate interviews.

---

## ✨ Features

### 👤 For Individual Users
- Practice interviews with AI interviewer
- Upload and use your CV for personalized questions
- Real-time voice + avatar interview experience
- View interview history and detailed results
- Profile management and configuration

### 🏢 For Organizations
- Create and manage AI interview campaigns
- Send automated interview invites via email
- Track candidate progress (pending / completed)
- View detailed interview results and evaluations
- Team dashboard with analytics

### 🎙️ Core Interview Experience
- Real-time voice interaction via **LiveKit (WebRTC)**
- AI-powered interviewer with natural conversation flow
- Beautiful animated avatar with lip-sync (Simli)
- Smooth fallback to voice-only mode
- Automatic redirect after interview completion
- 3-day grace period to retake unfinished interviews

---

## 🛠️ Tech Stack

- **React 18** + TypeScript
- **React Router v6** — File-based routing
- **Tailwind CSS** — Styling
- **Vite** — Build tool
- **HttpOnly Cookies + JWT** — Authentication
- **LiveKit** — Real-time WebRTC communication

---

## 📁 Project Structure Highlights

```tsx
src/
├── screens/
│   ├── Landing.tsx              # Public landing page
│   ├── Login.tsx / Register.tsx
│   ├── LoginOrg.tsx / RegisterOrg.tsx
│   ├── HomePage.tsx             # Dashboard overview
│   ├── Dashboard.tsx            # Interview history & results
│   ├── StartInterview.tsx       # Start personal interview
│   ├── MeetingRoom.tsx          # Live interview room (voice + avatar)
│   ├── InterviewOver.tsx
│   ├── InterviewResults.tsx
│   ├── Profile.tsx
│   ├── Configure.tsx
│   └── ProtectedRoute.tsx
├── components/
│   ├── LoadingSpinner.tsx
│   └── ... (modals, cards, etc.)
└── App.tsx
```

---

## 🔀 User Flows

### 1. Individual User Flow (Practice Mode)
1. User logs in → goes to `/username/home`
2. Clicks **"Start Interview"**
3. Redirected to `/start-interview/:roomName`
4. Then enters `/meeting-room/:roomName`
5. After interview → redirected to homepage with results

### 2. Organization / Candidate Flow
1. Company sends invite link via email
2. Candidate clicks link → lands on `/start-interview/:roomName`
3. Joins meeting room directly
4. After completion:
   - Candidate sees modal: *"You will hear from HR soon"*
   - Company can view results in their dashboard

### 3. Dashboard
- **Personal Users**: See their own past interviews + results
- **Organizations**: See all candidates with status:
  - Pending (not started)
  - In Progress
  - Completed
  - Expired (after 3 days)

---

## 🔐 Authentication

- **JWT stored in HttpOnly cookies** (secure)
- All API requests use `credentials: "include"`
- Automatic auth check on app load (`/me` endpoint)
- Separate login flows for users and organizations
- Protected routes using `<ProtectedRoute />`

---

## 🚀 Key Screens & Routes

| Route                            | Description                              | Access          |
|----------------------------------|------------------------------------------|-----------------|
| `/`                              | Landing Page                             | Public          |
| `/login` / `/register`           | User authentication                      | Public          |
| `/login-org` / `/register-org`   | Organization authentication              | Public          |
| `/:username/home`                | Home + Quick Start Interview             | Protected       |
| `/dashboard/:username`           | Interview history & results              | Protected       |
| `/start-interview/:roomName`     | Interview initialization                 | Public/Protected|
| `/meeting-room/:roomName`        | **Live AI Interview Room**               | Public/Protected|
| `/interview-over/:roomName`      | Interview completion screen              | Protected       |
| `/results`                       | Detailed interview results               | Protected       |
| `/:username/profile`             | User profile                             | Protected       |

---

## 🎨 UI/UX Highlights

- Clean, modern, professional design
- Real-time loading states and spinners
- Responsive design (mobile + desktop friendly)
- Smooth transitions between screens
- Clear separation between personal and organization modes
- Informative modals after interview completion
- Graceful handling of unfinished interviews (3-day redo window)

---

## 🧩 How It Works

- **Meeting Room**: Uses LiveKit to connect user and AI agent in the same room
- **Backend Communication**: All API calls include credentials for JWT cookie
- **State Management**: Local React state + backend-driven interview state
- **Post-Interview**: Automatic redirection + conditional modals based on user type

---

## 🏃‍♂️ Running the Frontend

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Make sure your `.env` file contains:

```env
VITE_BACKEND_URL=https://your-backend-url.com
```

---

## 🔗 Backend Repository

[Backend & Agent Worker Repository](https://github.com/reprobateboffin/Langgraph-voice-agent-backend) 

---

**Built for realistic, scalable, and delightful AI-powered interviews.**

