const express = require("express");
const router = express.Router();
const noticeSchema = require('../schemas/notice');
const multer = require('multer');
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

router.post("/login",(req,res)=>{
    let id = req.body.id;
    let pw = req.body.pw;

});

var Notice = require("../schemas/notice");

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
        if (err) return handleError(err);
        res.json({ status: "success" });
    })
    
    res.json({ status: "fail" });
    // Notice.find({})
    // .then((notice)=>{
    //     console.log(notice);
    // });
});

router.get("/show",(req,res)=>{
    Notice.find({},{_id:true,title:true,writer:true,date:true})
    .then((notice) => {
        res.json({status:"success",notice:notice});
    })
    .catch((err)=>{
        console.log(err);
        res.json({status:"fail"});
    });
});

router.get("/detail/:_id",(req,res)=>{
    let _id = req.params._id;
    console.log(tid);
    Notice.find({_id:_id})
    .then((notice) => {
        res.json({status:"success",notice:notice});
    })
    .catch((err)=>{
        res.json({status:"fail"});
    });

});

// router.delete("/test",()=>{
//     console.log("delete다")
// })

module.exports = router;