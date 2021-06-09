//home controller
var Blog = require('../models/Blog');
var Notification = require('../models/Notification');
var passport  = require('passport');
exports.todayDeals   = function(req,res){
    var  data  = [];
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    Blog.find(
        {createdAt: { $gte: today }}
        )
        .limit(parseInt(req.params.limit))
        .skip(parseInt(req.params.skip)*parseInt(req.params.limit))
        .sort({
            createdAt: 'asc'
        })
        .exec(function(err,blogs){
            if(err) return res.status(404).json({succes:false,err});
            blogs.forEach(function(blogsl,index){
                req.user.selected_category.forEach(function(selected_categoryies){
                    if(blogs.category.includes(selected_categoryies)){
                        data.push(blogs);
                    }
                });
            });
            return res.json(data);
    });
}
exports.recent_blogs = function(req,res,next){
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var data  =[];
    Blog.find({})
    .limit(parseInt(req.params.limit))
    .skip(parseInt(req.params.skip)*parseInt(req.params.limit))
    .sort({
        createdAt: 'asc'
    })
    .exec(function(err,blogs){
            if(err) return res.status(404).json({succes:false,err});
            passport.authenticate('jwt',function(err, user, info){
                if(user){
                    blogs.forEach(function(blogsl,index){
                        user.selected_category.forEach(function(selected_categoryies){
                            try {
                                if(blogs.category.includes(selected_categoryies)){
                                    data.push(blogs);
                                }
                            } catch (error) {
                                
                            }
                        });
                    });
                    return res.json(data);  
                }
                else{
                    return res.json(blogs);  
                }
            })(req, res, next);
    });
}

exports.notification = function (req,res){
    Notification.find({user_id:req.user._id},function(err,notification){
        if(err) res.json({succes:false,err});
        res.json(notification);
    });
}