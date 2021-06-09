var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
var notification = new Schema({
  user_id:{
      type:String,
      required:true
  },
  content:{
      type:String,
      required:true
  },
  type:{
    type:String,
    required:true
   }
},{timestamps:true});

module.exports = mongoose.model('Notification', notification);
