var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var plan = new Schema({
  name: {
    type: String,
    unique:true,
    required: true
  },
  stripe_id:{
    type: String,
    required: true
  },
  price:{
    type: Number,
    required: true   
  }
},{timestamps:true});

module.exports = mongoose.model('Plan', plan);
