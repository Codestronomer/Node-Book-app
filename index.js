const express = require('express');
const { createLogger, format, transports } = require('winston');
const fs = require('fs');
const Joi = require('joi');
const { removeBook, getAllBooks, getBook, addBook } = require('./books.js')
const app = express()

logLevel = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5
}

const logger = createLogger({
    level: logLevel,
    defaultMeta: {
        service: "Book-creation service"
    },
    transports: [new transports.Console()],
})


app.use(express.json())

const port = process.env.PORT || 3000

app.listen(port, (err) => {
    if (err) {
        logger.log('error', err)
    } else {
        logger.info(`Server is listening on port ${port}`)
    }
})


// Gets all books
app.get('/', async (req, res) => {
    try {
        books = getAllBooks();
        if (books.length == 0) {
            res.send('Library is empty, Try adding some books')
        } else {
            res.send(books)
        }
    } catch (e) {
        logger.log('error', e)
    }
})

// Returns book with the given id
app.get('/:id', async (req, res) => {
    let id = parseInt(req.params.id)
    book = getBook(id);
    if (!book) {
        return res.status(404).send('The book with the given ID was not found')
    }
    res.send(book)
});

// Validates the input
function validateBook(book) {
    const schema = Joi.object({
        title: Joi.string().min(2).required(),
        author: Joi.string().min(3).required(),
        img: Joi.string().min(5).required()
    });

    return schema.validate({ title: book.title, author: book.author, img: book.img })
}

// Creates a new book
app.post('/', async (req, res) => {
    let { error, value } = await validateBook(req.body)
    if (error) {
        logger.error(error)
        res.status(400).send(error.details[0].messsage)
    } else {
        const books = getAllBooks();
        const book = {
            id: books.length + 1,
            title: req.body.title,
            author: req.body.author,
            img: req.body.img
        };
        addBook(book);
        res.send('Book created successfully')
    }
})

// Updates a book
app.put('/:id', async (req, res) => {
    const book = books.find(book => book.id == parseInt(req.params.id))
    if (!book) {
        return res.status(404).send('The book with the given ID was not found')
    }

    if (req.body.title) {
        const { error, value } = validateBook({ title: req.body.title })
        if (error) {
            logger.error(error)
            res.status(400).send(error.details[0].messsage)
        } else {
            book.title = req.body.title
        }
    } else if (req.body.author) {
        const { error, value } = validateBook({ author: req.body.author })
        if (error) {
            logger.error(error)
            res.status(400).send(error.details[0].messsage)
        } else {
            book.author = req.body.author
        }
    } else if (req.body.img) {
        const { error, value } = validateBook({ img: req.body.img })
        if (error) {
            logger.error(error)
            res.status(400).send(error.details[0].messsage)
        } else {
            book.img = req.body.img
        }
    }
    res.send("Book updated successfully")
})

// Deletes a book
app.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    const book = removeBook(id)
    if (book) {
        res.send(`Book with ID ${id} was deleted`)
    }
    res.send('Book deleted successfully')
})