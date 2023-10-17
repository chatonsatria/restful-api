const mongoose = require("mongoose");

const bookDetailSchema = new mongoose.Schema({
  book_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Books",
    required: true,
    unique: true,
  },
  content: {
    type: String,
    require: [true, "Content cannot be empty"],
    unique: false,
  },
});

module.exports =
  mongoose.model.BookDetail || mongoose.model("BookDetail", bookDetailSchema);
