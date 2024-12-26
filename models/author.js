const mongoose = require('mongoose');

const emailValidator = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/;
const phoneValidator = /^\\+?[1-9]\\d{1,14}$/;

const authorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true, match: emailValidator }, // Validates email format
  phoneNumber: { type: String, required: true, match: phoneValidator }, // Validates phone number format
});

// Ensure an author cannot be linked to more than 5 books
authorSchema.pre('save', async function (next) {
  const Book = mongoose.model('Book');
  const bookCount = await Book.countDocuments({ author: this._id });
  if (bookCount > 5) {
    throw new Error('An author cannot have more than 5 books linked.');
  }
  next();
});

module.exports = mongoose.model('Author', authorSchema);
