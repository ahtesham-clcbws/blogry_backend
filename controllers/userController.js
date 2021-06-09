var exports = module.exports = {};
var User  = require('../models/User');
var Blog  = require('../models/Blog');
var Comment = require('../models/Comment');
var Category = require('../models/Category');
var  Validator = require('validatorjs');
var Resize  = require('../helpers/Resize');
var Tag  = require('../models/Tag');
exports.index  = function (req,res){
    return res.json(req.user);
}
exports.update = async function (req,res){
        var updateAble  = {};
        Object.keys(req.body).forEach(keys=>{
            switch(keys){
                case "bio":
                    updateAble.bio = req.body.bio;
                case "name":
                    updateAble.name = req.body.name;   
                default:
                    //
            }
        });
        if(req.file){
          //new Resize(__basedir).save(req.file.path);
           updateAble.avatar = req.file.filename;
        }
        if(!req.user) res.status(401).json({success:false,msg:"user not found"});
        User.findByIdAndUpdate(req.user._id,updateAble,function(err,user){
            if(err) res.status(404).json({ success:false,msg:"",err});
            res.json({success:true});
        });
 }

 exports.getCategory = function (req,res){
    Category.find({},function(err,category){
      if(err) return res.status(404).json({success:false,msg:"somthing went wrong"});
      if(!category) return res.json({success:false,msg:"somthing went wrong"});
        return res.json(category);
    });
  } 

  exports.getTag = function (req,res){
    Tag.find({},function(err,tag){
      if(err) return res.status(404).json({success:false,msg:"somthing went wrong"});
      if(!category) return res.json({success:false,msg:"somthing went wrong"});
        return res.json(tag);
    });
  }

  exports.updateCategory = function(req,res){
    if(req.body.selected_category == ""){
       res.status(404).json({
         success:false,
         errors:{
           type:"selected_category",
           msg:"selected_category is not added"
         }
       })
    }
     User.findOneAndUpdate({ _id : req.user._id },{ selected_category:req.body.selected_category }).then(function(user){
       res.json({success:true});
     }).catch(function(err){
        res.status(404).json({success:false,err});
     });
  }

exports.savedBlog  = function(req,res){
   Blog.find({
     "save_count.user_id":req.user._id
   }).lean().exec(function(err,post){
    if(err) return  res.status(404).json({ success:false,msg:"",err});
       return res.json(post);
   });
 }  
 exports.likedBlog  = function(req,res){
  Blog.find({
    "like_count.user_id":req.user._id
  }).lean().exec(function(err,post){
   if(err) return  res.status(404).json({ success:false,msg:"",err});
      return res.json(post);
  });
}  
exports.viewedBlog  = function(req,res){
  Blog.find({
    "view_count.user_id":req.user._id
  }).lean().exec(function(err,post){
   if(err) return  res.status(404).json({ success:false,msg:"",err});
      return res.json(post);
  });
} 
exports.commentedBlog  = function(req,res){
  Comment.find({
    user_id:req.user._id
  }).lean().exec(function(err,post){
   if(err) return  res.status(404).json({ success:false,msg:"",err});
      return res.json(post);
  });
} 