const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
        email: {
            type: String,
            required: true,
            unique: true
        },
        nick: {
            type: String,
            required: true,
        }
    }, 
    {
        versionKey:false
});

module.exports = mongoose.model('User', userSchema, 'userTable');