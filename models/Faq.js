var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var faq = new Schema({
    type:{
        type:String,
        required:true
    },
  question:{
      type:String,
      required:true
  },
  parent_id:{
    type:String,
  },
  answer:{
      type:Boolean,
  },
is_answered:{
    type:Boolean
}
},{timestamps:true});
module.exports = mongoose.model('Faq', faq);
