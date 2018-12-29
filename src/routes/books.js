const express = require('express');
const route = express.Router();
const Book = require('../models/books');
const { isLoggedIn, isNotLoggedIn } = require('../helpers/auth');

route.get('/', isLoggedIn, async (req, res) => {
    const books = await Book.find({ user: req.user.id }).sort({ date: 'desc' });
    res.render('books/list', { books });
});

route.get('/add', isLoggedIn, (req, res) => {
    res.render('books/add');
});

route.post('/add', async (req, res) => {
    const { title, url, description } = req.body;
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('url', 'Url is required').notEmpty();
    req.checkBody('url', 'A valid url is required').isURL();
    req.checkBody('description', 'Description is required').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        res.render('books/add', {
            errors: errors,
            title,
            url,
            description,
        });
    } else {
        try {
            const newBook = new Book({ title, url, description });
            newBook.user = req.user.id;
            await newBook.save();
            req.flash('success', 'Book saved successfully');
        } catch (error) {
            req.flash('error', 'Error saving book')
        }
        res.redirect('/books');
    }
});

route.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const book = await Book.findById(id);
    res.render('books/edit', { book });
})

route.put('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { title, url, description } = req.body;
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('url', 'Url is required').notEmpty();
    req.checkBody('url', 'A valid url is required').isURL();
    req.checkBody('description', 'Description is required').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        const book = {
            id,
            title,
            url,
            description
        };
        res.render('books/edit', {
            errors: errors,
            book
        });
    } else {
        try {
            await Book.findByIdAndUpdate(id, { title, url, description })
            req.flash('success', 'Book edited successfully')
        } catch (error) {
            req.flash('error', 'Error edit');
        }
        res.redirect('/books');
    }
});

route.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Book.findByIdAndDelete(id);
        req.flash('success', 'Book removed successfully');
    } catch (error) {
        req.flash('error', 'Error removed book');
    }
    res.redirect('/books');
});

module.exports = route;