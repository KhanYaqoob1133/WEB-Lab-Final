const express = require('express');
const Author = require('../models/author');
const Book = require('../models/book');

const router = express.Router();

// Add a new author
router.post('/', async (req, res) => {
  try {
    const { name, email, phoneNumber } = req.body;

    // Validate that name, email, and phoneNumber are provided
    if (!name || !email || !phoneNumber) {
      return res.status(400).send('Name, email, and phone number are required.');
    }

    // Create new author
    const author = new Author({ name, email, phoneNumber });
    await author.save();
    res.status(201).send(author);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Get all authors
router.get('/', async (req, res) => {
  try {
    const authors = await Author.find();
    res.status(200).json(authors);
  } catch (error) {
    res.status(500).send('Error loading authors.');
  }
});

// Update an author
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate that there are fields to update
    if (!updates.name && !updates.email && !updates.phoneNumber) {
      return res.status(400).send('At least one field (name, email, phoneNumber) must be provided.');
    }

    // Find and update author
    const author = await Author.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!author) return res.status(404).send('Author not found.');
    res.send(author);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Delete an author
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the author is linked to any books
    const bookCount = await Book.countDocuments({ author: id });
    if (bookCount > 0) {
      return res.status(400).send('Author cannot be deleted while linked to books.');
    }

    // Delete the author
    const author = await Author.findByIdAndDelete(id);
    if (!author) return res.status(404).send('Author not found.');
    res.send('Author deleted successfully.');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
