var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var comment = new Schema({
  user_id:{
      type:String,
      required:true
  },
  blog_id:{
    type:String,
    required:true
},
  parent_id:String,
  content:{
      type:String,
      required:true
  },
  disable:{
    type:Boolean,
    default:0
  }
},{timestamps:true});

module.exports = mongoose.model('Comment', comment);
