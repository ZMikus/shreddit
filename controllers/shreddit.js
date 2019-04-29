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
		// if(req.body.weights === 'on'){
		// 	const createdPlan = Plan.create(req.body, (err, createdPlan)=>{
		// 	createdPlan.name = 'weights'


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
const workoutDays = [
                    'Monday',
                    'Wednesday',
                    'Friday'   
                ] // convert this to array of date objects

const offDays = [
					'Tuesday',
					'Thursday',
					'Saturday',
					'Sunday'
				]




				// figure out all the types of workouts the user wants req.body



				// put those types in an array


	

		// if(req.body.weights === 'on'){
			

		// }
		// if(req.body.cardio === 'on'){


		// }
		// if(req.body.plyos === 'on'){

		// }


	console.log("------------------------");

	const prefs = ['weights', 'plyo', 'cardio']
	
	const howManyActivitiesYouWant = 5
	console.log(req.body.value);

	// if(dayActivities.length % 3 <= 0){ 
	for(let i = 0; i < howManyActivitiesYouWant; i++) { // dealing with one activity type at a time

		// this is the type
		console.log(prefs[i % prefs.length])

		// print the tyupe of activity we should be generating

	}


	// for(let j = 0; j < activities.length; j++){
	// 		console.log(dayActivities)

	// 	}
		
	// }
			// use modulo, i, and prefs.length (HINT HINT) to programmatically cycle thru prefs

	
			// once it correctly cycles thru -- and no sooner -- get a random activity for the type
			

		// } // end try
		// catch (err) {

		// }




				// loop over array of dates. in the loop:
					// create a workout (all type of activities selected)
					// set the workout day to be this date in the array


					// loop through array of types the user selected  --- use while loop with modulus (modulate by the number of activities they selected)

						// for each type:

						// if there are not yet 3 activities
							
							// random activity:

								// get the activities of this type from the database
								// Math.random to get one of those 



// const days = [
//                     'Monday',
//                     'Tuesday',
//                     'Wednesday',
//                     'Thursday',
//                     'Friday',
//                     'Saturday',
//                     'Sunday',
//                 ]





			
					
				

				
				
	// for(let i = 0 ; i < activites.length; i++){
	// 			if(activities[i].type === 'weights'){
	// 				userFocus.push(activities[i])
	// 			}
	// 		}
	// 		for(let i = 0; i < activities.length; i++){
	// 			if(activities[i].type === 'cardio'){
	// 				userFocus.push(activities[i])
	// 			}
	// 		}
	// 		for(let i = 0; i < activities.length; i++){
	// 			if(activities[i].type === 'plyos'){
	// 				userFocus.push(activities[i])
	// 			}
	// 		}
















			//workout.

			
		// 	res.render('index.ejs', {
		// 		plan: createdPlan
		// 	})

		// 	})
		// }
		// console.log('cool');
		res.send('check terminal')
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