// == Single File: index.js (or server.js) ==

// Load environment variables
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Custom route files
const user = require("./routes/user");
const employee = require("./routes/employee_crud.js");

// Additional route files in 'routes' folder
const authRoutes = require("./routes/auth");
const employeeRoutes = require("./routes/employee");
const employeeCrudRoutes = require("./routes/employee_crud");  

const app = express();
app.use(express.json());
app.use(cors());

// -----------------
// MongoDB Connection
// -----------------
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// -----------------
// API Routes
// -----------------
// Example: from your original index.js
app.use("/api/v1/user", user);
app.use("/api/v1/emp", employee);

// Example: from your original server.js
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/v1/employees", employeeCrudRoutes);

// Basic home route
app.get("/", (req, res) => {
  res.send("<h1>Welcome to Employee Management System</h1>");
});

// -----------------
// Start the Server
// -----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
