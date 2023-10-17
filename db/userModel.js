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
  },
  first_name: {
    type: String,
    require: [true, "First name cannot be empty"],
  },
  last_name: {
    type: String,
    require: [true, "Last name cannot be empty"],
  },
  role: {
    type: Array,
    require: [true, "Role cannot be empty"],
  },
  books: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Books",
    },
  ],
});

module.exports = mongoose.model("Users", userSchema);
