const Joi = require('joi');


const userMiddleware = (req, res, next) => {
   const{name, email, password,password2} = req.body;
   const userInfo = {name, email, password, password2};

   const schema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email({minDomainSegments:2,tlds:{allow:['com','net']}}).required(),
      password: Joi.string().min(6).max(15).required(),
      password2:Joi.ref('password')
   })
   const{error}=schema.validate(userInfo);
   if(error){
      return res.status(400).json({
         error: error.details[0].message});
   }
    next();
}


module.exports = {userMiddleware};