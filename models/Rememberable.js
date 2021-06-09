var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rememberable = new Schema({
  user_id: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  active:{
    type:Boolean,
    required:true
  }
});

module.exports = mongoose.model('Rememberable', rememberable);
