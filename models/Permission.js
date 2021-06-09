var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var permission = new Schema({
  name: {
    type: String,
    unique:true,
    required: true
  }
},{timestamps:true});

module.exports = mongoose.model('Permission', permission);
