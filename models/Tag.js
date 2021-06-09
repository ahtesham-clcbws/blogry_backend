var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
var tag = new Schema({
  name:{
      type:String,
      required:true
  },
  blog_count:{
      type:Number
  }
},{timestamps:true});

module.exports = mongoose.model('Tag', tag);
