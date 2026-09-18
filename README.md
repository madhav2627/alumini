# AlumniConnect 🎓

> **Official University Alumni Network & Career Advancement Platform**
> *"Your college network doesn't end at graduation."*

AlumniConnect is a modern, responsive web application connecting students, alumni, faculty, and administrators into an official university community. It facilitates mentorship, career referrals, campus event registrations, regional alumni chapters, giving campaigns, and instant peer-to-peer networking.

---

## 🌟 Key Features

- **College ID Authentication**:
  - Secure login using official University Roll Number / College ID.
  - Interactive multi-step registration wizard capturing credentials, degree cohort, industry experience, and mentorship preferences.
- **Unified Member Dashboard**:
  - Common dashboard dynamically adapting for students, alumni, faculty, and new members.
  - Live university metrics: alumni counts, active job postings, upcoming reunions, and personal connections.
  - Digital Campus Pass with holographic pass ID and simulated barcode.
  - Onboarding and verification status tracker.
- **Alumni Directory & Search**:
  - Filter by department, graduation cohort, industry, location, and mentorship availability.
  - Modal profiles featuring career trajectories, verified badges, and 1-click connect/message actions.
- **Job & Referral Board**:
  - Exclusive alumni job listings, referral requests, application tracking, and bookmarking.
- **Mentorship Hub**:
  - 1-on-1 mentorship matchmaking, direct inquiries, meeting requests, and status workflows.
- **Campus Community Forum**:
  - Categorized feed (Discussions, Placements, Announcements, Tech Talks) with likes, bookmarks, and threaded discussions.
- **Campus Reunions & Events**:
  - Live RSVP tracking, calendar integration, event agendas, and speaker profiles.
- **Regional Chapters & Giving**:
  - Global city chapters and fundraising campaigns for student scholarships and campus endowments.
- **Theme & Responsiveness**:
  - Sleek dark/light theme toggle.
  - Fully responsive layout supporting desktop, tablet, and mobile offcanvas navigation.

---

## 🛠️ Technology Stack

- **Frontend Core**: Vanilla JavaScript (ES Modules), HTML5 semantic structure.
- **Styling**: Vanilla CSS Design System with CSS variables, fluid typography, glassmorphism, and responsive breakpoints.
- **State Management**: Reactive state store with automatic local storage persistence.
- **Build Tool**: Vite.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/madhav2627/alumini.git
   cd alumini
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. Build for production:
   ```bash
   npm run build
   ```

---

## 📱 Mobile Application (Android & PWA)

AlumniConnect is ready as a mobile application through two channels:

### 1. Progressive Web App (PWA) on Vercel
Visitors to **[https://alumini-beta.vercel.app/](https://alumini-beta.vercel.app/)** can install the mobile app directly:
- **Android (Chrome / Edge / Firefox)**: Tap the **"Install App"** button at the bottom of the screen or select **"Add to Home Screen"** from the browser menu.
- **iOS (Safari on iPhone / iPad)**: Tap the **Share icon ⎋**, then select **"Add to Home Screen"**.
- The app runs in full-screen standalone mode with app launcher icons, native safe areas, and offline cache support.

### 2. Native Android App (Capacitor & Android Studio)
The `./android/` directory contains a complete native Android Studio project configured for package `com.alumniconnect.app`.

- **Sync web assets to Android**:
  ```bash
  npm run cap:build
  ```
- **Open in Android Studio**:
  ```bash
  npm run cap:open
  ```
  From Android Studio, click **Run ▶** to deploy to any connected physical Android phone or emulator, or select **Build > Build Bundle(s) / APK(s) > Build APK(s)** to generate `app-debug.apk`.

---

## 📄 License

MIT License © 2026 AlumniConnect Platform.
