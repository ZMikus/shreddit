const mongoose = require('mongoose');
const Workout = require('./workout')

const planSchema = new mongoose.Schema({
	createdDate: {
		type: Date,
		default: Date.now
	},

	startDate: {
		type: Date, 
	  	default: Date.now
	},
	 name: {
		type: String,
		required: true
	
	},
	user: {
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