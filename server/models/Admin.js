const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  adminname:{type:String},
  password:{
    type:String,
    select:false,
    set(val){
      return require('bcryptjs').hashSync(val,10)
    }
  },
  date:{type:String}
})

module.exports = mongoose.model('AdminUser',schema)