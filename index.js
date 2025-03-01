const express = require('express');
// const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const user = require('./user');
const employee= require('./employee');
require('dotenv').config(); // Add this to load environment variables

app.use(express.json()); 

// Use environment variable for MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI_PROD || "mongodb://localhost:27017/your_database_name";

// Connect to MongoDB using the environment variable
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err.message));

  
app.use("/api/v1/user", user); // Change 'userRoutes' to 'userRouter'

app.use("/api/v1/emp", employee); // Define employee-related API routes

app.get('/', (req, res) => {
    res.send("<h1>Welcome to Employee Management System</h1>");
});

// Use environment variable for port or default to 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});