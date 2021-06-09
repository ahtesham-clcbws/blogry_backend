var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var advertisement = new Schema({
    googlead_id:{
        type:String,
        required:true
    },
  reportfile:{
      type:String,
      required:true
  },
  needClarification:{
      type:Boolean,
      required:true
  },
  clarification:{
    type:String,
    required:()=>{
        return this.needClarification; 
    }
},
clarify:{
    type:Boolean
}
},{timestamps:true});
module.exports = mongoose.model('Advertisement', advertisement);
