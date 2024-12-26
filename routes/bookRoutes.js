const express = require('express');
const Book = require('../models/book');
const Author = require('../models/author');
const Borrower = require('../models/borrower');  // Import Borrower model
const router = express.Router();

// Add a new book
router.post('/', async (req, res) => {
  try {
    const { title, author, isbn, availableCopies } = req.body;

    // Validate if author exists
    const authorExists = await Author.findById(author);
    if (!authorExists) return res.status(404).send('Author not found.');

    // Create new book
    const book = new Book({ title, author, isbn, availableCopies });
    await book.save();
    res.status(201).send(book);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find().populate('author');  // Populate author details
    res.status(200).json(books);
  } catch (error) {
    res.status(500).send('Error loading books.');
  }
});

// Update a book
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Validate if book exists
    const book = await Book.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!book) return res.status(404).send('Book not found.');

    res.send(book);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Delete a book
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate if book exists
    const book = await Book.findByIdAndDelete(id);
    if (!book) return res.status(404).send('Book not found.');

    res.send('Book deleted successfully.');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route to borrow a book (updates the availableCopies)
router.put('/borrow/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params;
    const { borrowerId, membershipType } = req.body; // Borrower ID and membership type (Standard or Premium)

    // Find the book by ID
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).send('Book not found.');

    // Validate borrowing conditions (membership type, book availability)
    if (book.availableCopies <= 0) {
      return res.status(400).send('No copies available to borrow.');
    }

    if (membershipType === 'Standard' && book.availableCopies < 1) {
      return res.status(400).send('Standard members can only borrow 1 book.');
    }

    // Find borrower
    const borrower = await Borrower.findById(borrowerId);
    if (!borrower) return res.status(404).send('Borrower not found.');

    // Decrease availableCopies
    book.availableCopies -= 1;
    await book.save();

    res.status(200).send(`Book borrowed successfully. Remaining copies: ${book.availableCopies}`);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Route to return a book (increases the availableCopies)
router.put('/return/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params;

    // Find the book by ID
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).send('Book not found.');

    // Increase availableCopies
    book.availableCopies += 1;
    await book.save();

    res.status(200).send(`Book returned successfully. Available copies: ${book.availableCopies}`);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
