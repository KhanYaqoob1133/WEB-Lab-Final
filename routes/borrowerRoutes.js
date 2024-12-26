const express = require('express');
const router = express.Router();
const Borrower = require('../models/borrower');
const Book = require('../models/book');

// Get all borrowers
router.get('/', async (req, res) => {
  try {
    const borrowers = await Borrower.find().populate('borrowedBooks');
    res.status(200).json(borrowers);
  } catch (error) {
    res.status(500).send('Error loading borrowers.');
  }
});

// Borrow Books
router.post('/:id/borrow', async (req, res) => {
  try {
    const { id } = req.params; // Borrower ID
    const { bookIds } = req.body; // Array of Book IDs

    if (!bookIds || bookIds.length === 0) {
      return res.status(400).send('No book IDs provided for borrowing.');
    }

    const borrower = await Borrower.findById(id).populate('borrowedBooks');
    if (!borrower) return res.status(404).send('Borrower not found.');

    // Determine borrowing limit based on membership type
    const maxBooks = borrower.membershipType === 'Premium' ? 10 : 5;

    // Check if borrower exceeds their limit
    if (borrower.borrowedBooks.length + bookIds.length > maxBooks) {
      return res
        .status(400)
        .send(`Borrower cannot borrow more than ${maxBooks} books.`);
    }

    const books = await Book.find({ _id: { $in: bookIds } });

    // Validate if all books are available for borrowing
    const unavailableBooks = books.filter((book) => book.availableCopies === 0);
    if (unavailableBooks.length > 0) {
      return res.status(400).send({
        message: 'Some books are not available for borrowing.',
        unavailableBooks: unavailableBooks.map((book) => book.title),
      });
    }

    // Update books and borrower
    books.forEach(async (book) => {
      book.availableCopies -= 1;  // Decrease available copies
      await book.save();
    });

    borrower.borrowedBooks.push(...bookIds); // Add borrowed books to borrower
    await borrower.save();

    res.status(200).send({
      message: 'Books borrowed successfully.',
      borrowedBooks: borrower.borrowedBooks,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Return Books
router.post('/:id/return', async (req, res) => {
  try {
    const { id } = req.params; // Borrower ID
    const { bookIds } = req.body; // Array of Book IDs

    if (!bookIds || bookIds.length === 0) {
      return res.status(400).send('No book IDs provided for returning.');
    }

    const borrower = await Borrower.findById(id);
    if (!borrower) return res.status(404).send('Borrower not found.');

    const books = await Book.find({ _id: { $in: bookIds } });

    // Validate that the borrower has these books
    const invalidBooks = bookIds.filter(
      (bookId) => !borrower.borrowedBooks.includes(bookId)
    );
    if (invalidBooks.length > 0) {
      return res.status(400).send({
        message: 'Some books were not borrowed by this borrower.',
        invalidBooks,
      });
    }

    // Update books and borrower
    books.forEach(async (book) => {
      book.availableCopies += 1;  // Increase available copies
      await book.save();
    });

    // Remove returned books from borrower's list
    borrower.borrowedBooks = borrower.borrowedBooks.filter(
      (bookId) => !bookIds.includes(bookId.toString())
    );
    await borrower.save();

    res.status(200).send({
      message: 'Books returned successfully.',
      remainingBooks: borrower.borrowedBooks,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
