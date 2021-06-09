//dependecies
var exports = module.exports = {};
jwt = require('jsonwebtoken');
var  Validator = require('validatorjs');
//models 
let User = require("../../models/User"); 
var restHelper = require('../../helpers/restFunctions');
var Rememberable = require('../../models/Rememberable');
var passport_secret = 'bloggry';
exports.signin = function(req, res) {
  var validate  = new Validator(req.body,{
    email:"required|email",
    password:"required"
  }); 
  if(!validate.passes()){
      res.status(404).json(validate.errors);
  }
  User.findOne({email:req.body.email,password:req.body.password},function(err,user){
    if(err)return res.json({success:false,msg:"Somthing went wrong!!"},404);
    if(!user){ 
        return res.json({success:false,msg:"User not found"},404);
      }
    else {
      user.hasRole('Admin',function(d){
          if(d){
            // if user is found and password is right create a token
          let token = jwt.sign(user.toJSON(),passport_secret,{ expiresIn: 86400 * 7 });
          // return the information including token as JSON
          res.json({success: true, token: 'Bearer ' + token});
          }
          else{
            res.json({success:false,msg:"Users not allowed"},404);
          }
      });
    }
  });
};
