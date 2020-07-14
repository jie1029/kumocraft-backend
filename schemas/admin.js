const mongoose = require('mongoose');

const {Schema} = mongoose;

const adminSchema = new Schema({
    id:{
        type:String,
        required:true
    },
    pw:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('Admin',adminSchema,"adminTable");

