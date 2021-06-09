var exports = module.exports = {};
var Category = require('../../models/Category');
var User  = require('../../models/User');
var  Validator = require('validatorjs');
exports.index = function (req,res){
  Category.find({},function(err,category){
    if(err) return res.status(404).json({success:false,msg:"somthing went wrong"});
    if(!category) return res.json({success:false,msg:"somthing went wrong"});
      return res.json(category);
  });
}
exports.show = function(req,res){
  Category.findById(req.params.category_id,function(err,category){
      if(!category) res.status(404).json({success:false,err:"category not found !!"});
      res.json(category);
  });
}
exports.delete = function(req,res){
  //delete the plans 
  User.findById(req.user._id,function(err,user){
      user.hasPermission('crudPlan',function(is){
          if(!is) res.status(404).json({success:false,"err":"access denied"});
          Category.findByIdAndDelete(req.params.category_id,{useFindAndModify:false},function(err,category){
              if(err) return  res.status(404).json({success:false,err});
              return res.json({success:true});
          });
      })
  });
}
exports.add = function(req,res){
  var validate  = new Validator(req.body,{
      name:"required|string",
  }); 
  if(!validate.passes()){
    return res.status(404).json(validate.errors);
  }
  User.findById(req.user._id,function(err,user){
      user.hasPermission('crudPlan',function(is){
          if(!is) res.status(404).json({success:false,"err":"access denied"});
          new Category(req.body).save(function(err,category){
              if(err) return  res.status(404).json({success:false,err});
              res.json({success:true,category});
          });
      })
  });
}
exports.update = function(req,res){
  User.findById(req.user._id,function(err,user){
      user.hasPermission('crudPlan',function(is){
          if(!is) res.json({success:false,"err":"access denied"});
          Category.findByIdAndUpdate(req.params.category_id,req.body,function(err,category){
              if(err) res.json({success:false,err});
              res.json({success:true});
          });
      })
  });
}
