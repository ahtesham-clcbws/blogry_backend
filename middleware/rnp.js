var exports = module.exports = {};
var User  =require('../models/User');
exports.only =  function (role){
     return function(req,res,next){
         User.findById(req.user._id,function(err,user){
            user.hasRole(role,function(isrole){
                if(isrole){
                    next();
                }
                else{
                    res.json({success:false,msg:'Need '+role+' account for this request'});
                }
            });
         });
     }
}