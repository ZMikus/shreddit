const mongoose = require('mongoose');
const Plan = require('./plan')

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
  plans: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan'
  }],

  completedWorkouts: []

});

const User = mongoose.model('User', userSchema)
module.exports = User

