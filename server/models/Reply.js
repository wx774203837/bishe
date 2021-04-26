const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  user:{type:mongoose.SchemaTypes.ObjectId,ref:'User'},
  replyUser:{type:mongoose.SchemaTypes.ObjectId,ref:'User'},
  comment:{type:mongoose.SchemaTypes.ObjectId,ref:'Comment'},
  date:{type:String},
  content:{type:String},
})

module.exports = mongoose.model('Reply',schema)