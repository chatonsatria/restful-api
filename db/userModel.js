const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: [true, "Email cannot be empty"],
    unique: [true, "Email already exist"],
  },
  password: {
    type: String,
    require: [true, "Password cannot be empty"],
    unique: false,
  },
});

module.exports = mongoose.model.Users || mongoose.model("Users", userSchema);
