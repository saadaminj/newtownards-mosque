// db.js
const Database = require("better-sqlite3");// db.js
const path = require("path");

// Default: local path server-api/data/app.db
const defaultDbPath = path.join(__dirname, "data", "app.db");

// In Docker we will override DB_FILE to /data/app.db
const dbPath = process.env.DB_FILE || defaultDbPath;

console.log("Using SQLite DB file:", dbPath);

const db = new Database(dbPath);
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

db.exec(`
  CREATE TABLE IF NOT EXISTS password (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    passtext TEXT NOT NULL
  );
`);

// db.prepare('DELETE FROM password;').run();
// run this to hash the password to store it in db : await bcrypt.hash(password, 10);
const count = db.prepare('SELECT COUNT(*) as c FROM password').get().c;
if (count === 0) {
  db.prepare('INSERT INTO password (passtext) VALUES (?)').run('$2b$10$7Y9gpKG2CMz/D4nvqhlbE.HWUiWYpB6p4nbJZrntQn3fdw6pVGA/W').run();
}

module.exports = db;