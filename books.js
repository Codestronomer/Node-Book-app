const { notEqual } = require('assert')
const fs = require('fs')

const fetchBooks = () => {
    try {
        var bookString = fs.readFileSync('./books.json')
        return JSON.parse(bookString)
    } catch (e) {
        console.log(e)
        return e
    }
};

const saveBooks = (books) => {
    try {
        fs.writeFileSync('./books.json', JSON.stringify(books))
    } catch (e) {
        console.log(e)
    }
};

const getAllBooks = () => {
    return fetchBooks()
};

const getBook = (id) => {
    var books = fetchBooks();
    const book = books.filter((book) => book.id === id)
    return book[0];
};

let addBook = (book) => {
    var books = fetchBooks()

    var duplicateBooks = books.filter((book) => book.title === book.title)
    if (duplicateBooks.length === 0) {
        books.push(book)
        saveBooks(book)
        return book
    } else { return null }
}

const removeBook = (id) => {
    var books = fetchBooks();
    const filteredBooks = books.filter((book) => book.id !== id)
    saveBooks(filteredBooks)
    return books.length !== filteredBooks.length;
};

module.exports = {
    addBook,
    removeBook,
    getAllBooks,
    getBook
}