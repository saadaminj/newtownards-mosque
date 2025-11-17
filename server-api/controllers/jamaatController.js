const db = require("../db");
function fetchJamaat(req, res){
  const rows = db.prepare(`
    SELECT name, time
    FROM jamaat
    ORDER BY
      (CAST(substr(time, 1, 2) AS INTEGER) * 60) +
      CAST(substr(time, 4, 2) AS INTEGER);

  `).all();

  res.json(rows);
}

function saveJamaat(req, res){
  let payload = req.body.jamaat_times || req.body.jamaatData || req.body;
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch (err) {
      return res.status(400).json({ error: "jamaaat JSON string is invalid" });
    }
  }
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
    res.status(500).json({ error: "failed to upsert jamaat times" });
  }
}

function deleteJamaat(req, res){
  const { name } = req.params;
  const info = db.prepare("DELETE FROM jamaat WHERE name = ?").run(name);
  if (info.changes === 0) {
    return res.status(404).json({ error: "nothing to delete" });
  }
  res.json({ success: true, deleted: name });
}

module.exports = { fetchJamaat, saveJamaat, deleteJamaat };