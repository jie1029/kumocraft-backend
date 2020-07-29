const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const connect = require('./schemas');
const multer = require('multer');
connect();

//post body 전달을 위해 body-parser이 있어야 한다고 함
app.use(bodyParser.json());

// app.use((req, res, next) => {
//     console.log('new request', req.method, req.path, new Date().toLocaleTimeString());
//     next();
// });

app.all("/*", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, token"
    );
    res.header("Access-Control-Allow-Methods","*");
    // 기타 헤더 설정
    next();
});

var accessRouter = require('./router/access');
app.use('/access', accessRouter);
var noticeRouter = require('./router/notice');
app.use('/notice',noticeRouter);
var adminRouter = require('./router/admin');
app.use('/admin',adminRouter);

app.get("/", (req, res) => {
    // User.find({ email: "testEmail1" })
    //     .then((users) => {
    //         res.json({ users })
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //         next(err);
    //     })
    res.send("안녕");
});

app.listen(80, function () {
    console.log("App is running on port 80");
});


