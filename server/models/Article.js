const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  author:{type:mongoose.SchemaTypes.ObjectId,ref:'User'},
  title:{type:String},
  likes:[{type:mongoose.SchemaTypes.ObjectId,ref:'User'}],
  commentCount:{type:Number,default:0},
  readcount:{type:Number,default:0},
  date:{type:String},
  content:{type:String},
  top:{type:Boolean,default:false}

})

module.exports = mongoose.model('Article',schema)