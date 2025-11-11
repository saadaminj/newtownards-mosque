const express = require("express");
const Database = require("better-sqlite3");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());

const db = new Database('app.db');

// create table if not exists
db.exec(`
  CREATE TABLE IF NOT EXISTS prayer_times (
    date TEXT PRIMARY KEY,
    fajr TEXT,
    sunrise TEXT,
    dhuhr TEXT,
    asr TEXT,
    maghrib TEXT,
    isha TEXT
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS jamaat (
    name TEXT PRIMARY KEY,
    time TEXT
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    name TEXT PRIMARY KEY,
    description TEXT,
    time TEXT
  );
`);

// create password table if not exists
db.exec(`
  CREATE TABLE IF NOT EXISTS password (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    passtext TEXT NOT NULL
  );
`);


app.get("/api/jamaat", (req, res) => {
  const rows = db.prepare(`
    SELECT name, time
    FROM jamaat
    ORDER BY
      (CAST(substr(time, 1, 2) AS INTEGER) * 60) +
      CAST(substr(time, 4, 2) AS INTEGER);

  `).all();

  res.json(rows);
});

// POST (insert or update) jamaat
app.post("/api/jamaat", (req, res) => {
  // try all possible shapes
  let payload = req.body.jamaat_times || req.body.jamaatData || req.body;
  // if frontend sent a string, parse it
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: "jamaaat JSON string is invalid" });
    }
  }

  // now payload must be an object keyed by date
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return res
      .status(400)
      .json({ error: "jamaat data must be an object keyed by date" });
  }

  const rows = Object.entries(payload).map(([name, times]) => ({
    name,
    time: times.time || null,
  }));

  const stmt = db.prepare(`
    INSERT INTO jamaat (name, time)
    VALUES (?, ?)
    ON CONFLICT(name) DO UPDATE SET
      time = excluded.time
  `);

  const insertMany = db.transaction((rows) => {
    rows.forEach((r) => {
      stmt.run(
        r.name,
        r.time
      );
    });
  });

  try {
    insertMany(rows);
    res.json({ ok: true, count: rows.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to upsert jamaat times" });
  }
});

// DELETE jamaat by name
app.delete("/api/jamaat/:name", (req, res) => {
  const { name } = req.params;
  const info = db.prepare("DELETE FROM jamaat WHERE name = ?").run(name);
  if (info.changes === 0) {
    return res.status(404).json({ error: "nothing to delete" });
  }
  res.json({ success: true, deleted: name });
});


/* =============================
   EVENTS ROUTES
   ============================= */

// GET all events
app.get("/api/events", (req, res) => {
  const rows = db.prepare("SELECT name, description, time\
    FROM events\
    ORDER BY\
      (CAST(substr(time, 1, 2) AS INTEGER) * 60) +\
      CAST(substr(time, 4, 2) AS INTEGER);\
").all();
  res.json(rows);
});
app.post("/api/events", (req, res) => {
  // try all possible shapes
  let payload = req.body.events || req.body.eventsData || req.body;
  // if frontend sent a string, parse it
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: "events JSON string is invalid" });
    }
  }

  // now payload must be an object keyed by date
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return res
      .status(400)
      .json({ error: "events data must be an object keyed by date" });
  }

  const rows = Object.entries(payload).map(([name, data]) => ({
    name,
    description: data.description || null,
    time: data.time || null,
  }));

  const stmt = db.prepare(`
    INSERT INTO events (name,description, time)
    VALUES (?,?,?)
    ON CONFLICT(name) DO UPDATE SET
      description = excluded.description
      time = excluded.time
  `);

  const insertMany = db.transaction((rows) => {
    rows.forEach((r) => {
      stmt.run(
        r.name,
        r.description,
        r.time
      );
    });
  });

  try {
    insertMany(rows);
    res.json({ ok: true, count: rows.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to upsert events" });
  }
});

// DELETE jamaat by name
app.delete("/api/events/:name", (req, res) => {
  const { name } = req.params;
  const info = db.prepare("DELETE FROM events WHERE name = ?").run(name);
  if (info.changes === 0) {
    return res.status(404).json({ error: "nothing to delete" });
  }
  res.json({ success: true, deleted: name });
});

// insert default password if not exists
// db.prepare('DELETE FROM password;').run();
const count = db.prepare('SELECT COUNT(*) as c FROM password').get().c;
if (count === 0) {
  db.prepare('INSERT INTO password (passtext) VALUES (?)').run('$2b$10$7Y9gpKG2CMz/D4nvqhlbE.HWUiWYpB6p4nbJZrntQn3fdw6pVGA/W').run();
  console.log('Default password inserted');
}

app.get('/api/password', async (req, res) => {
  try {
    const rows = db.prepare('SELECT passtext FROM password').all();
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "no password found" });
    }
    return res.json({ passtext: rows[0].passtext });
    // hash each password before sending
    // const hashed = await Promise.all(
    //   rows.map(async (row) => {
    //     const hash = await bcrypt.hash(row.passtext, 10); // 10 = salt rounds
    //     return {hash};
    //   })
    // );

    res.json(hashed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed to fetch password' });
  }
});

app.get('/api/prayer_times', (req, res) => {
  const rows = db.prepare('SELECT * FROM prayer_times ORDER BY date').all();
  res.json(rows);
});


app.post("/api/prayer_times", (req, res) => {
  // try all possible shapes
  let payload = req.body.prayer_times || req.body.prayerData || req.body;

  // if frontend sent a string, parse it
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch (err) {
      return res.status(400).json({ error: "prayer JSON string is invalid" });
    }
  }

  // now payload must be an object keyed by date
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return res
      .status(400)
      .json({ error: "prayer data must be an object keyed by date" });
  }

  const rows = Object.entries(payload).map(([date, times]) => ({
    date,
    fajr: times.fajr || null,
    sunrise: times.sunrise || null,
    dhuhr: times.dhuhr || null,
    asr: times.asr || null,
    maghrib: times.maghrib || null,
    isha: times.isha || null,
  }));

  const stmt = db.prepare(`
    INSERT INTO prayer_times (date, fajr, sunrise, dhuhr, asr, maghrib, isha)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(date) DO UPDATE SET
      fajr = excluded.fajr,
      sunrise = excluded.sunrise,
      dhuhr = excluded.dhuhr,
      asr = excluded.asr,
      maghrib = excluded.maghrib,
      isha = excluded.isha
  `);

  const insertMany = db.transaction((rows) => {
    rows.forEach((r) => {
      stmt.run(
        r.date,
        r.fajr,
        r.sunrise,
        r.dhuhr,
        r.asr,
        r.maghrib,
        r.isha
      );
    });
  });

  try {
    insertMany(rows);
    res.json({ ok: true, count: rows.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to upsert prayer_times" });
  }
});



// DELETE /api/prayer_times/:date
app.delete("/api/prayer_times/:date", (req, res) => {
  const { date } = req.params;

  if (!date) {
    return res.status(400).json({ error: "date param is required" });
  }

  try {
    const stmt = db.prepare(`DELETE FROM prayer_times WHERE date = ?`);
    const info = stmt.run(date); // info.changes tells how many rows were deleted

    if (info.changes === 0) {
      return res.status(404).json({ error: "no record found for that date" });
    }

    res.json({ ok: true, deleted: date });
  } catch (err) {
    console.error("delete failed:", err);
    res.status(500).json({ error: "failed to delete" });
  }
});

app.listen(4000, () => console.log('API on http://localhost:4000'));
