const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Plan = require('../models/plan');
const Workout = require('../models/workout');
const Activities = require('../models/activities')


router.post('/', async (req, res, next) => {
	console.log(req.session)
	console.log(req.body)
	try{
		if(req.body.weights === 'on'){
			const createdPlan = Plan.create(req.body, (err, createdPlan)=>{
			createdPlan.name = 'weights'
			// workout.week = week 1
			// workout.day = day 1
			// activities.type = 'weights'
			// activities.duration = 'null'
			//activities.quantities = 10
			//activies.name = "bench-press"

			// end of workout



			// create the plan		

				// figure out what days the workouts should be
					/// this could be up to 20 lines of code

				// store those days in an array

				// figure out all the types of workouts the user wants req.body
				// put those types in an array


				// loop over array of dates. in the loop:
					// create a workout (all type of activities selected)
					// set the workout day to be this date in the array


					// loop through array of types the user selected  --- use while loop with modulus (modulate by the number of activities they selected)

						// for each type:

						// if there are not yet 3 activities
							
							// random activity:

								// get the activities of this type from the database
								// Math.random to get one of those 






			
					
				

				
				

















			//workout.

			
			res.render('index.ejs', {
				plan: createdPlan
			})

			})
		}
	}catch(err){
		next(err)
	}
})
// 	try{
//     /// create the shreddit plan
//     // info you need to create plan is in req.body
//     // create workouts
//     if(req.body.weights === 'on'){
//         const createdPlan = Plan.create(req.body, (err, createdPlan)=>{
// 				createdPlan.name = 'weights'
  
//         res.render('index.ejs', {
//             plan: createdPlan
//         })
//     }) catch(err){
//         next(err)
//     }
//     }
    
// 	}
// })







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