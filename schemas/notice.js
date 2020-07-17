const mongoose = require("mongoose");
const {Schema} = mongoose;

const noticeSchema = new Schema({
    title:{
        type:String,
        required: true,
    },
    contents:{
        type:String
    },
    image:{
        type:String,
        default:null
    },
    writer:{
        type:String,
        default:"admin"
    },
    date:{
        type:String,
        required:true
    },
    num:{
        type:String
    }
},{
    versionKey:false
});

module.exports = mongoose.model('Notice',noticeSchema,"notice");


