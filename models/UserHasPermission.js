var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userHasPermission = new Schema({
  user_id: {
    type: String,
    required: true
  },
  permission_id: {
    type: String,
    required: true
  }
},{timestamps:true});

module.exports = mongoose.model('UserHasPermission', userHasPermission);
