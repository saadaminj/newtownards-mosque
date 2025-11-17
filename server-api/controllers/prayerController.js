
const db = require("../db");

function fetchPrayers (req, res) {
  const rows = db.prepare('SELECT * FROM prayer_times ORDER BY date').all();
  res.json(rows);
}

function savePrayers(req, res) {
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
    res.status(500).json({ error: "failed to upsert prayer_times" });
  }
}

// DELETE /api/prayer_times/:date
function deletePrayer (req, res) {
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
    res.status(500).json({ error: "failed to delete" });
  }
}

module.exports = { fetchPrayers, savePrayers, deletePrayer };