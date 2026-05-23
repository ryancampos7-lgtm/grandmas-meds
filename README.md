# 💙 Grandma's Meds

A Progressive Web App (PWA) for medication management — designed with love for elderly users. Features morning/evening reminders, video dose logging, family notifications, and mood/feeling tracking.

---

## 🚀 Deploy to Netlify (Free)

### Option A: Deploy via GitHub (Recommended)

1. **Push this project to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/grandmas-meds.git
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com) and sign in (free account)
   - Click **"Add new site" → "Import an existing project"**
   - Choose **GitHub** and select your repo
   - Build settings are already configured in `netlify.toml`:
     - Build command: `npm run build`
     - Publish directory: `build`
   - Click **Deploy site** 🎉

3. **Your app is live!**
   - Netlify gives you a free URL like `https://grandmas-meds-abc123.netlify.app`
   - You can set a custom domain in Netlify settings

### Option B: Drag & Drop Deploy

1. Build locally:
   ```bash
   npm install
   npm run build
   ```
2. Go to [app.netlify.com](https://app.netlify.com)
3. Drag the `build/` folder onto the deploy area

---

## 📱 Install on Phone (PWA)

After deploying:

**iPhone/iPad:**
- Open the app URL in Safari
- Tap the Share button → "Add to Home Screen"
- Tap "Add" — it installs like a native app!

**Android:**
- Open in Chrome
- Tap the menu (3 dots) → "Add to Home Screen"
- Or Chrome will show an install banner automatically

---

## 🔔 Setting Up Push Notifications (Optional)

The app uses browser-native notifications which work on Android and desktop. For iOS Safari push notifications (iOS 16.4+):

1. The user must "Add to Home Screen" first
2. Then enable notifications in the app's Settings tab
3. iOS will prompt for permission

For **family SMS/email notifications**, you'll need a free backend. Two easy options:

### Option 1: Netlify Functions + EmailJS (Free)
1. Sign up at [emailjs.com](https://emailjs.com) (free tier: 200 emails/month)
2. Create a `netlify/functions/notify.js` file
3. Add your EmailJS credentials to Netlify environment variables

### Option 2: Netlify Functions + Twilio (SMS)
1. Sign up at [twilio.com](https://twilio.com) (free trial credits)
2. Add Twilio credentials to Netlify environment variables

---

## 🛠 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm start
# App runs at http://localhost:3000
```

---

## 📁 Project Structure

```
grandmas-meds/
├── public/
│   ├── index.html          # App shell
│   ├── manifest.json       # PWA manifest
│   ├── service-worker.js   # Push notifications + offline
│   └── icons/              # App icons (add your own!)
├── src/
│   ├── App.jsx             # Main app + state management
│   ├── index.js            # Entry point + SW registration
│   ├── index.css           # Global styles + CSS variables
│   ├── components/
│   │   ├── TopBar.jsx      # Header with streak
│   │   ├── BottomNav.jsx   # Tab navigation
│   │   ├── TodayTab.jsx    # Medication taking + video
│   │   ├── FeelingTab.jsx  # Daily mood/symptom tracking
│   │   ├── SummaryTab.jsx  # Day/Week/Month/Year stats
│   │   ├── SettingsTab.jsx # Meds, times, family, history
│   │   ├── OnboardingModal.jsx # First-time setup
│   │   └── ui.jsx          # Shared UI components
│   └── utils/
│       ├── storage.js      # localStorage data layer
│       └── notifications.js # Push notification helpers
├── netlify.toml            # Netlify build config
└── package.json
```

---

## 🎨 App Icons

You'll need to add icons to `public/icons/`. Create PNG files at these sizes:
- `icon-72.png`, `icon-96.png`, `icon-128.png`, `icon-144.png`
- `icon-152.png`, `icon-192.png`, `icon-384.png`, `icon-512.png`

Free tool: [realfavicongenerator.net](https://realfavicongenerator.net) — upload one image, get all sizes.

---

## ✨ Features

| Feature | Status |
|---------|--------|
| Morning & evening med tracking | ✅ |
| Video dose recording | ✅ |
| Encouragement messages | ✅ |
| Daily feeling/symptom log | ✅ |
| Day/Week/Month/Year summary | ✅ |
| Medication change history | ✅ |
| Family notification list | ✅ |
| Push notification reminders | ✅ |
| Offline support (PWA) | ✅ |
| Install to home screen | ✅ |
| Persistent local storage | ✅ |
| Onboarding flow | ✅ |
| Day streak tracking | ✅ |

---

## 💙 Built with love for Grandma
# grandmas-meds
