const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:{
      type: String,
      required: true
  },
  email:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  weights:{
    type: Boolean
  },
  ployos:{
    type: Boolean
  },
  cardio:{
    type: Boolean
  }
})

const User = mongoose.model('User', userSchema)
module.exports = User

