var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
var blog = new Schema({
  title:{
      type:String,
      required:true
  },
  user_id:{
      type:String,
      required:true
  },
  content:{
      type:String,
      required:true
  },
  slug:{
      type:String,
      slug:"title",
      index:true
  },
  like_count:[{
    user_id:{
          type: mongoose.Schema.Types.ObjectId,
          unique:true
        }
  }],
  view_count:[{
    user_id:{
          type: mongoose.Schema.Types.ObjectId,
          unique:true
        },
    ip:{
        type:String,
        unique:true,
        required : function() {
            return !this.user_id;
        }
    }
  }],
  save_count:[{
    user_id:{
          type: mongoose.Schema.Types.ObjectId,
          unique:true
        }
  }],
  category:String,
  tag:[String],
  approve:{
    type:Boolean
  },
  files:[{
    type:String
  }],
  isComplete:Boolean,
  disapprove_reason:{
    type:String,
    required:function(){
      return this.approve; 
    }
  }
},{timestamps:true});
blog.pre('find', function() {
  this.where("approve").ne(false);
});
module.exports = mongoose.model('Blog', blog);
