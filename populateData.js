const mongoose = require('mongoose');
const Author = require('./models/author');
const Book = require('./models/book');
const Borrower = require('./models/borrower');

// Sample authors, books, and borrowers data
const authorsData = [
  { name: 'Author One', email: 'author1@example.com', phoneNumber: '1234567890' },
  { name: 'Author Two', email: 'author2@example.com', phoneNumber: '0987654321' },
  { name: 'Author Three', email: 'author3@example.com', phoneNumber: '1122334455' },
];

const booksData = [
  { title: 'Book One', author: '', isbn: 'ISBN12345', genre: 'Fiction', availableCopies: 5, borrowingFrequency: 2 },
  { title: 'Book Two', author: '', isbn: 'ISBN67890', genre: 'Non-Fiction', availableCopies: 3, borrowingFrequency: 1 },
  { title: 'Book Three', author: '', isbn: 'ISBN11223', genre: 'Sci-Fi', availableCopies: 7, borrowingFrequency: 3 },
];

const borrowersData = [
  { name: 'Borrower One', email: 'borrower1@example.com', phoneNumber: '3344556677', borrowedBooks: [], membershipType: 'Standard', isActive: true },
  { name: 'Borrower Two', email: 'borrower2@example.com', phoneNumber: '4433221100', borrowedBooks: [], membershipType: 'Premium', isActive: false },
  { name: 'Borrower Three', email: 'borrower3@example.com', phoneNumber: '5566778899', borrowedBooks: [], membershipType: 'Standard', isActive: true },
];

async function populateDatabase() {
  try {
    // Clear existing data
    await Author.deleteMany();
    await Book.deleteMany();
    await Borrower.deleteMany();

    // Create authors
    const authors = await Author.insertMany(authorsData);
    
    // Link books to authors and add them to the database
    booksData[0].author = authors[0]._id;
    booksData[1].author = authors[1]._id;
    booksData[2].author = authors[2]._id;
    
    const books = await Book.insertMany(booksData);
    
    // Link borrowers to books and add them to the database
    borrowersData[0].borrowedBooks = [books[0]._id, books[2]._id]; // Borrower One borrows Book One and Book Three
    borrowersData[1].borrowedBooks = [books[1]._id]; // Borrower Two borrows Book Two
    borrowersData[2].borrowedBooks = [books[0]._id, books[1]._id]; // Borrower Three borrows Book One and Book Two
    
    await Borrower.insertMany(borrowersData);

    console.log('Database populated with sample data.');
  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    mongoose.disconnect();
  }
}

// MongoDB connection
mongoose
  .connect('mongodb://localhost:27017/library-management', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to database');
    populateDatabase();
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });
