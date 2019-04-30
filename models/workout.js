const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({

  // name: {
  //   type: String,
  // },
  day: {
  	type: Date
  },
  activities: [{
    type: mongoose.Schema.Types.ObjectId,
		ref: 'Activities'
  }]






})

const Workout = mongoose.model('Workout', workoutSchema)

module.exports = Workout;