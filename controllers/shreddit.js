const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Plan = require('../models/plan');
const Workout = require('../models/workout');
const Activities = require('../models/activities')


router.post('/', async (req, res, next) => {

	try{
			const createdPlan = await Plan.create(req.body)
			const newWorkout = new Workout
			console.log('this is the new workout ========= ', newWorkout)

			// create the plan		

			// figure out what days the workouts should be
			/// this could be up to 20 lines of code

			// store those days in an array

			// loop over array of dates. in the loop:

			// convert this to array of date objects
			const days = [
				"Monday",
				"Tusday",
				"Wedensday",
				"Thursday",
				"Friday",
				"Saturday",
				"Sundary"
			]
			// figure out all the types of workouts the user wants req.body
			const prefs = ['weights', 'plyo', 'cardio'] 

			// put those types in an array
			console.log("------------------------");

			
		const howManyActivitiesYouWant = 5;
		// const dayActivities = [];
		for(let i = 0; i < howManyActivitiesYouWant; i++) { 
			// use modulo, i, and prefs.length (HINT HINT) to programmatically cycle thru prefs
			// this is the type

			// print the type of activity we should be generating
			const typeOfActivity = prefs[i % prefs.length]
			// console.log(typeOfActivity)
			// const dayActivity = await Activities.find({name:typeOfActivity})
			const activitiesOfType = await Activities.find({type:typeOfActivity})
			console.log("activities of type " + typeOfActivity)
			console.log(activitiesOfType)
		// once it correctly cycles thru -- and no sooner -- get a random activity for the type

			const randomActivityNumber = Math.floor(Math.random() * (activitiesOfType.length));
			
			newWorkout.activities.push(activitiesOfType[randomActivityNumber])

			await newWorkout.save()

			// save workout -- this is an asynchronous db operation
			console.log(newWorkout)

		

	}
		

			// create a workout (all type of activities selected)

			


		//workout.// 	res.render('index.ejs', {
		// 		plan: createdPlan
		// 	})

		// 	})
		// }
			
		 res.send('check terminal')
		}catch(err){
		next(err)
	}
})





router.get('/select-plan', (req, res) => {
	res.render('selectPlan.ejs')
})


router.get('/seed', async (req, res, next) => {
	
	const activities = [
		//cardio
		{
			type: "cardio",
			duration: "30 minute",
			quantity: null,
			name: "Run"
		},
		{
			type: "cardio",
			duration: "1 hr 30 minute",
			quantity: null, 
			name: "Bikeride"
		},
		{
			type: "cardio",
			duration: "1 hr 30 minute",
			quantity: null, 
			name: "Elipitcal"
		},
		//plyo
		{
			type: "plyo",
			duration: null,
			quantity: 50,
			name: "Burpies"
		},
		{
			type: "plyo",
			duration: null,
			quantity: 50,
			name: "Jumping Jacks"
		},
		{
			type: "plyo",
			duration: null,
			quantity: 50,
			name: "Super Mans"
		},
		//weights
		{
			type: "weights",
			duration: null,
			quantity: 50,
			name: "Bench Press"
		},
		{
			type: "weights",
			duration: null,
			quantity: 50,
			name: "Bicep Curls"
		},
		{
			type: "weights",
			duration: null,
			quantity: 50,
			name: "Sqaut"
		},
		
	]
		

	await Activities.create(activities)
  res.send('now there\'s some data')
})


module.exports = router;