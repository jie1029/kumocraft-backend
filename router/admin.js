const express = require("express");
const router = express.Router();
const Admin = require("../schemas/admin");

router.post("/login",(req,res)=>{
    let id = req.body.id;
    let pw = req.body.pw;
    Admin.find({$and:[{id:id,pw:pw}]}).count()
    .then((success)=>{
        (success == 1) ? res.json({status:"success"}):res.json({status:"wrong"});
    })
    .catch((err)=>{
        console.log(err);
        res.json({status:"error"});
    });
});

module.exports = router;