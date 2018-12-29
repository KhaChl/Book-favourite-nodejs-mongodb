const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs')


const UserSchema = new Schema({
    email: { type: String, require: true },
    name: { type: String, require: true },
    surname: { type: String, require: true },
    password: { type: String, require: true },
    date: { type: Date, default: Date.now }
});

UserSchema.methods.hashpassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

UserSchema.methods.matchpassword = async function (password, db) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);