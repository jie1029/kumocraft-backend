const jwt = require("jsonwebtoken");
const secretKey = require("../../config/jwt");

exports.verifyToken = (req,res,next) =>{
    
    // const clientToken = req.cookies.user;
    const token = req.header('token');
    // console.log(token)
    try {
        const decoded = jwt.verify(token, secretKey.secret);
        if(decoded)
        {
            next();
        }
        else{
            res.json({status:"unauthorized"});
        }
    }
    catch(err)
    {
        // console.log(err);
        res.json({status:"tokenExpired"});
    }
}