var mongoose = require('mongoose');
var util = require('util');
//roles and permission 
var Role = require('./Role'),
 Permission = require('./Permission'), 
 UserHasRole = require('./UserHasRole'),
 UserHasPermission = require('./UserHasPermission'),
 RoleHasPermission = require('./RoleHasPermission');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        index: true, unique: true,
        required:true
    },
    type:{
        type:Number,
        required:true
    },
    social_id:{
        type:String,
        required : function() {
            return this.type ==1;
        }
    },
    avatar:{
        type:String,
        default:"/default/user.png"
    },
    selected_category: Array,
    bio:String,
    blogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
      }],
      plan_id:String,
      disable:Boolean,
      firebase_token:String,
},{ timestamps: true });
UserSchema.pre('find', function() {
    this.where("disable").ne(true);
});
UserSchema.methods.hasRole = function hasRole(role,cb){
    let currentUser = this;
    var query = {name:role};
    if(util.isArray(role)){
        var  query = [];
        role.forEach(arr=>{
            query.push({
                name:arr
            });
        });
    }
    Role.findOne(util.isArray(query) === true ? {$or: query } : query ,function(err,roles){
        if(!roles) cb(false);
        UserHasRole.findOne({
            user_id:currentUser._id,
            role_id:roles._id
        },function(err,userrole){
            if(!userrole)  cb(false);
            cb(true);
        });
    });
}
UserSchema.methods.assignRole = function assignRole(role){
    let currentUser = this;
    var query = {name:role};
    if(util.isArray(role)){
        var  query = [];
        role.forEach(arr=>{
            query.push({
                name:arr
            });
        });
    }
    Role.find(util.isArray(query) === true ? {$or: query } : query ,function(err,roles){
        if(!roles) return false ;
        roles.forEach(element => {
            UserHasRole.findOne({
                user_id:currentUser._id,
                role_id:element._id
            },function(err,userrole){
                if(!userrole){
                    new UserHasRole({
                        user_id:currentUser._id,
                        role_id:element._id
                    }).save(function(err){
                        //
                    });   
                }
            });
        });
    });
}
UserSchema.methods.hasPermission = function hasPermission(permission,cb){
    let currentUser = this;
    console.log(currentUser);
    Permission.findOne({ name:permission },function(err,per){
        if(err){ cb(false); return };
        if(!per){ cb(false); return };
        UserHasRole.find({user_id:currentUser._id},async function(err,userhas){
            if(err){ cb(false); return };
            if(!userhas){ cb(false); return };
            var returnable = false;
            for(let i = 0; i< userhas.length; i++){
                let role = userhas[i];
                var rhp =  await RoleHasPermission.findOne({role_id:role.role_id,permission_id:per._id});
                 if(err) { cb(false); break; };
                 if(rhp){ 
                     returnable = true;
                };
            }
            if(returnable){
                cb(returnable);
                return ;
            }
            else {
                cb(returnable);   
                return;
            }
        });
    });
}
UserSchema.methods.getRole = function getRole(cb){
    let currentUser = this;
    UserHasRole.find({user_id:currentUser._id},function(err,roles){
        if(err) cb(err)
        cb(roles);
    });
}
module.exports = mongoose.model('User', UserSchema);
