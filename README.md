# 🕌 Newtownards Mosque Website

A full-stack mosque management system built with **React (Vite)**, **Node.js**, and **SQLite**, including an admin dashboard with authentication and prayer-time management.

---

## ✨ Features

* Modern **React + Tailwind CSS** frontend
* Secure **Node.js + Express** backend
* Local **SQLite** database (file-based, no external DB required)
* Admin Panel with:

  * JWT authentication
  * First-time auto-password generation
  * Origin protection (only accepts requests from the configured frontend URL)
* Ability to import prayer times from JSON or AI-generated text
* Full Docker support (frontend + backend)

---

## 🛠 Tech Stack

| Layer      | Technology                 |
| ---------- | -------------------------- |
| Frontend   | React (Vite), Tailwind CSS |
| Backend    | Node.js v24.11.0, Express  |
| Database   | SQLite                     |
| Auth       | JWT                        |
| Deployment | Docker & Docker Compose    |

---

# 🚀 Running the Frontend

### 1. Clone the project

```bash
git clone <repository-url>
cd mosque-website
```

### 2. Install packages

```bash
npm install
```

### 3. Start the dev server

```bash
npm run dev
```

The frontend will run at:

```
http://localhost:5173
```

---

### 🔐 Access the Admin Panel

```
http://localhost:5173/admin
```

---

# 🧱 Running the Backend (server-api)

### 1. Create `.env` file inside `server-api/`

```
JWT_SECRET=<your-generated-secret>
FRONTEND_DEV_ORIGIN=http://localhost:5173
FRONTEND_PROD_ORIGIN=http://localhost:4173
DB_FILE=data/app.db
PORT=5001
DOMAIN=http://localhost
```

### 2. Generate a JWT secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the generated key into the `JWT_SECRET` variable in `.env`.

### 3. Install backend dependencies

```bash
cd server-api
npm install
```

### 4. Start backend

```bash
npm start
```

The backend API will run at:

```
http://localhost:5001
```

---

# 🐳 Running via Docker (Frontend & Backend)

### Build without cache

```bash
docker compose build --no-cache
```

### Start containers (foreground)

```bash
docker compose up
```

### Start containers (background)

```bash
docker compose up -d
```

### Stop and remove containers

```bash
docker compose down
```

---

# 🔑 First-Time Login (Admin Panel)

If no password is found in the database:

* Enter **any** string as the password.
* The system will automatically **generate a secure password**.
* Use that generated password for all future logins.
* Only the **hashed** password is stored for security.

---

# 🎨 Tailwind Theme Customization

The project uses the **emerald** color theme.

To change theme colors, replace the word `emerald` with any of:

```
slate, gray, zinc, neutral, stone,
red, orange, amber, yellow, lime,
green, emerald, teal, cyan, sky,
blue, indigo, violet, purple,
fuchsia, pink, rose
```

⚠️ Important:
Use **case-sensitive search and replace** to avoid breaking other strings.

---

# 📥 Admin – Prayer Time Upload

You can upload prayer times:

### **Option 1 — Import JSON File**

Upload a file matching the format in:

```
project/server-api/prayerTimes.json
```

### **Option 2 — Paste JSON Input**

Paste JSON manually into:

```
localhost:5173/admin → Input → Import JSON Input
```

---

# 🖼 Generate JSON From a Prayer Times Image (via AI)

1. Upload a prayer-time image to an AI chatbot (ChatGPT, Gemini, etc.)
2. Use the prompt in:

```
project/mosque-website/src/prompt.txt
```

3. Modify the prompt based on your image
4. Example used image:

```
project/mosque-website/src/april.jpg
```

5. Paste AI-generated JSON into the Admin panel
6. Click **Import JSON Input**
7. Always click **Save Changes** afterwards

---

# ⚠️ Important Notes

* **Delete** operations directly update the database
* **Edit** and **Add** operations update the UI only →
  ✔️ Require pressing **Save Changes** to become permanent
* Always review changes before saving
* Docker must be rebuilt after editing backend code:

```bash
docker compose build --no-cache
docker compose up
```

---

If you want, I can also:

✅ Add project screenshots
✅ Add badges (Node version, license, technologies)
✅ Add folder structure section
✅ Add API documentation
✅ Make a professional landing-style README with icons

Just let me know!
