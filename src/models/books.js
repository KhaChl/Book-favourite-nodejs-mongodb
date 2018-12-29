const mongoose = require('mongoose');
const { Schema } = mongoose;

const BookSchema = new Schema({
    user: { type: String, require: true },
    title: { type: String, require: true },
    url: { type: String, require: true },
    description: { type: String, require: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('book', BookSchema);
