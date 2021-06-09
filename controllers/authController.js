//dependecies
var exports = module.exports = {};
var  Validator = require('validatorjs');
jwt = require('jsonwebtoken');

//models 
let User = require("../models/User"); 
var restHelper = require('../helpers/restFunctions');
var Rememberable = require('../models/Rememberable');
var passport_secret = 'bloggry';
exports.signup = function(req, res) {
  req.body.plan_id = 0;
   new User(req.body).save(function(err,user) {
    if (err) {    
      if (err.name === 'MongoError' && err.code === 11000) {
        return res.json({success: false, msg: 'email must be unique',err}); 
      }
      return res.json({success: false, msg: err});
   }
   user.assignRole('User');
    if(req.body.type == 1){
           // if user is found and password is right create a token
           let token = jwt.sign(user.toJSON(), passport_secret,{});
           // return the information including token as JSON
          return res.json({success: true, token: 'Bearer ' + token});
    }
    //static  token 
    var token  = 1234;
    Rememberable.findOne({user_id:user._id},function(err,data){
      if(err)return res.json({success:false,msg:"failed to remember Otp"},404);
      if(!data){
        new Rememberable({
          user_id:user._id,
          token:token,
          active:1
        }).save(function(error){
            if(err){
              if (error.name === 'MongoError' && error.code === 11000) {
                return res.json({success: true, msg: err}); 
              }
              return res.json({success: true, msg: err},400);
            }
            restHelper.sendMail(req.body.email,'hello','token');
            return res.json({success: true, msg: 'Otp sent'});
        });
      }
      else {
        data.token = token;
        data.active = 1 ;
        data.save(function(err){
           if(err) return res.json({success:false,msg:'somthing went wrong!!'});
           restHelper.sendMail(req.body.email,'hello','token');
           return res.json({success: true, msg: 'Otp sent'});
        })
      }
    });
  });
};
exports.signin = function(req, res) {
  if(req.body.type == 1){
    User.findOne({email:req.body.email,social_id:req.body.social_id },function(err,user){
      if(err)return res.json({success:false,msg:"Somthing went wrong!!"},404);
      if(!user){ return res.json({success:false,msg:"User not found"},404)}
      else {
          // if user is found and password is right create a token
          let token = jwt.sign(user.toJSON(), passport_secret,{});
          // return the information including token as JSON
          res.json({success: true, token: 'Bearer ' + token});
      }
    });
}
else {
  User.findOne({email:req.body.email},function (err,user){
    if(err)return res.status(404).json({success:false,err});
    if(!user)return res.json({success:false,msg:"User not found !!!"},404);
        //static  token 
        var token  = 1234;
        new Rememberable({
        user_id:user._id, 
        token:token,
        active:1
        }).save(function(error,data){
          if(err)return res.json({success:false,msg:"Somthing went wrong!!"},404);
          if(!user){ return res.json({success:false,msg:"User not found"},404)}
          else {
            restHelper.sendMail(req.body.email,'hello','token');
            return res.json({success: true, msg: 'Otp sent'});
          }
        });
  });
}
};
exports.verifyOtp = function (req,res){
  User.findOne({email:req.body.email},function(err,user){
    if(err)return res.json({success:false,msg:"Email not found !!!"},404);
    if(!user)return res.json({success:false,msg:"email  not found !!!"},404);
    Rememberable.findOne({user_id: user. _id },function(err,data){
      if(err)return res.json({success:false,msg:"Email not found !!!"},404);
      if(!data)return res.json({success:false,msg:"rememberable  not found !!!"},404)
      if(data.token == req.body.otp){
        User.findOne({ email:req.body.email },function(err,user){
          if(err)return res.json({success:false,msg:"User not found !!!"},404);
            // if user is found and password is right create a token
            let token = jwt.sign(user.toJSON(), passport_secret,{});
            // return the information including token as JSON
            res.json({success: true, token: 'Bearer ' + token});
        });
      }
    });
  });
}
exports.registerFirebaseToken  =function(req,res){
  var validate  = new Validator(req.body,{
    firebase_token:"required|string",
  }); 
  if(!validate.passes()){
      res.status(404).json(validate.errors);
  }
  User.findByIdAndUpdate(req.user._id,{firebase_token:req.body.firebase_token},{useFindAndModify:true},function(err){
    if(err) return res.json({success:false,err});
    return res.json({success:true})
  });
}