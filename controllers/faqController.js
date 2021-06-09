var exports = module.exports = {};
var  Validator = require('validatorjs');
const Faq = require('../models/Faq');

exports.index = function(req,res){
    Faq.find({})
    .limit(parseInt(req.params.limit))
    .skip(parseInt(req.params.skip)*parseInt(req.params.limit))
    .exec(function(err,faq){
        if(err) return res.status(404).json({success:true,err});
        return res.json(faq);
    });
}
exports.show = function(req,res){
    Faq.findOne({$or:[
        {_id:req.params.faq_id},
        {parent_id:req.params.faq_id}
    ]})
    .exec(function(err,faq){
        if(err) return res.status(404).json({success:true,err});
        return res.json(faq);
    });
}
exports.update = function(req,res){
    var validate  = new Validator(req.body,{
        answer:"required|string",
    }); 
    if(!validate.passes()){
        res.status(404).json({success:false, err:validate.errors});
    }
    Faq.findByIdAndUpdate(req.params.faq_id,{answer:req.body.answer},{useFindAndModify:false},function(err,faq){
        if(err) return res.status(404).json({success:true,err});
        return res.json({success:true,faq});
    });
}

exports.delete = function(req,res){
    Faq.deleteOne({_id:req.params.faq_id},req.body,{useFindAndModify:false},function(err,faq){
        if(err) return res.status(404).json({success:true,err});
        return res.json({success:true,faq});
    });
}

exports.store  = function(req,res){
    req.body.user_id = req.user._id; 
    new Faq({question:req.body.question,type:req.body.type}).save(function(err,faq){
        if(err) return res.status(404).json({success:true,err});
        return res.json({success:true,faq});
    });
}