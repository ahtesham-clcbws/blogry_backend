var exports = module.exports = {};
const { response } = require('express');
const Advertisement = require('../models/Advertisement');
const GoogleAdvertisement = require('../models/GoogleAdvertisement');

exports.AdvertisementIndex = function(req,res){
          Advertisement.find({user_id:req.user._id})
          .limit(parseInt(req.params.limit))
          .skip(parseInt(req.params.skip)*parseInt(req.params.limit))
          .exec(function(err,advertisement){
              if(err) return res.status(404).json({success:false,err});
              return res.json(advertisement);
          });
}

exports.AdvertisementShow = function(req,res){
    Advertisement.findOne({user_id:req.user._id,_id:req.params.advertisement_id}).exec(function(err,advertisement){
        if(err) return res.status(404).json({success:false,err});
        return res.json(advertisement);
    });
}

exports.AdvertisementStore = function(req,res){
    req.body.user_id = req.user._id;
    if(req.file){
        req.body.image = req.file.filename;
    }
    new Advertisement(req.body).save(function(err,advertisement){
        if(err) return res.status(404).json({success:false,err});
        return res.json({success:true,advertisement});
    });
}

exports.AdvertisementUpdate = function(req,res){
    Advertisement.findOneAndUpdate({user_id:req.user._id,_id:req.params.advertisement_id},req.body,{useFindAndModify:false},function(err,advertisement){
        if(err) return res.status(404).json({success:false,err});
        return res.json({success:true,advertisement});
    });
}

exports.AdvertisementDelete = function(req,res){
    Advertisement.deleteOne({user_id:req.user._id,_id:req.params.advertisement_id}).exec(function(err,advertisement){
        if(err) return res.status(404).json({success:false,err});
        return res.json({success:true,advertisement});
    });
}

exports.GoogleAdvertisementIndex = function(req,res){
    GoogleAdvertisement.find({user_id:req.user._id}).exec(function(err,advertisement){
        if(err) return res.status(404).json({success:false,err});
        return res.json(advertisement);
    });
}

exports.GoogleAdvertisementShow = function(req,res){
GoogleAdvertisement.find({user_id:req.user._id,_id:req.params.advertisement_id}).exec(function(err,advertisement){
  if(err) return res.status(404).json({success:false,err});
  return res.json(advertisement);
});
}

exports.GoogleAdvertisementStore = function(req,res){
    req.body.user_id = req.user._id;
    new GoogleAdvertisement(req.body).save(function(err,advertisement){
    if(err) return res.status(404).json({success:false,err});
    return res.json({success:true,advertisement});
    });
}

exports.GoogleAdvertisementUpdate = function(req,res){
    Advertisement.findOneAndUpdate({user_id:req.user._id,_id:req.params.advertisement_id},req.body,{useFindAndModify:false},function(err,advertisement){
        if(err) return res.status(404).json({success:false,err});
        return res.json({success:true,advertisement});
    });
}

exports.GoogleAdvertisementDelete = function(req,res){
        GoogleAdvertisement.deleteOne({user_id:req.user._id,_id:req.params.advertisement_id}).exec(function(err,advertisement){
            if(err) return res.status(404).json({success:false,err});
            return res.json({success:true,advertisement});
        });
    }