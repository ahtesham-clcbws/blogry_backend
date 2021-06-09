var exports = module.exports = {}
var Category  = require('../../models/Category');

exports.category = function(req,res){
    Category.find({},function(err,category){
        if(err) return res.json({success:false,err});
        res.json(category); 
    });
}