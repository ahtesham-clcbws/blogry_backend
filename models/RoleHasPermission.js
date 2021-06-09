var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roleHasPermission = new Schema({
  role_id: {
    type: String,
    required: true
  },
  permission_id: {
    type: String,
    required: true
  }
},{timestamps:true});

module.exports = mongoose.model('RoleHasPermission', roleHasPermission);
