# 🔍 Lost & Found — AI Face Match System
### Firebase + Face++ + Vercel + Netlify + GitHub

---

## 📁 Project Files

```
lost-found/
├── public/
│   └── index.html        ← Main website (Netlify पर जाएगा)
├── api/
│   └── match.js          ← Face++ Backend (Vercel पर जाएगा)
├── vercel.json           ← Vercel config
└── README.md             ← यह file
```

---

## 🚀 STEP BY STEP DEPLOY करो

---

### STEP 1 — GitHub Repository बनाओ

1. https://github.com पर जाओ
2. Sign up / Login करो
3. **"New Repository"** click करो
4. Name: `lost-found-ai`
5. Public रखो
6. **Create Repository** click करो
7. सभी files upload करो (drag & drop)

---

### STEP 2 — Firebase Setup करो

1. https://firebase.google.com पर जाओ
2. **"Get Started"** → **"Create Project"**
3. Project name: `lost-found-ai`
4. Google Analytics: OFF करो
5. **Create Project**

#### Firebase Services Enable करो:

**A) Firestore Database:**
- Left menu → **Firestore Database**
- **Create Database** → **Start in test mode**
- Location: `asia-south1` (India)

**B) Storage:**
- Left menu → **Storage**
- **Get Started** → **Start in test mode**

**C) Config Keys लो:**
- Left menu → ⚙️ **Project Settings**
- **Your Apps** → **Web App** → `</>`
- App nickname: `lost-found-web`
- **Register App**
- यह config copy करो:

```javascript
const firebaseConfig = {
  apiKey:            "xxxx",
  authDomain:        "xxxx.firebaseapp.com",
  projectId:         "xxxx",
  storageBucket:     "xxxx.appspot.com",
  messagingSenderId: "xxxx",
  appId:             "xxxx"
};
```

**D) `public/index.html` में डालो:**
- Line ढूंढो: `"YOUR_API_KEY"`
- अपना Firebase config replace करो

---

### STEP 3 — Face++ API Keys लो

1. https://www.faceplusplus.com पर जाओ
2. **Sign Up** (free)
3. **Console** → **API Key**
4. **Create API Key**
5. `API Key` और `API Secret` copy करो
6. कहीं safe रखो (next step में काम आएगा)

---

### STEP 4 — Vercel Deploy करो (Backend)

1. https://vercel.com पर जाओ
2. **Sign up with GitHub**
3. **"New Project"** → GitHub repo select करो
4. **Environment Variables** add करो:

| Key | Value |
|-----|-------|
| `FACEPP_API_KEY` | Face++ का API Key |
| `FACEPP_API_SECRET` | Face++ का API Secret |

5. **Deploy** click करो
6. Deploy होने के बाद URL मिलेगा: `https://lost-found-xxx.vercel.app`
7. यह URL copy करो

**`public/index.html` में डालो:**
```javascript
window.VERCEL_URL = "https://lost-found-xxx.vercel.app";
```

---

### STEP 5 — Netlify Deploy करो (Frontend)

1. https://netlify.com पर जाओ
2. **Sign up with GitHub**
3. **"New site from Git"**
4. GitHub repo select करो
5. Build settings:
   - **Base directory:** `public`
   - **Build command:** खाली छोड़ो
   - **Publish directory:** `public`
6. **Deploy site** click करो
7. URL मिलेगा: `https://your-site.netlify.app`

---

### STEP 6 — Firebase CORS Fix

Firebase Storage में CORS allow करना होगा।

Firestore Rules (Test mode में already open है):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

Storage Rules:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

---

## ✅ सब Ready — System कैसे काम करेगा

```
User → Netlify Website
    → Photo Upload
    → Firebase Storage (photo save)
    → Firestore DB (data save)
    → Vercel API → Face++ Compare
    → Score 70%+ → Match Popup Show
    → All Mobiles Real-time Sync ✅
```

---

## 🔑 Admin Panel

- Website पर **"Admin"** button
- PIN: **578500**
- Lost / Found / Matched records
- Real-time stats

---

## 💰 सब FREE है

| Service | Free Limit |
|---------|-----------|
| GitHub | Unlimited |
| Firebase | 1GB Storage, 50K reads/day |
| Face++ | 1,000 calls/month |
| Vercel | 100GB bandwidth/month |
| Netlify | 100GB bandwidth/month |

---

## ❓ Help चाहिए?

कोई भी step में problem हो तो बताओ!
