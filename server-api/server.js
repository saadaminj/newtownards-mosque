require("dotenv").config();
const express = require("express");
const Database = require("better-sqlite3");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { login, logout, me } = require("./controllers/authController");
const { authenticate } = require("./controllers/authMiddleware");

const { savePrayers, fetchPrayers, deletePrayer } = require("./controllers/prayerController");
const { fetchEvents, saveEvents, deleteEvent } = require("./controllers/eventsController");
const { fetchJamaat, saveJamaat, deleteJamaat } = require("./controllers/jamaatController");

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_DEV_ORIGIN,   // e.g. http://localhost:5173
  process.env.FRONTEND_PROD_ORIGIN,  // e.g. https://mosque.example.com
  "https://mosque-website-long-bird-6230.fly.dev",
  "mosque-website-long-bird-6230.fly.dev",
].filter(Boolean); // remove undefined/empty


app.use(
  cors({
    origin: (origin, callback) => {
      // Don't allow non-browser or same-origin requests with no origin (like curl, Postman)
      if (!origin) return callback(new Error("Not allowed by CORS"));

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("CORS blocked origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.post('/api/password', login);
app.get('/api/password', logout);
app.get("/api/auth/me", authenticate, me);

app.get("/api/jamaat", fetchJamaat);
app.post("/api/jamaat", authenticate, saveJamaat);
app.delete("/api/jamaat/:name", authenticate, deleteJamaat);

app.get("/api/events", fetchEvents);
app.post("/api/events", authenticate, saveEvents);
app.delete("/api/events/:name", authenticate, deleteEvent);

app.get('/api/prayer_times', fetchPrayers);
app.post("/api/prayer_times", authenticate, savePrayers);
app.delete("/api/prayer_times/:date", authenticate, deletePrayer);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log('API on '+process.env.DOMAIN+":"+process.env.PORT));
