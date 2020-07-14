const express = require('express');
const router = express.Router();
const mailTable = require('../js/mailTable');
const managerMail = require("../manager-mail.json");
const nodemailer = require("nodemailer");
const generateCode = require('../js/code.js');

router.post("/send",(req,res)=>{
    let mail = req.body.email;
    let code = generateCode.randomCode();

    console.log(mail+" "+code)
   
    mailTable.set(mail,code);
    setTimeout(()=>{deleteCodeTable(mail)},300000);

    let transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:managerMail.mail,
            pass:managerMail.password
        }
    });

    let mailOptions = {
        from:managerMail.mail,
        to: mail,
        subject:"kumocraft인증 메일입니다.",
        text:mailTable.get(mail)+" 를 입력해주세요!"
    }

    transporter.sendMail(mailOptions,(err,info)=>{  
        if(err){
            console.log(err); 
            let resJson = {status:'fail', counter:5}
            res.json(resJson);
        }
        else{
            console.log('Email sent: '+info.response);
            let resJson = {status:'success', counter:5}
            res.json(resJson);
        }
    });
});


router.post("/code",(req,res)=>{
    console.log(req.body.code+req.body.email);
    console.log(mailTable);
    let inputCode = req.body.code;
    let mail = req.body.email;
    let mailCode = mailTable.get(mail);
    
    // deleteCodeTable(mail);
    console.log(mail);
    console.log(mailCode);

    // (mailCode == inputCode) ? res.json({status:"success"}):res.json({status:"fail"});
    if(mailCode ==inputCode)
    {
        res.json({status:"success"});
        mailTable.delete(mail);
    }
    else res.json({status:"fail"});
})

module.exports = router