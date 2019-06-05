const mongoose = require('mongoose');
const Plan = require('./plan')

const userSchema = new mongoose.Schema({
  name:{
      type: String
      // required: true
  },
  email:{
    type: String
    // required: true
  },
  password:{
    type: String
    // required: true
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan'
  }
  // weights:{
  //   type: Boolean
  // },
  // ployos:{
  //   type: Boolean
  // },
  // cardio: {
  //   type: Boolean
  // }

});

const User = mongoose.model('User', userSchema)
module.exports = User

