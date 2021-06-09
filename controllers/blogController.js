var exports = module.exports = {};
var User  = require('../models/User');
var Blog  = require('../models/Blog');
var  Comment = require('../models/Comment');
var  Validator = require('validatorjs');
var restFunctions = require('../helpers/restFunctions');
const fs  = require('fs');
const Tag = require('../models/Tag');
const Category  =  require('../models/Category'); 
const Report  = require('../models/Report');

exports.getRandom = (myArray)=>{
    return myArray[Math.floor(Math.random() * myArray.length)];
}
exports.index = function(req,res){
    //get all blogs category
    Blog.find({
        category: req.user.selected_category
    })
    .limit(parseInt(req.params.limit))
    .skip(parseInt(req.params.skip)*parseInt(req.params.limit))
    .exec(function(err,blogs){
        if(err){ return res.json({success:false,err}); }
        res.json(blogs);
    });
}
exports.popularBlog = function(req,res){
    Blog.find()
    .sort({ "like_countLength": -1 })
    .sort({ "view_countLength": -1 })
    .sort({ "save_countLength": -1 })
    .limit(parseInt(req.params.limit))
    .skip(parseInt(req.params.skip)*parseInt(req.params.limit))
    .exec(function(err,blogs){
        if(err){ return res.json({success:false,err}); }
        res.json(blogs);
    });
}
exports.popularBlogByCatgegory = function(req,res){
    Category.find({}).sort({"blog_count":-1}).limit(3).exec(function(err,category){
        let arr = [];
        console.log(category);
        category.forEach(function(element){
            arr.push(element.name);
        });
        arr = arr.filter(item=>item !=null);
        Blog.find({
            category: {$in:arr}
        })
        .limit(parseInt(req.params.limit))
        .skip(parseInt(req.params.skip)*parseInt(req.params.limit))
        .exec(function(err,blogs){
            if(err){ return res.json({success:false,err}); }
            res.json(blogs);
        });
    });
} 
exports.popularBlogByTag = function(req,res){
    Tag.find({}).sort({"tag_count":-1}).limit(3).exec(function(err,tag){
        let arr = [];
        tag.forEach(function(element){
            arr.push(element.name);
        });
        arr = arr.filter(item=>item !=null);
        Blog.find({
            tag:arr
        })
        .limit(parseInt(req.params.limit))
        .skip(parseInt(req.params.skip)*parseInt(req.params.limit))
        .exec(function(err,blogs){
            if(err){ return res.json({success:false,err}); }
            res.json(blogs);
        });
    });
} 

exports.store  = function (req,res){
    req.body.user_id = req.user._id; 
    var validate  = new Validator(req.body,{
        title:"required|string",
        content:"required"
    }); 
    if(!validate.passes()){
        res.status(404).json(validate.errors);
    }
    req.body.tag.forEach(function(tag){
        Tag.findOneAndUpdate({name:tag},{name:tag},{upsert:true}).exec(function(err,tag){
            //do one
        });
    });
    new Blog(req.body).save(function(err,blog){
        if(err) res.status(404).json({success:false,err});
        User.findByIdAndUpdate(req.body.user_id,{$push: {
            blogs: blog._id
          }},function(err,user){
            if(err) res.status(404).json({success:false,err});
            res.json({success:true,blog:blog});
        });
    });
}
exports.show = function(req,res){
    var query  = {};
    if(req.params.blog_id.indexOf('-') == -1){
        query._id =  req.params.blog_id;
    }
    else {
        query.slug =  req.params.blog_id;
    }
    Blog.findOne(query).lean().exec(function(err,blog){
        if(err) res.status(404).json({success:false,err});
        if(!blog) res.status(404).json({success:false,err:"blog not found"});   
        Comment.find({blog_id:blog._id}).exec(function(err,commentData){
            if(err) res.status(404).json({success:false,err});
            blog.comment = commentData;
            User.findById(blog.user_id).select('-password -type -social_id').exec(function(err,user){
                if(err) res.status(404).json({success:false,err});
                blog.user = user;
                res.json(blog); 
            });
        });
    });
}
exports.update = function(req,res){
    Blog.findOneAndUpdate(req.params.blog_id,req.body,function(err,blog){
         if(err) res.status(404).json({success:false,err});
         res.json({success:true,blog});
    });
}
exports.delete = function(req,res){
    Blog.deleteOne({_id:req.params.blog_id},{useFindAndModify:false},function(err,blog){
        if(err) return  res.status(404).json({success:false,err});
        return res.json({success:true});
    });
}
exports.fileUpload = function(req,res){
    if(req.file){
        Blog.findById(req.params.blog_id,function(err,blog){
            if(err) return res.status(404).json({success:false,err});
            if(!blog) return res.status(404).json({success:false,err:"blog not found"});
            blog.files.push('/images/blogs/'+req.file.filename);
            blog.save(function(err,blog){
                if(err) return res.status(404).json({success:false,err});
                res.json({success:true,image:'/images/blogs/'+req.file.filename});
            });
        });
    }
}
exports.deleteFile = function(req,res){
    //return res.json(req.body.file_name);
    Blog.findOneAndUpdate({
        _id:req.params.blog_id,
    },{
        $pull:{
            files: req.body.file_name
        }
    },{useFindAndModify:false},function(err,blog){
        if(err) res.json({success:false,err});
        try{
            fs.unlink(__basedir+'/public'+req.body.file_name,err=>{
                console.log('file daleted')
            });
        }
        catch(exception){

        }
        res.json({success:true});
    });  
}
exports.search = function (req,res){
    var validate  = new Validator(req.body,{
        keyword:"required|string",
        page:"required",
        limit:"required"
    }); 
    if(!validate.passes()){
        res.status(404).json(validate.errors);
    }
    Blog.find({$or:[
       { title:{ $regex: '.*' + req.body.keyword + '.*'}},
       {selected_category:req.body.keyword}
    ]})
    .skip(req.body.page *req.body.limit)
    .limit(req.body.limit)
    .then(data=>{
        res.json(data);
    }).catch(err=>{
        res.status(404).json({success:false,err});
    });
}
exports.likeDislike = function(req,res){
    var validate  = new Validator(req.body,{
        like:"required",
    }); 
    if(!validate.passes()){
        res.status(404).json(validate.errors);
    }
    if(req.body.like ==1){
        Blog.findById(req.params.blog_id,function(err,blog){
            if(err) return res.json({success:false,err});
            if(!blog) return  res.json({success:false,err:"blog not found "});
            blog.like_count.push({
                user_id:req.user._id,
                ip:req.body.ip
            });
            blog.save(err=>{
                if(err) return  res.status(404).json({success:false,err});
                restFunctions.sendNotification(req.user.name,"like",blog.user_id,req.user.firebase_token);
                res.json({success:true});
            })
        });  
    }
    else{
        Blog.findOneAndUpdate({
            _id:req.params.blog_id,
        },{
            $pull:{
                like_count:{user_id:req.user._id}
            }
        },function(err,blog){
            if(err) res.json({success:false,err});
            res.json({success:true});
        });  
    }
}
exports.saveUnsave = function(req,res){
    var validate  = new Validator(req.body,{
        save:"required",
    }); 
    if(!validate.passes()){
        res.status(404).json(validate.errors);
    }
    if(req.body.save ==1){
        Blog.findById(req.params.blog_id
        ,function(err,blog){
            if(err) res.json({success:false,err});
            if(!blog) res.json({success:false,msg:"blog not found"});
            blog.save_count
            .push({
                user_id:req.user._id,
                ip:req.body.ip
            });
            blog.save(err=>{
                console.log('yes3')
                if(err)  res.status(404).json({success:false,err});
                restFunctions.sendNotification(req.user.name,"save",blog.user_id,req.user.firebase_token);
                res.json({success:true});
            })
        });  
    }
    else{
        Blog.findOneAndUpdate({
            _id:req.params.blog_id,
        },{
            $pull:{
                save_count:{user_id:req.user._id}
            }
        },function(err,blog){
            if(err) res.json({success:false,err});
            res.json({success:true});
        });  
    }
}
exports.view = function(req,res){
        Blog.findById(req.params.blog_id,function(err,blog){
            if(err) return  res.json({success:false,err});
            if(!blog) return  res.json({success:false,err});
            var query  = {};
            if(req.user){
                query.user_id = req.user._id;
            }
            else {
                query.ip  = req.body.ip;
            }
            blog.view_count
            .push(query);
            blog.save(err=>{
                if(err) return res.status(404).json({success:false,err});
                console.log('whaa');
                return res.json({success:true});
            })
        });  
}
exports.comment  = function(req,res){
    var  dataToPass = req.body;
    dataToPass.blog_id = req.params.blog_id;
    dataToPass.user_id  = req.user._id;
    if(!req.params.parent_id){
        dataToPass.parent_id = req.params.parent_id;
    }
    var validate  = new Validator(dataToPass,{
        user_id:"required",
        content:"required"
    }); 
    if(!validate.passes()){
        res.status(404).json(validate.errors);
    }
    new Comment(dataToPass).save(function(err,comment){
        if(err) return res.json({success:false,err});
        return res.json({success:true,comment});
    })
}
exports.likeCount = function(req,res){
    Blog.find({user_id:req.user._id}).select('like_count').exec(function(err,blog){
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
  Blog.find({user_id:req.user._id}).select('save_count').exec(function(err,blog){
    var count = 0;
    blog.forEach(element => {
      try {
        count = count+ element.save_count.length;
      } catch (error) {} 
    });  
    res.json({success:true,count});
  });
}
exports.viewCount = function(req,res){
  Blog.find({user_id:req.user._id}).select('view_count').exec(function(err,blog){
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
  Comment.countDocuments({disable:0,user_id:req.user._id}).exec(function(err,count){
    if(err) return res.status(404).json({success:false,err})
    res.json({success:true,count});
  });
}
exports.blogCount = function(req,res){
  Blog.countDocuments({disable:0}).exec(function(err,count){
    if(err) return res.status(404).json({success:false,err})
    res.json({success:true,count});
  });
}

exports.reportStore = function(req,res){
    new Report(req.body).save(function(err,report){
        if(err) return res.status(404).json({success:false,err})
        res.json({success:true,report});
    });
}