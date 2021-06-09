var exports = module.exports = {}
var Plan  = require('../../models/Plan');
var User  = require('../../models/User');
var  Validator = require('validatorjs');
exports.index = function(req,res){
    Plan.find({},function(err,plans){
        if(err) res.json({success:false,err});
        res.json(plans);
    });
}
exports.show = function(req,res){
    Plan.findById(req.params.plan_id,function(err,plan){
        if(!plan) res.status(404).json({success:false,err:"plan not found !!"});
        res.json(plan);
    });
}
exports.delete = function(req,res){
    //delete the plans 
    User.findById(req.user._id,function(err,user){
        user.hasPermission('crudPlan',function(is){
            if(!is) res.status(404).json({success:false,"err":"access denied"});
            Plan.findByIdAndDelete(req.params.plan_id,{useFindAndModify:false},function(err,plans){
                if(err) return  res.status(404).json({success:false,err});
                return res.json({success:true});
            });
        })
    });
}
exports.add = function(req,res){
    var validate  = new Validator(req.body,{
        name:"required|string",
        stripe_id: "required|string",
        price: "required|numeric"
    }); 
    if(!validate.passes()){
        res.status(404).json(validate.errors);
    }
    User.findById(req.user._id,function(err,user){
        user.hasPermission('crudPlan',function(is){
            if(!is) res.status(404).json({success:false,"err":"access denied"});
            new Plan(req.body).save(function(err,plan){
                if(err) return  res.json({success:false,err});
                res.json({success:true,plan});
            });
        })
    });
}
exports.update = function(req,res){
    User.findById(req.user._id,function(err,user){
        user.hasPermission('crudPlan',function(is){
            if(!is) res.json({success:false,"err":"access denied"});
            Plan.findByIdAndUpdate(req.params.plan_id,req.body,function(err,plans){
                if(err) res.json({success:false,err});
                res.json({success:true});
            });
        })
    });
}