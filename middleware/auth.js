const jwt = require("jsonwebtoken");

// Use the secret key from .env or fallback to a secure default
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

// ✅ Verify JWT Token (Authentication Middleware)
const auth = (req, res, next) => {
  const authHeader = req.header("Authorization");

  // ✅ Check if the Authorization header exists
  if (!authHeader) {
    return res.status(401).json({ msg: "Unauthorized: No token provided" });
  }

  // ✅ Ensure the token follows the "Bearer <token>" format
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

  if (!token) {
    return res.status(401).json({ msg: "Unauthorized: Invalid token format" });
  }

  try {
    // ✅ Verify JWT token
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Unauthorized: Invalid token" });
  }
};

// ✅ Role-Based Access Control (Authorization Middleware)
const authorize = (roles = []) => {
  return (req, res, next) => {
    // Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ msg: "Unauthorized: User not authenticated" });
    }

    // Check if user role is allowed
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: "Forbidden: Access denied" });
    }

    next();
  };
};

module.exports = { auth, authorize };
