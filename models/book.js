const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
  isbn: { type: String, unique: true, required: true, match: /^(97(8|9))?\\d{9}(\\d|X)$/ }, // Validates ISBN format
  availableCopies: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function (value) {
        return !(this.borrowCount > 10 && value > 100);
      },
      message: 'Available copies cannot exceed 100 if the book has been borrowed more than 10 times.',
    },
  },
  borrowCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('Book', bookSchema);
