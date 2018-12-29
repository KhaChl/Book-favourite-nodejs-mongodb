const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/books-app', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
})
    .then(db => console.log('db is connected'))
    .catch(error => console.log(error));

