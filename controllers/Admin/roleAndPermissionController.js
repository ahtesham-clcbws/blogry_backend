var exports = module.exports = {};
var Role  = require('../../models/Role');
var Permission  = require('../../models/Permission');
var Validator  = require('validatorjs'); 
const RoleHasPermission = require('../../models/RoleHasPermission');
exports.roles = function(req,res){
    Role.find({}).populate('roleHasPermissions').exec(function(err,roles){
        if(err) res.json({success:false,err});
        res.json(roles);
    });
}

exports.permission = function(req,res){
    Permission.find({},function(err,permission){
        if(err) res.json({success:false,err});
        res.json(permission);
    });
}
exports.addRoleToUser = function(req,res){
    var validate  = new Validator(req.body,{
        role_id:"required",
        user_id:"required",
    }); 
    if(!validate.passes()){
        res.status(404).json({success:false,err:validate.errors});
    }
    Role.findById(req.body.role_id,function(err,role){
        if(err) return res.status(404).json({success:false,err});
        if(!role)return res.status(404).json({success:false,err:"role not found"});
        User.findById(req.body.user_id,function(err,user){
            if(err) return res.status(404).json({success:false,err});
            if(!user) return res.status(404).json({success:false,err:"user not found"});
            new UserHasRole(req.body).save(function(err,roleHasPermission){
                if(err) return res.json({success:false,err});
                return res.json({success:true}); 
            });
        });
    });
} 
exports.addPermissionToRole = function(req,res){
    var validate  = new Validator(req.body,{
        role_id:"required",
        permission_id:"required",
    }); 
    if(!validate.passes()){
        res.status(404).json({success:false,err:validate.errors});
    }
    Role.findById(req.body.role_id,function(err,role){
        if(err) return res.status(404).json({success:false,err});
        if(!role)return res.status(404).json({success:false,err:"role not found"});
        Permission.findById(req.body.permission_id,function(err,permission){
            if(err) return res.status(404).json({success:false,err});
            if(!permission) return res.status(404).json({success:false,err:"permission not found"});
            new RoleHasPermission(req.body).save(function(err,roleHasPermission){
                if(err) return res.json({success:false,err});
                return res.json({success:true}); 
            });
        });
    });
}