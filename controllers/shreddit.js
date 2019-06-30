const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Plan = require('../models/plan');
const Workout = require('../models/workout');
const Activity = require('../models/activities')
let userDbId = ''

//SHOW Summary Page
router.get('/summary', async (req, res) => {
	try {
		const userDbId = req.session.userDbId
		const u = await User.findById(userDbId).populate('plans')
		console.log(u);
		res.render('summary.ejs', {
			plans: u.plans
		})
	} catch(err) {
		console.log(err);
	}
});

//POST : Create/Select Plan
router.post('/', async (req, res, next) => {
	try{
			const createdPlan = await Plan.create(req.body)

			const prefs = [] 
			if(req.body.weights === 'on'){
				prefs.push('weights')
			}
			if(req.body.plyos === 'on'){
				prefs.push('plyos')
			}
			if(req.body.cardio === 'on'){
				prefs.push('cardio')
			}
			//console.log(req.body);
			const howManyActivitiesYouWant = req.body.selectitem;
			const workoutDays = []
			const startDate = new Date(req.body.startDate)
			const allDays = [startDate]
			// creating an array of all days for the next 4 weeks
			for(let i = 0; i < 27; i++){
				// create the next date object -- 1 day after the last element in allDays
				const newDate = new Date(allDays[i].getTime() + (24 * 60 * 60 * 1000))
				// const stringDate = newDate.toDateString();
				allDays.push(newDate)
			};
			
			

			for(let i = 0; i < allDays.length; i++){
					if(allDays[i].getDay() === 1 || allDays[i].getDay() === 3 || allDays[i]
					.getDay() === 5) {
						// create a new blank workout



						const newWorkout = new Workout
						// build the workout
						for(let j = 0; j < howManyActivitiesYouWant; j++) { 
							// use modulo, i, and prefs.length (HINT HINT) to programmatically cycle thru prefs
							// this is the type
				
							// print the type of activity we should be generating
							const typeOfActivity = prefs[j % prefs.length]
							// console.log(typeOfActivity)
							// const dayActivity = await Activity.find({name:typeOfActivity})
							const activitiesOfType = await Activity.find({type: typeOfActivity})
							//console.log("activities of type " + typeOfActivity)
							//console.log(activitiesOfType)
							// once it correctly cycles thru -- and no sooner -- get a random activity for the type
				
							const randomActivityNumber = Math.floor(Math.random() * (activitiesOfType.length));
							


							// newWorkout.activities.push(activitiesOfType[randomActivityNumber])
							const a = activitiesOfType[randomActivityNumber]
							//
							console.log("\n here is a");
							console.log(a);

							const activity = {}
							activity.name = a.name
							activity.type = a.type

							const durationAmt = (Math.floor(Math.random() * (120 - 30)) + 30)
							
							if(a.quantity === null){
								activity.duration = (Math.round(durationAmt / 10) * 10)
								activity.quantity = null
							}

							const quantityAmt = (Math.floor(Math.random() * (60 - 30)) + 30)

							if(a.duration === null){
								activity.quantity = (Math.round(quantityAmt / 5) * 5);
								activity.duration = null
							}

							newWorkout.activities.push(activity)

						} // end of for loop that adds activities to workout
						
						newWorkout.day = allDays[i].toDateString();
						
						await newWorkout.save()
						createdPlan.workouts.push(newWorkout)
				} // end of if its MWF

			}; // end of looping over days


			// find the current user (should be possible using session)
			console.log("\nwe are trying to find the user based on session");
			console.log("here is session:");
			console.log(req.session);
			const currentUser = await User.findById(req.session.userDbId)
			
			await createdPlan.save();

			console.log("\nwe just saved plan, here it is post save");
			console.log(createdPlan);

			// put the createdPlan onto the current user in correct place
			currentUser.plans.push(createdPlan)

			console.log("\nwe just pushed plan into user, here is user, which we are about to save");
			console.log(currentUser);

			await currentUser.save();

			console.log("\nhere is currentUser after saving, if it worked, we can redirect now");
			console.log(currentUser);			

			// console.log("\n here is the createdPlan")
			// console.log(createdPlan)

			
		
			res.redirect('/shreddit/' + createdPlan._id)

		} catch(err) {
			next(err)
		}
});

router.get('/select-plan', (req, res) => {
	res.render('selectPlan.ejs')
});


//PLAN SHOW
router.get('/:id', async (req, res, next) => {
	
	//console.log(req.params.id)

	try {
		// query the database to find the plan with id equal to the req.params.id
		const foundPlan = await Plan.findById(req.params.id)

		//console.log("\nHere is the found plan: ")*********
		//console.log(foundPlan)*********


			foundPlan.workouts.forEach((w, j) => {
				//console.log("\nworkout " + j + ": ");****
				w.activities.forEach((a, k) => {
					//console.log("activity " + k + ": ");******
					//console.log(a);********
				})
			})
		

		res.render("show.ejs", {
			// yourChosenName: data
			plan: foundPlan,

		})

	} catch (err) {
		// error handling goes here
		next(err)
	}

});

//EDIT ACTIVITY
router.get('/:plan_id/:workout_id/:activity_id/edit', async (req,res) => {
	try{
		const foundPlan = await Plan.findById(req.params.plan_id)

		const foundWorkout = await Workout.findById(req.params.workout_id)

		let foundActivity = null;

		for(let i = 0; i < foundWorkout.activities.length; i++){
			if (foundWorkout.activities[i]._id.toString() === req.params.activity_id) {
				foundActivity = foundWorkout.activities[i]
			}
		}

		res.render('edit.ejs', {
			planId: req.params.plan_id,
			workoutId: req.params.workout_id,
			activityId: req.params.activity_id,
			activity: foundActivity,
			workout: foundWorkout, 
			plan: foundPlan

		})
	} catch(err){
		console.log(err);
	}
})


//UPDATE ACTIVITY-->WORKOUT-->PLAN
router.put('/:plan_id/:workout_id/:activity_id', async (req, res) => {
	try {

		const foundPlan = await Plan.findById(req.params.plan_id)
		console.log(foundPlan);
		console.log("===== PUT found plan ========");

		const foundWorkout = await Workout.findById(req.params.workout_id)
		console.log(foundWorkout);
		console.log('===== PUT found workout =======');

	//UPDATE ACTIVITY
		let indexOfActivityToUpdate = null;
		let oldActivity = null;

		for(let i = 0; i < foundWorkout.activities.length; i++){
			if (foundWorkout.activities[i]._id.toString() === req.params.activity_id) {
				indexOfActivityToUpdate = i
				oldActivity = foundWorkout.activities[i]
			}
		}

			const updatedActivity = oldActivity

			console.log(oldActivity);
			console.log('====PUT OLD ACTIVITY pre-update=====');

			if(updatedActivity.duration) {
				updatedActivity.duration = req.body.duration
			}

			if(updatedActivity.quantity) {
				updatedActivity.quantity = req.body.quantity
			}

			foundWorkout.activities.splice(indexOfActivityToUpdate, 1, updatedActivity)

			const newWorkout = await foundWorkout.save()

			console.log(newWorkout);
			console.log('====PUT found workout updated=====');
		//}

	//UPDATE WORKOUT & PLAN
		let indexOfWorkoutToUpdate = null;
		let oldWorkout = null;

		for (let i = 0; i < foundPlan.workouts.length; i++) {
			if(foundPlan.workouts[i]._id.toString() === req.params.workout_id) {
				indexOfWorkoutToUpdate = i
				console.log('hitting the indexOfWorkoutToUpdate loop');
				console.log(indexOfWorkoutToUpdate);
				oldWorkout = foundPlan.workouts[i]
			}
		}

			foundPlan.workouts.splice(indexOfWorkoutToUpdate, 1, newWorkout)

			const newPlan = await foundPlan.save()

			console.log(newPlan);
			console.log('====PUT found plan updated=====');

		res.redirect('/shreddit/' + req.params.plan_id);

	} catch(err) {
		console.log(err);
	}
});

//NEW
router.get('/:plan_id/:workout_id/new', async (req, res) => {
	try{
		const foundPlan = await Plan.findById(req.params.plan_id)
		console.log(foundPlan);
		console.log("==== POST found plan ========");

		const foundWorkout = await Workout.findById(req.params.workout_id)
		console.log(foundWorkout);
		console.log('===== POST found workout =======');


		res.render('new.ejs', {
			planId: req.params.plan_id,
			workoutId: req.params.workout_id
		})
	} catch (err){
		console.log(err);
	}
})


//CREATE new activity
router.post('/:plan_id/:workout_id', async (req, res) => {
	Activity.create(req.body, async (err, createdActivity) => {
		try{
			const foundPlan = await Plan.findById(req.params.plan_id)
			console.log(foundPlan);
			console.log("==== POST found plan ========");

			const foundWorkout = await Workout.findById(req.params.workout_id)
			console.log(foundWorkout);
			console.log('===== POST found workout =======');

			foundWorkout.activities.push(createdActivity)

			const newWorkout = await foundWorkout.save()

			console.log(newWorkout)
			console.log('===== POST new workout =======')

			let indexOfWorkoutToUpdate = null;
			let oldWorkout = null;

			for (let i = 0; i < foundPlan.workouts.length; i++) {
				if(foundPlan.workouts[i]._id.toString() === req.params.plan_id) {
					indexOfWorkoutToUpdate = i
				}
			}

			foundPlan.workouts.splice(indexOfWorkoutToUpdate, 1, newWorkout)

			const newPlan = await foundPlan.save()

			console.log(newPlan)
			console.log('===== POST new plan =======')

			res.redirect('/shreddit/' + foundPlan._id);
		} catch(err){
			console.log(err);
		}
	})
})



//DESTROY Activity
router.delete('/:plan_id/:workout_id/:activity_id', async (req, res) => {
	Activity.findByIdAndRemove(req.params.id, async (err, deletedActivity) => {

		console.log('YOU HIT THE DELETE ROUTE')
		try{
			const foundPlan = await Plan.findById(req.params.plan_id)
				//console.log(foundPlan);

			const foundWorkout = await Workout.findById(req.params.workout_id)
				console.log(foundWorkout)

			let indexOfActivityToDelete = null;
			let foundActivity = null;
			let newWorkout = null;

			for(let i = 0; i < foundWorkout.activities.length; i++){
				if (foundWorkout.activities[i]._id.toString() === req.params.activity_id){
					indexOfActivityToDelete = i
					foundActivity = foundWorkout.activities[i]
					console.log("this is the found activity");
					console.log(foundActivity);
					foundWorkout.activities.splice(indexOfActivityToDelete, 1)
					newWorkout = await foundWorkout.save()
					

				}
			}

		//UPDATE WORKOUT & PLAN
			let indexOfWorkoutToUpdate = null;
			let oldWorkout = null;

			for (let i = 0; i < foundPlan.workouts.length; i++) {
				if(foundPlan.workouts[i]._id.toString() === req.params.workout_id) {
					indexOfWorkoutToUpdate = i
					oldWorkout = foundPlan.workouts[i]
				}
			}

			foundPlan.workouts.splice(indexOfWorkoutToUpdate, 1, newWorkout)

			const newPlan = await foundPlan.save()

			console.log(newPlan);

			

			console.log('this is the new workout yo');
			console.log(newWorkout);

			console.log('this is the new plan');
			console.log(newPlan);

			res.redirect('/shreddit/' + req.params.plan_id)

		} catch (err){
			console.log(err);
		}
	})
});

//DESTROY(aka complete) Workout
router.delete('/:plan_id/:workout_id', async (req, res) => {
	Workout.findByIdAndRemove(req.params.id, async (err, deletedWorkout) => {
		console.log("completed workout route hit");
		try{
			const foundPlan = await Plan.findById(req.params.plan_id)
				//console.log(foundPlan);

			const foundWorkout = await Workout.findById(req.params.workout_id)
				//console.log(foundWorkout)

			let indexOfWorkoutToDelete = null;
			let completedWorkout = null;
			let newWorkout = null;

			for(let i = 0; i < foundPlan.workouts.length; i++){
				if (foundPlan.workouts[i]._id.toString() === req.params.workout_id){
					indexOfWorkoutToDelete = i
					completedWorkout = foundWorkout[i]
					console.log("hitting the found workout loop");
					foundPlan.workouts.splice(indexOfWorkoutToDelete, 1)
					newWorkout = await foundWorkout.save()
					console.log('**this is the new workout');
					console.log(newWorkout);
				}
			}

		//UPDATE WORKOUT & PLAN
			let indexOfPlanToUpdate = null;
			let oldPlan = null;

			for (let i = 0; i < foundPlan.length; i++) {
				if(foundPlan[i]._id.toString() === req.params.plan_id) {
					indexOfPlanToUpdate = i
					oldPlan = foundPlan[i]
					foundPlan.splice(i, 1)
				}
			}

			const newPlan = await foundPlan.save()

			console.log('this is the new plan');
			console.log(newPlan);

			res.redirect('/shreddit/' + req.params.plan_id)

		}catch(err){
			console.log(err);
		}
	})
});



//V1 DELETE
	//})
	// // Plan.findOne({workouts: req.params.id}, (err, foundPlan) => {
	// // 	console.log(foundPlan);
	// 	Workout.findById({_id: req.params.id}, (err, foundWorkout) =>{
			
	// 		Workout.deleteOne({_id: req.params.id}, (err, deletedWorkout) => {
	// 			console.log(req.params.id)
	// 			if(err){
	// 				next(err)
	// 			}else{
	// 				console.log(deletedWorkout)
	// 			res.redirect('/shreddit/' + req.params.plan_id)
	// 			}				

	// 	})
		


router.get('/seed/data', async (req, res, next) => {
	
	const activities = [
		//cardio
		{
			type: "cardio",
			duration: 90,
			quantity: null,
			name: "Run"
		},
		{
			type: "cardio",
			duration: 90,
			quantity: null, 
			name: "Bike ride"
		},
		{
			type: "cardio",
			duration: 90,
			quantity: null, 
			name: "Ellipitcal"
		},
		{
			type: "cardio",
			duration: 90,
			quantity: null, 
			name: "Jump Rope"
		},
		{
			type: "cardio",
			duration: 90,
			quantity: null, 
			name: "Stair Master"
		},
		{
			type: "cardio",
			duration: 90,
			quantity: null, 
			name: "Kettlebells"
		},
		//plyo
		{
			type: "plyos",
			duration: null,
			quantity: 50,
			name: "Burpies"
		},
		{
			type: "plyos",
			duration: null,
			quantity: 50,
			name: "Jumping Jacks"
		},
		{
			type: "plyos",
			duration: null,
			quantity: 50,
			name: "Bounding"
		},
		{
			type: "plyos",
			duration: null,
			quantity: 50,
			name: "Box Jumps"
		},
		{
			type: "plyos",
			duration: null,
			quantity: 50,
			name: "Plyo Pushups"
		},
		{
			type: "plyos",
			duration: null,
			quantity: 50,
			name: "Depth Jumps"
		},


		//weights
		{
			type: "weights",
			duration: null,
			quantity: 15,
			name: "Bench Presses"
		},
		{
			type: "weights",
			duration: null,
			quantity: 15,
			name: "Military Presses"
		},
		{
			type: "weights",
			duration: null,
			quantity: 20,
			name: "Squats"
		},
		{
			type: "weights",
			duration: null,
			quantity: 20,
			name: "Back Squats"
		},
		{
			type: "weights",
			duration: null,
			quantity: 20,
			name: "Overhead Presses"
		},
		{
			type: "weights",
			duration: null,
			quantity: 20,
			name: "Dumbbell Bench Presses"
		},
		{
			type: "weights",
			duration: null,
			quantity: 20,
			name: "Diamond Press-Ups"
		}
	]
		

	await Activity.create(activities)
  	res.send('now there\'s some data <a href="/">Home</a>')
});


module.exports = router;



