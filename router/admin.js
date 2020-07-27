const express = require("express");
const router = express.Router();
const adminController = require("./controllers/admin.controller");

router.post("/login",adminController.createToken);

router.post("/logout",(req,res,next)=>{

});

module.exports = router;