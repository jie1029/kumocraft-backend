const express = require("express");
const router = express.Router();
const multer = require('multer');
var Notice = require("../schemas/notice");
const getFormatDate = require('../js/formatDate');
router.use(express.static("images"));

var imageStorage = multer.diskStorage({
    destination:function(req,file,callback){
        callback(null,"./images/");
    },
    filename:function(req,file,callback){
        //파일명 설정
        var date = req.body.date;
        var fileName = file.originalname;
        var dateString = getFormatDate(date);

        // var mimeType;

        // switch(file.mimetype){
        //     case "image/jpeg":
        //         mimeType = "jpg";
        //         break;
        //     case "image/png":
        //         mimeType = "png";
        //         break;
        //     case "image/gif":
        //         mimeType = "gif";
        //         break;
        //     case "image/bmp":
        //         mimeType = "bmp";
        //     default:
        //         mimeType = "jpg";
        //     break;
        // }

        callback(null,dateString+'-'+fileName);
    }
})

var upload = multer({
    storage:imageStorage
});

router.post("/input",upload.single("img"),(req,res)=>{
    let title = req.body.title;
    let contents = req.body.contents;
    let file = req.file;
    let date = req.body.date;
    let dateString = getFormatDate(date);
    let image = dateString+'-'+file.originalname;

    const notice = new Notice({
        title:title,
        contents:contents,
        date:date,
        image:image
    });

    notice.save((err)=>{
        if (err) res.json({status:"error"})
        else res.json({ status: "success" });
    })
    res.json({ status: "fail" });
});

router.get("/show",(req,res)=>{
    Notice.find({},{title:true,writer:true,date:true})
    .then((notices) => {
        res.json({status:"success",notices:notices});
    })
    .catch((err)=>{
        console.log(err);
        res.json({status:"error"});
    });
});

router.get("/detail/:id",(req,res)=>{
    let _id = req.params.id;
    Notice.find({_id:_id})
    .then((notice) => {
        res.json({status:"success",notice:notice});
    })
    .catch((err)=>{
        res.json({status:"error"});
    });

});

module.exports = router;