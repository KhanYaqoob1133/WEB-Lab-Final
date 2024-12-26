document.getElementById('addBookForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const bookTitle = document.getElementById('bookTitle').value;
    const bookAuthor = document.getElementById('bookAuthor').value;
    const bookIsbn = document.getElementById('bookIsbn').value;
    const bookAvailableCopies = document.getElementById('bookAvailableCopies').value;

    // Check if all fields are filled
    if (!bookTitle || !bookAuthor || !bookIsbn || !bookAvailableCopies) {
        alert('Please fill in all fields');
        return;
    }

    // Create book object
    const bookData = {
        title: bookTitle,
        author: bookAuthor, // Assuming author ID is passed
        isbn: bookIsbn,
        availableCopies: bookAvailableCopies
    };

    // Send POST request to add book
    fetch('http://localhost:3000/books', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Book added successfully!');
        console.log(data); // You can log the response data if needed
    })
    .catch(error => {
        alert('Error adding book!');
        console.error(error);
    });
});

// Add Author Form Submit Event
document.getElementById('addAuthorForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const authorName = document.getElementById('authorName').value;
    const authorEmail = document.getElementById('authorEmail').value;
    const authorPhoneNumber = document.getElementById('authorPhoneNumber').value;

    // Check if all fields are filled
    if (!authorName || !authorEmail || !authorPhoneNumber) {
        alert('Please fill in all fields');
        return;
    }

    // Create author object
    const authorData = {
        name: authorName,
        email: authorEmail,
        phoneNumber: authorPhoneNumber
    };

    // Send POST request to add author
    fetch('http://localhost:3000/authors', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(authorData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Author added successfully!');
        console.log(data); // You can log the response data if needed
    })
    .catch(error => {
        alert('Error adding author!');
        console.error(error);
    });
});
