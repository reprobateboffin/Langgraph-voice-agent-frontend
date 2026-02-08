# 🌐 Frontend Implementation – React Interview Client

This frontend implements the **client-side interface** for the AI Interview system. It is built with **React + Vite** and communicates exclusively with the backend services (FastAPI and LiveKit) via HTTP and WebRTC.

The frontend is intentionally thin: it focuses on **user flow, session orchestration, and real-time interaction**, while all interview logic and reasoning remain on the backend.

---

## 📘 Table of Contents

1. Frontend Responsibilities
2. Application Routing
3. Interview Initialization Flow
4. Text-Based Interview Flow
5. Voice Interview Flow (LiveKit)
6. Data Exchange with Backend

---

## 1. Frontend Responsibilities

The frontend is responsible for:

* Collecting interview configuration data from the user
* Uploading CVs for backend processing
* Initiating interview sessions
* Displaying interview questions, responses, and feedback
* Connecting users to LiveKit rooms for voice interviews

All stateful interview logic, persistence, evaluation, and orchestration are handled by the backend.

---

## 2. Application Routing

Routing is implemented using **React Router**. Each route corresponds to a discrete screen in the interview lifecycle.

### Defined Routes

* `/` → Home page
* `/dashboard` → User dashboard and navigation
* `/configure` → Interview configuration screen
* `/start-interview` → Interview initialization
* `/messages-chat` → Text-based interview interface
* `/messages-voice` → Voice interview interface
* `/meeting-room` → LiveKit meeting room
* `/feedback` → Final feedback and evaluation view
* `/report` → Interview report generation

The routing layer does not contain interview logic; it only coordinates screen transitions.

---

## 3. Interview Initialization Flow

The interview begins in the **configuration and start flow**, where the frontend collects:

* Job title / role
* Question difficulty or type
* Optional CV upload
* Username (used for LiveKit identity)

Once collected, the frontend:

1. Sends the configuration data to the FastAPI backend.
2. Requests creation of a new interview session.
3. Receives session identifiers (e.g., thread ID or LiveKit token).

This flow is shared across both text-based and voice-based interviews.

---

## 4. Text-Based Interview Flow

For text interviews, the frontend:

* Sends interview initialization data to the backend
* Receives the first interview question
* Displays the question in the chat UI
* Sends user responses to the backend on each turn
* Renders subsequent questions or final evaluation

All conversational state is maintained server-side using LangGraph checkpoints.

---

## 5. Voice Interview Flow (LiveKit)

For voice interviews, the frontend performs the following steps:

1. Collects job title, difficulty, CV, username, and room name.
2. Sends this data to the backend join endpoint.
3. Receives a LiveKit access token and server URL.
4. Connects the user to the LiveKit room using WebRTC.

When the user joins the room:

* The backend dispatches the AI interviewer agent to the same room.
* The agent reads the embedded interview state from room metadata.
* The agent speaks the first interview question immediately.

The frontend’s role during the voice interview is limited to:

* Maintaining the WebRTC connection
* Rendering connection and session status
* Displaying optional transcripts or UI feedback

---

## 6. Data Exchange with Backend

### HTTP Communication (FastAPI)

The frontend communicates with FastAPI for:

* Interview initialization
* CV upload and processing
* Interview continuation (text mode)
* LiveKit token generation

### Real-Time Communication (LiveKit)

For voice interviews:

* Audio, turn-taking, and streaming responses occur over WebRTC
* No interview logic is executed in the browser
* The frontend acts purely as a client for the LiveKit session

---

## ✅ Summary

The frontend provides a **minimal but complete client implementation** for the AI Interview system. It focuses on:

* Clear interview setup flows
* Explicit routing and screen separation
* Clean integration with FastAPI and LiveKit

By keeping all reasoning and persistence on the backend, the frontend remains lightweight, predictable,
