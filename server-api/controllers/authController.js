// authController.js
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function createToken() {
  return jwt.sign(
    {},
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

async function login(req, res) {
  let payload = req.body.password || req.body;
  try {
    const rows = db.prepare('SELECT passtext FROM password').all();
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "no password found" });
    }
    const isMatch = bcrypt.compare(payload, rows[0].passtext);

    const token = createToken();
    
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        isMatch: isMatch
      });
      
  } catch (err) {
    // console.log(err);
    res.status(500).json({ error: 'failed to fetch password' });
  }
}
function logout(req, res) {
  res
    .clearCookie("token", { httpOnly: true, sameSite: "lax" })
    .json({ message: "Logged out" });
}

function me(req, res) {
  res.json({});
}

module.exports = { login, logout, me };
