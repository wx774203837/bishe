const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  username:{type:String},
  password:{type:String},
  statue:{type:Boolean,default:true},
  name:{type:String},
  avatar:{type:String,default:'http://localhost:3000/uploads/bb873d6a3f0857709ddcf0bd355bffe7'},
  sex:{type:String},
  birthday:{type:String},
  email:{type:String},
  describtion:{type:String},
  date:{type:String},
  school:{type:String},
  school_id:{type:String},
  position:{type:String}
  // articleList:[{type:mongoose.SchemaTypes.ObjectId,ref:'Article'}]
})

module.exports = mongoose.model('User',schema)