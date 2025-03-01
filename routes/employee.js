const express = require("express");
const { auth, authorize } = require("../middleware/auth");
const router = express.Router();

// Example: Only Admin & HR can add employees
router.post("/add", auth, authorize(["admin", "hr"]), (req, res) => {
  res.json({ msg: "Employee added successfully" });
});

// Example: Employees can view their own profile
router.get("/profile", auth, (req, res) => {
  res.json({ msg: "Employee profile data", user: req.user });
});

module.exports = router;
