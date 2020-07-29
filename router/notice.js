const express = require("express");
const router = express.Router();
// const multer = require('multer');
var Notice = require("../schemas/notice");
const config = require("../js/config");
const multer = require("multer");
router.use(express.static("images"));
const {verifyToken} = require("./middlewares/authorization");

var imageStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./images");
    },
    filename: function (req, file, callback) {
        //파일명 설정
        var fileDate = req.body.fileName;
        var fileName = file.originalname;
        callback(null, fileDate + '_' + fileName);

    }
})

var upload = multer({
    storage: imageStorage
});


router.post("/input",verifyToken,upload.single("img"), (req, res, next) => {

    // console.log(adminID);
    // res.locals.adminID = status.adminID;
    let title = req.body.title;
    let contents = req.body.contents;
    let file = req.file;
    let date = req.body.date;
    let fileDate = req.body.fileName;
    let image;
    if (file != undefined)
        image = fileDate + '_' + file.originalname;
    else image = null

    const notice = new Notice({
        title: title,
        contents: contents,
        date: date,
        image: image
    });

    notice.save()
        .then(() => {
            res.json({ status: "success" });
                    })
        .catch((err) => {
            console.log(err);
            res.json({ status: "error" })
            
        });
});

router.delete("/delete",verifyToken,(req,res)=>{
    
    Notice.remove({_id:req.body.noticeID})
    .then(()=>{
        res.json({status:"success"});
    })
    .catch((err)=>{
        console.log(err);
        res.json({status:"error"});
    })
   

})

router.get("/show/:page", (req, res) => {
    var page = req.params.page;
    console.log(req.params.page);
    Notice.find({}).count()
        .then((count) => {
            Notice.find({}, { title: true, writer: true, date: true })
                .sort({ amount: 1, _id: -1 })
                .skip((page - 1) * config.ONE_PAGE_NUMBER)
                .limit(config.ONE_PAGE_NUMBER)
                .then((notices) => {
                    // console.log(notices)          
                    notices = notices.map((notice, i) => {
                        notice.num = (i + 1) + ((page - 1) * config.ONE_PAGE_NUMBER);
                        return notice;
                    });
                    res.json({ status: "success", notices: notices, count: count });

                })
                .catch((err) => {
                    console.log(err);
                    res.json({ status: "error" });
                });
        });

});

router.get("/detail/:id", (req, res) => {
    let _id = req.params.id;
    Notice.find({ _id: _id })
        .then((notice) => {
            res.json({ status: "success", notice: notice[0] });
        })
        .catch((err) => {
            console.log(err);
            res.json({ status: "error" });
            
        });
});

module.exports = router;