var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userHasrole = new Schema({
  user_id: {
    type: String,
    required: true
  },
  role_id: {
    type: String,
    required: true
  }
},{timestamps:true});

module.exports = mongoose.model('UserHasRole', userHasrole);
