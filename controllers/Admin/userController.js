var exports = module.exports = {};
let User = require("../../models/User"); 
var  Validator = require('validatorjs');
exports.index = function(req,res) {
    User.find({})
    .limit(parseInt(req.params.limit))
    .skip(parseInt(req.params.skip)*parseInt(req.params.limit))
    .exec(function(err,users){
      if(err){
        return res.json(err);
      }
      return res.json(users);
    });
}
exports.Adminindex = function(req,res) {
  User.find({})
  .limit(parseInt(req.params.limit))
  .skip(parseInt(req.params.skip)*parseInt(req.params.limit))
  .exec(function(err,users){
    if(err){
      return res.json(err);
    }
    return res.json(users);
  });
}
exports.store = function (req,res){
  var validate  = new Validator(req.body,{
    username:"required",
    name:"required",
    email:"required|email",
    password:"required|min:4",
    role:"required"
  }); 
  if(!validate.passes()){
    res.status(404).json({success:false,err:validate.errors});
  }
  req.body.type = 2;
  var roleToAssign = req.body.role;
  switch(roleToAssign){
    case "User":
      User.findById(req.user._id,function(err,user){
        user.hasPermission('addUser',function(is){
          new User(req.body).save(function(err,newuser) {
            if (err) {    
              if (err.name === 'MongoError' && err.code === 11000) {
                return res.status(404).json({success: false, err: 'email must be unique',err}); 
              }
              return res.status(404).json({success:false,err});
            }
            newuser.assignRole(roleToAssign);
            return res.json({success: true,newuser});
          });
        });
      });
      break;
      case "Admin":
        User.findById(req.user._id,function(err,user){
          user.hasPermission('addAdmin',function(is){
            new User(req.body).save(function(err,newuser) {
              if (err) {    
                if (err.name === 'MongoError' && err.code === 11000) {
                  return res.status(404).json({success: false, err: 'email must be unique',err}); 
                }
                return  res.status(404).json({success:false,err});
              }
              newuser.assignRole(roleToAssign);
              return res.json({success: true,newuser});
            });
        });
      });
      break;
      default:
        return res.status(404).json({success:false,err:"role not found"});
  }
}
exports.show = function(req,res) {
  User.findById(req.params.user_id).exec(function(err,users){
    if(err){
      return res.json(err);
    }
    return res.json(users);
  });
}
exports.unableDisable  = function(req,res){
  var validate  = new Validator(req.body,{
    disable:"required"
  }); 
  if(!validate.passes()){
    res.status(404).json(validate.errors);
  }
  var current_user_id = req.params.user_id;
  var  { disable }  = req.body;
  User.findById(current_user_id,function(err,user){
    if(err) res.json({success:false,err})
    user.disable = disable;
    user.save(err=>{
      if(err) res.json({success:false,err})
      res.json({ success:true });
    })
  });
}