const express = require("express");
const router = express.Router();
const multer = require('multer');
var Notice = require("../schemas/notice");
const getFormatDate = require('../js/formatDate');
const notice = require("../schemas/notice");
router.use(express.static("images"));

var imageStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./images/");
    },
    filename: function (req, file, callback) {
        //파일명 설정
        var fileDate = req.body.fileName;
        var fileName = file.originalname;
        console.log("multer " + file);
        console.log("multer " + fileDate);
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

        callback(null, fileDate + '_' + fileName);
        // callback(null,'-'+fileName);
    }
})

var upload = multer({
    storage: imageStorage
});


router.post("/input", upload.single("img"), (req, res, next) => {
    let title = req.body.title;
    let contents = req.body.contents;
    let file = req.file;
    let date = req.body.date;
    let fileDate = req.body.fileName;
    // console.log(req.body);
    console.log("라우터 " + date);
    console.log("라우터 " + fileDate);
    console.log("라우터 " + file);
    // console.log(file)
    let image;
    if (file != undefined)
        image = fileDate + '_' + file.originalname;
    else image = null
    // console.log(file.originalname);
    console.log(image);

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
            next(err);
        })

});

router.get("/show/:page", (req, res) => {
    var page = req.params.page;
    console.log(req.params.page);
    Notice.find({}).count()
        .then((count) => {
            Notice.find({}, { title: true, writer: true, date: true }).sort({ amount: 1, _id: -1 }).skip((page - 1) * 10).limit(10)
                .then((notices) => {
                    // console.log(notices)          
                    notices = notices.map((notice, i) => {
                        notice.num = (i + 1) + ((page - 1) * 10);
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
            next(err);
        });
});

module.exports = router;