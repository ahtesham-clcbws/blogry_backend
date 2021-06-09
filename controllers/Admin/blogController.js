var exports = module.exports = {};
var User  = require('../../models/User');
var Blog  = require('../../models/Blog');
var  Comment = require('../../models/Comment');
var Report  = require('../../models/Report');
var  Validator = require('validatorjs');
var restFunctions = require('../../helpers/restFunctions');

exports.index = function(req,res){
    Blog.find({})
    .limit(parseInt(req.params.limit))
    .skip(parseInt(req.params.skip)*parseInt(req.params.limit))
    .exec(function(err,blogs){
        if(err){ return res.json({success:false,err}); }
        res.json(blogs);
    });
}
exports.show = function(req,res) {
  Blog.findById(req.params.blog_id).exec(function(err,blog){
    if(err){
      return res.json(err);
    }
    return res.json(blog);
  });
}
exports.unableDisable  = function(req,res){
  var validate  = new Validator(req.body,{
    approve:"required"
  }); 
  if(!validate.passes()){
    res.status(404).json(validate.errors);
  }
  var current_blog_id = req.params.blog_id;
  var  { approve }  = req.body;
  Blog.findById(current_blog_id,function(err,blogs){
    if(err) res.json({success:false,err})
    blogs.approve = approve;
    if(approve == 0){
        blogs.disapprove_reason  = req.body.disapprove_reason ;
        //restFunctions.sendMail();
    }
    blogs.save(err=>{
      if(err) res.json({success:false,err})
      res.json({ success:true });
    })
  });
}
exports.likeCount = function(req,res){
    Blog.find({}).select('like_count').exec(function(err,blog){
      var count = 0
      blog.forEach(element => {
        try {
          count = count+ element.like_count.length;
        } catch (error) {} 
      });  
      res.json({success:true,count});
    });
}
exports.saveCount = function(req,res){
  Blog.find({}).select('save_count').exec(function(err,blog){
    var count = 0
    blog.forEach(element => {
      try {
        count = count+ element.save_count.length;
      } catch (error) {} 
    });  
    res.json({success:true,count});
  });
}
exports.viewCount = function(req,res){
  Blog.find({}).select('view_count').exec(function(err,blog){
    var count = 0
    blog.forEach(element => {
      try {
        count = count+ element.view_count.length;
      } catch (error) {} 
    });  
    res.json({success:true,count});
  });
}
exports.commentCount = function(req,res){
  Comment.countDocuments({}).exec(function(err,count){
    if(err) return res.json({success:false,err})
    res.json({success:true,count});
  });
}
exports.blogCount = function(req,res){
  Blog.countDocuments({disable:0}).exec(function(err,count){
    if(err) return res.json({success:false,err})
    res.json({success:true,count});
  });
}
exports.blockComment  = function(req,res){
    var validate  = new Validator(req.body,{
        disable:"required"
      }); 
      if(!validate.passes()){
        res.status(404).json(validate.errors);
      }
    Comment.findById(req.params.comment_id,function(err,comment){
        if(err) return res.status(404).json({success:false,err});
        if(!comment) return res.status(404).json({success:false,err:"comment not found!!!"})
        comment.disable = req.body.disable;
        comment.save(function(err){
            if(err) return res.status(404).json({success:false,err});
            return res.json({ success:true,comment});
        });
    })
}
exports.getAllReport = function(req,res){
  Report.find({}).exec(function(err,report){
    if(err) return res.json({success:false,err})
    res.json(report);
  });
}
exports.getReport = function(req,res){
  Report.findById(req.params.report_id).exec(function(err,report){
    if(err) return res.json({success:false,err})
    res.json(report);
  });
}
exports.reportUpdate = function(req,res){
  var validate  = new Validator(req.body,{
    is_complete:"required",
  }); 
  if(!validate.passes()){
      res.status(404).json(validate.errors);
  }
  Report.findByIdAndUpdate(req.params.report_id,{is_complete:req.body.is_complete},{useFindAndModify:false},function(err,report){
    if(err) return res.json({success:false,err})
    res.json({success:true,report});
  });
}