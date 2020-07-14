var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var connect = require('./schemas');
connect();

//post body 전달을 위해 body-parser이 있어야 한다고 함
app.use(bodyParser.json());
app.use((req, res, next) => {
    console.log('new request', req.method, req.path, new Date().toLocaleTimeString());
    next();
});

app.all("/*", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    // 기타 헤더 설정
    next();
});

var mailRouter = require('./router/mail');
app.use('/mail', mailRouter);
var noticeRouter = require('./router/notice');
app.use('/notice',noticeRouter);

var User = require('./schemas/user');

app.get("/", (req, res) => {

    // User.find({ email: "testEmail1" })
    //     .then((users) => {
    //         res.json({ users })
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //         next(err);
    //     })
    res.send("안녕")
});


app.post("/input-nick", (req, res) => {

    User.find({ email: req.body.email })
        .then((users) => {
            console.log(users.length)
            if (users.length != '0')
                res.json({ status: "overlap", nick: users[0].nick });
            else {
                const user = new User({
                    email: req.body.email,
                    nick: req.body.nick
                })
                user.save((err) => {
                    if (err) return handleError(err);
                    res.json({ status: "success" });
                })
            }
        })
        .catch((err) => {
            console.log(err);
            res.json({ status: "fail" });
        })
})

app.listen(80, function () {
    console.log("App is running on port 80");
});
