const express = require("express");
const router = express.Router();
const adminController = require("./controllers/admin.controller");
const {verifyToken} = require("./middlewares/authorization");

router.post("/login",adminController.createToken);

router.post("/token-check",verifyToken,(req,res,next)=>{
    res.json({status:"vaildToken"});
});
router.post("/logout",(req,res,next)=>{

});

module.exports = router;