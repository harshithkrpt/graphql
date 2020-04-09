const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: {
    required: true,
    type: String,
  },
  author: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: "Author",
  },
});

const Book = mongoose.model("Book", BookSchema);

module.exports = Book;
