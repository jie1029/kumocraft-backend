const express = require('express');
const router = express.Router();
const mailTable = require('../js/mailTable');
const managerMail = require("../config/manager-mail.json");
const masterMail = require('../config/master-mail.json');
const nodemailer = require("nodemailer");
const generateCode = require('../js/code.js');
const formatDate = require('../js/formatDate');
const User = require('../schemas/user');


let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: managerMail.mail,
        pass: managerMail.password
    }
});

router.post("/mail-send", (req, res) => {
    let mail = req.body.email;
    let code = generateCode.randomCode();

    mailTable.set(mail, code);
    setTimeout(() => { mailTable.delete(mail) }, 300000);

    let mailOptions = {
        from: managerMail.mail,
        to: mail,
        subject: "kumocraft인증 메일입니다.",
        text: mailTable.get(mail) + " 를 입력해주세요!"
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            // console.log(err);
            let resJson = { status: 'error', counter: 5 }
            res.json(resJson);
        }
        else {
            // console.log('Email sent: ' + info.response);
            let resJson = { status: 'success', counter: 5 }
            res.json(resJson);
        }
    });
});


router.post("/input-code", (req, res) => {
    let inputCode = req.body.code;
    let mail = req.body.email;
    let mailCode = mailTable.get(mail);

    // deleteCodeTable(mail);

    // (mailCode == inputCode) ? res.json({status:"success"}):res.json({status:"fail"});
    if (mailCode == inputCode) {
        res.json({ status: "success" });
        mailTable.delete(mail);
    }
    else res.json({ status: "fail" });
});

router.post("/input-nick", (req, res) => {

    User.find({ email: req.body.email })
        .then((users) => {
            // console.log(users.length)
            if (users.length != '0')
                res.json({ status: "overlap", nick: users[0].nick });
            else {
                const user = new User({
                    email: req.body.email,
                    nick: req.body.nick
                })
                user.save((err) => {
                    if (err) {
                        // console.log(err);
                        res.json({ status: "error" });
                    }
                    else
                    {
                        let mailOptions = {
                            from: managerMail.mail,
                            to: masterMail.mail,
                            subject: "마크 닉네임 입력 요청!",
                            text: formatDate(new Date())+"\n"+req.body.nick+" 를 등록해주세요!"
                        }

                        transporter.sendMail(mailOptions, (err, info) => {
                            if (err) {
                                // console.log(err);
                            }
                            else {
                                // console.log('Email sent: ' + info.response);
                            }
                        });
                        res.json({ status: "success" });
                    }
                })
            }
        })
        .catch((err) => {
            // console.log(err);
            res.json({ status: "error" });
            
        })
});


module.exports = router;