var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var role = new Schema({
  name: {
    type: String,
    unique:true,
    required: true
  }
},{timestamps:true});

module.exports = mongoose.model('Role', role);
