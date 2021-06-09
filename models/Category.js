var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
var category = new Schema({
  name:{
      type:String,
      required:true,
      unique:true
  },
  color_code:{
      type:String,
      required:true
  },
  image:{
      type:String,
  },
  slug:{
      type:String,
      slug:"name",
  },
  blog_count:{
      type:Number
  },
  active:{
      type:Boolean,
      required:true
  }
},{timestamps:true});

module.exports = mongoose.model('Category', category);
