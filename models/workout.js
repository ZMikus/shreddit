const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({

  name: {
    name:String,
    required: true
  },

  type:{
    name: String,
    required: true
  },

  duration:{
  	type: Number
  },

  date: {
  	type: Date, 
  	default: Date.now
  },



})

const Workout = mongoose.model('Workout', workoutSchema)

module.exports = Workout;