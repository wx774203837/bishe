const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  user:{type:mongoose.SchemaTypes.ObjectId,ref:'User'},
  article:{type:mongoose.SchemaTypes.ObjectId,ref:'Article'},
  date:{type:String},
  content:{type:String},
  likes:[{type:mongoose.SchemaTypes.ObjectId,ref:'User'}],
  floor:{type:Number}
  // reply:{type:mongoose.SchemaTypes.ObjectId,ref:'Reply'}
})

module.exports = mongoose.model('Comment',schema)