const mongoose = require('mongoose');
const Activity = require('./activities')

const workoutSchema = new mongoose.Schema({

  // name: {
  //   type: String,
  // },
  day: {
  	type: Date
  },
  // activities: [{
  //   type: mongoose.Schema.Types.ObjectId,
		// ref: 'Activities'
  // }]
  activities: [Activity.schema] // subdocuments





})

const Workout = mongoose.model('Workout', workoutSchema)

module.exports = Workout;