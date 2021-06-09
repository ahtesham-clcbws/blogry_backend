var exports = module.exports = {};
var  Validator = require('validatorjs');
const Advertisement = require('../../models/Advertisement');
const GoogleAdvertisement = require('../../models/GoogleAdvertisement');

exports.AdvertisementIndex = function(req,res){
    Advertisement.find({})
    .limit(parseInt(req.params.limit))
    .skip(parseInt(req.params.skip)*parseInt(req.params.limit))
    .exec(function(err,advertisement){
        if(err) return res.status(404).json({success:false,err});
        return res.json(advertisement);
    });
}

exports.AdvertisementShow = function(req,res){
Advertisement.find({_id:req.params.advertisement_id}).exec(function(err,advertisement){
  if(err) return res.status(404).json({success:false,err});
  return res.json(advertisement);
});
}


exports.AdvertisementReject = function(req,res){
    var validate  = new Validator(req.body,{
        reject:"required",
        reject_reason:"required"
    }); 
    if(!validate.passes()){
        return res.status(404).json({success:false,err:validate.errors});
    }
    GoogleAdvertisement.findOneAndUpdate({_id:req.params.advertisement_id},{
        is_reject:req.body.reject,
        is_reject_reason:req.body.reject_reason
    },{useFindAndModify:false},function(err,advertisement){
        if(err) return res.status(404).json({success:false,err});
        return res.json({success:true,advertisement});
    });
}

exports.GoogleAdvertisementIndex = function(req,res){
GoogleAdvertisement.find({})
.limit(parseInt(req.params.limit))
.skip(parseInt(req.params.skip)*parseInt(req.params.limit))
.exec(function(err,advertisement){
  if(err) return res.status(404).json({success:false,err});
  return res.json(advertisement);
});
}

exports.GoogleAdvertisementShow = function(req,res){
    GoogleAdvertisement.find({_id:req.params.advertisement_id}).exec(function(err,advertisement){
    if(err) return res.status(404).json({success:false,err});
    return res.json(advertisement);
    });
}

exports.GoogleAdvertisementReject = function(req,res){
    var validate  = new Validator(req.body,{
        reject:"required",
        reject_reason:"required"
    }); 
    if(!validate.passes()){
        res.status(404).json({success:false,err:validate.errors});
    }
    GoogleAdvertisement.findOneAndUpdate({_id:req.params.advertisement_id},{
        is_reject:req.body.reject,
        is_reject_reason:req.body.reject_reason
    },{useFindAndModify:false},function(err,advertisement){
        if(err) return res.status(404).json({success:false,err});
        return res.json({success:true,advertisement});
    });
}