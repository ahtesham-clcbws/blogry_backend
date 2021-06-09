var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var report = new Schema({
    reason:{
        type:String,
        required:true
    },
  reporter_id:{
      type:String,
      required:true
  },
  blog_id:{
    type:String,
    required:true
  },
  is_complete:{
      type:Boolean,
  }
},{timestamps:true});
module.exports = mongoose.model('Report', report);
