const express = require('express');
const { createLogger, format, transports } = require('winston');
const mongoose = require('mongoose')
const Book = require('./models/books.js')
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

const username = "johnrumide" //process.env.username;
const password = "DRgF9KDVccnZD0hJ" //process.env.password;


dbUrl = `mongodb+srv://johnrumide:DRgF9KDVccnZD0hJ@cluster0.7caoa.mongodb.net/books?retryWrites=true&w=majority`
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log('Connected to db'))
    .catch((err) => console.log(err))


app.get('/single-book', (req, res) => {
    Book.findById("61fe563ce9bd1d9a8f46bd46")
        .then((result) => {
            res.send(result)
        }).catch((err) => console.log(err))
})

app.use(express.json())
app.use(express.urlencoded({ extended: true}))

const port = process.env.PORT || 3000

app.listen(port, (err) => {
    if (err) {
        logger.log('error', err)
    } else {
        logger.info(`Server is listening on port ${port}`)
    }
})


// Home
app.get('/', async (req, res) => {
    res.redirect('/books')
})

app.get('/books', (req, res) => {
    Book.find().sort({ createdAt: -1})
        .then((result) => {
            res.send(result)
        }).catch((err) => console.log(err))
})

// Returns book with the given id
app.get('/:id', async (req, res) => {
    let id = parseInt(req.params.id)
    Book.findById(id)
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            console.log(err)
            res.status(404).send('The book with the given ID was not found')
        })
    
    });


// Creates a new book
app.post('/', async (req, res) => {
        
    const book = new Book({title, img, author} = req.body)

    book.save()
        .then((result) => {
            res.send('Book created successfully', result)
            res.redirect('/books')
        }).catch((err) => {
            console.log(err)
        })

    })

// // Updates a book
// app.put('/:id', async (req, res) => {
//     const book = books.find(book => book.id == parseInt(req.params.id))
//     if (!book) {
    //         return res.status(404).send('The book with the given ID was not found')
//     }

//     if (req.body.title) {
    //         const { error, value } = validateBook({ title: req.body.title })
//         if (error) {
    //             logger.error(error)
//             res.status(400).send(error.details[0].messsage)
//         } else {
    //             book.title = req.body.title
//         }
//     } else if (req.body.author) {
//         const { error, value } = validateBook({ author: req.body.author })
//         if (error) {
//             logger.error(error)
//             res.status(400).send(error.details[0].messsage)
//         } else {
//             book.author = req.body.author
//         }
//     } else if (req.body.img) {
//         const { error, value } = validateBook({ img: req.body.img })
//         if (error) {
//             logger.error(error)
//             res.status(400).send(error.details[0].messsage)
//         } else {
//             book.img = req.body.img
//         }
//     }
//     res.send("Book updated successfully")
// })

// // Deletes a book
// app.delete('/:id', async (req, res) => {
    //     const id = parseInt(req.params.id)
//     const book = removeBook(id)
//     if (book) {
    //         res.send(`Book with ID ${id} was deleted`)
    //     }
    //     res.send('Book deleted successfully')
    // })
    //
    
    
// Validates the input
// function validateBook(book) {
//     const schema = Joi.object({
//         title: Joi.string().min(2).required(),
//         author: Joi.string().min(3).required(),
//         img: Joi.string().min(5).required()
//     });
    
    //     return schema.validate({ title: book.title, author: book.author, img: book.img })
    // }