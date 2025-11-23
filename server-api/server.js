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

app.use(
  cors({
    origin: process.env.REACT_DOMAIN + ":" + process.env.REACT_PORT, // your React dev origin
    credentials: true,               // allow cookies
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

app.listen(process.env.PORT, () => console.log('API on '+process.env.DOMAIN+":"+process.env.PORT));
