const mongoose = require('mongoose');

const borrowerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  membershipActive: { type: Boolean, required: true },
  membershipType: {
    type: String,
    enum: ['Standard', 'Premium'],
    required: true,
  },
});

// Custom method to check if the borrower can borrow more books
borrowerSchema.methods.canBorrowMore = function () {
  const maxBooks = this.membershipType === 'Premium' ? 10 : 5;
  return this.borrowedBooks.length < maxBooks;
};

module.exports = mongoose.model('Borrower', borrowerSchema);
