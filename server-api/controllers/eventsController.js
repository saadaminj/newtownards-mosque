const db = require("../db");

// GET all events
function fetchEvents(req, res) {
  const rows = db.prepare("SELECT name, description, time\
    FROM events\
    ORDER BY\
      (CAST(substr(time, 1, 2) AS INTEGER) * 60) +\
      CAST(substr(time, 4, 2) AS INTEGER);\
").all();
  res.json(rows);
}
function saveEvents(req, res){
  let payload = req.body.events || req.body.eventsData || req.body;
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch (err) {
      return res.status(400).json({ error: "events JSON string is invalid" });
    }
  }
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
      description = excluded.description,
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
    res.status(500).json({ error: "failed to upsert events" });
  }
}

// DELETE jamaat by name
function deleteEvent(req, res){
  const { name } = req.params;
  const info = db.prepare("DELETE FROM events WHERE name = ?").run(name);
  if (info.changes === 0) {
    return res.status(404).json({ error: "nothing to delete" });
  }
  res.json({ success: true, deleted: name });
}

module.exports = { fetchEvents, saveEvents, deleteEvent };