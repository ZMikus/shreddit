const mongoose = require('mongoose');
const Workout = require('./workout')

const planSchema = new mongoose.Schema({
	startDate: {
		type: Date, 
	  default: Date.now
	},
	 name: {
		type: String
	
	},
	 user: {//should this be user or user's focus?
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	
	workouts: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Workout'
	}]
	
});

const Plan = mongoose.model('Plan', planSchema)

module.exports = Plan;