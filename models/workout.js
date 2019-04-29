const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({

  // name: {
  //   type: String,
  // },
  // type: {
  //  	type: String,
  // },
  week: {
    type: String
  },
  day: {
  	type: Number
  },
  activities: [{
    type: mongoose.Schema.Types.ObjectId,
		ref: 'Activities'
  }]

  // activities: [{
  //   ref.sasdfasdfasdf
  //   'acti'
  // }]




})

const Workout = mongoose.model('Workout', workoutSchema)

module.exports = Workout;