var exports = module.exports = {};
var User  = require('../../models/User');
var Blog  = require('../../models/Blog');
var  Comment = require('../../models/Comment');
var Category = require('../../models/Category');
var Tag  = require('../../models/Tag');
exports.calculatePopularCategoryAndTag = function (){
    console.log('updating....');
    Category.find({}).lean().exec(function(err,category){
        if(err) console.log(err);
        category.forEach(element => {
            console.log('finding data for',element.name);
            Blog.find({category:element.name}).exec(function(err,count){
                if(err){ console.log(err); return; } 
                console.log(count,'blogs found for',element.name);
                Category.findOneAndUpdate({ name:element.name },{blog_count:count.length},function(err,category){
                    console.log(category.name,'updated');
                }); 
            });
        });
    });
    Tag.find({}).lean().exec(function(err,tag){
        if(err) console.log(err);
        tag.forEach(element => {
            Blog.find({tag:element.name}).exec(function(err,count){
                Tag.findOneAndUpdate({ name:tag.name },{blog_count:count.length},function(err,tags){
                    console.log(tags.name,'updated');
                });
            });
        });
    });
}