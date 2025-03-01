const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },  // ✅ Keep if `name` is the preferred field
  username: { type: String, required: true, unique: true },  // ✅ Ensure it's unique
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "hr", "manager", "employee"],
    default: "employee",
  },
});

module.exports = mongoose.model("User", UserSchema);
