const mongoose = require("mongoose");
const {Schema} = mongoose;

const noticeSchema = new Schema({
    _id:{
        type:Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    title:{
        type:String,
        required: true,
    },
    contents:{
        type:String,
        required:true
    },
    image:{
        type:String,
    },
    writer:{
        type:String,
        default:"admin"
    },
    date:{
        type:Date,
        required:true
    }
},{
    versionKey:false
});

module.exports = mongoose.model('Notice',noticeSchema,"notice");

