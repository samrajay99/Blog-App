const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
   const Authorization= req.headers.authorization;
   
   if(Authorization && Authorization.startsWith('Bearer')){
     const token = Authorization.split(' ')[1];
     jwt.verify(token, process.env.JWT_KEY,(err,info)=>{
      if(err){
          return res.status(402).json({error: "Invalid Token"});
      }
      console.log("User Info", info);
      req.user = info;
      next();
     })
   } else {
         return res.status(402).json({error: "Unauthorization...Token not provided"});
      }
   }



module.exports = authMiddleware;