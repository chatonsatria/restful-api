const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    require: [true, "Author ID cannot be empty"],
    unique: false,
  },
  title: {
    type: String,
    require: [true, "Title cannot be empty"],
    unique: [true, "Book with this title already exist"],
  },
  excerpt: {
    type: String,
    require: [true, "Excerpt cannot be empty"],
  },
  category: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
});

module.exports = mongoose.model("Books", bookSchema);
