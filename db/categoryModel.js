const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    require: [true, "Category cannot be empty"],
    unique: [true, "Category already exist"],
  },
  subtitle: {
    type: String,
  },
});

module.exports = mongoose.model("Category", categorySchema);
