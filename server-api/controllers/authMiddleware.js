const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    let token = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    jwt.verify(token, process.env.JWT_SECRET);

    next();
  } catch (err) {
    // console.error("JWT auth error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = { authenticate };