var express = require("express");
var app = express();
var nodemailer = require("nodemailer");
var managerMail = require("./manager-mail.json");
var bodyParser = require('body-parser');
var generateCode = require('./code.js');
var mailTable = new Map();

//post body 전달을 위해 body-parser이 있어야 한다고 함
app.use(bodyParser.json());

app.get("/",(req,res)=>{
    res.send("안녕");
})

app.all("/*",(req,res,next)=>{
    res.header("Access-Control-Allow-Origin", "*") 
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    // 기타 헤더 설정
    next();
})


function deleteCodeTable(mail)
{
    if(mailTable.get(mail) != undefined) mailTable.delete(mail);
}

app.post("/mail-send",(req,res)=>{
    console.log("메일 전송 요청");
    
    let mail = req.body.email;
    let code = generateCode.randomCode();

    console.log(mail+" "+code)
   
    mailTable.set(mail,code);
    console.log(mailTable);
    setTimeout(()=>{deleteCodeTable(mail)},300000);

    // res.header("Access-Control-Allow-Origin", "*") 
    // res.header(
    //     "Access-Control-Allow-Headers",
    //     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    // );

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


app.post("/input-code",(req,res)=>{
    console.log("코드 확인 요청")
    console.log(req.body.code+req.body.email);
    console.log(mailTable)
    let inputCode = req.body.code;
    let mail = req.body.email;
    let mailCode = mailTable.get(mail);
    
    deleteCodeTable(mail);
    console.log(mail);
    console.log(mailCode);

    (mailCode == inputCode) ? res.json({status:"success"}):res.json({status:"fail"});
})

app.post("/input-nick",(req,res)=>{
    console.log(" "+req.body.email+" "+req.body.nick);
    res.json({status:"success"});
})

app.listen(80, function(){
    console.log("App is running on port 80");
});
