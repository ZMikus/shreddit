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
			if(allDays[i].getDay() === 1 || allDays[i].getDay() === 3 || allDays[i].getDay() === 5) {
				// create a new blank workout
				const newWorkout = new Workout
				// build the workout
				for(let j = 0; j < howManyActivitiesYouWant; j++) { 
					// modulo, i, and prefs.length to programmatically cycle thru prefs
					// this is the type
					// print the type of activity we should be generating
					const typeOfActivity = prefs[j % prefs.length]
					// const dayActivity = await Activity.find({name:typeOfActivity})
					const activitiesOfType = await Activity.find({type: typeOfActivity})
					//get a random activity for the type
					const randomActivityNumber = Math.floor(Math.random() * (activitiesOfType.length));
					// newWorkout.activities.push(activitiesOfType[randomActivityNumber])
					const a = activitiesOfType[randomActivityNumber]
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
					
				newWorkout.day = allDays[i]
				
				await newWorkout.save()
				createdPlan.workouts.push(newWorkout)
			} // end of if its MWF

		}; // end of looping over days

		// find current user (should be possible using session)
		const currentUser = await User.findById(req.session.userDbId)
		
		await createdPlan.save();

		currentUser.plans.push(createdPlan)

		await currentUser.save();

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

	try {
		// query the database to find the plan with id equal to the req.params.id
		const foundPlan = await Plan.findById(req.params.id)

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


//UPDATE ACTIVITY
router.put('/:plan_id/:workout_id/:activity_id', async (req, res) => {
	try {
		const foundPlan = await Plan.findById(req.params.plan_id)

		const foundWorkout = await Workout.findById(req.params.workout_id)

	//UPDATE ACTIVITY
		let indexOfActivityToUpdate = null;
		let oldActivity = null;

		for(let i = 0; i < foundWorkout.activities.length; i++){
			if (foundWorkout.activities[i]._id.toString() === req.params.activity_id) {
				indexOfActivityToUpdate = i
				oldActivity = foundWorkout.activities[i]
			}
		};

		const updatedActivity = oldActivity

		if(updatedActivity.duration) {
			updatedActivity.duration = req.body.duration
		}

		if(updatedActivity.quantity) {
			updatedActivity.quantity = req.body.quantity
		}

		foundWorkout.activities.splice(indexOfActivityToUpdate, 1, updatedActivity)

		const newWorkout = await foundWorkout.save()


	//UPDATE WORKOUT & PLAN
		let indexOfWorkoutToUpdate = null;
		let oldWorkout = null;

		for (let i = 0; i < foundPlan.workouts.length; i++) {
			if(foundPlan.workouts[i]._id.toString() === req.params.workout_id) {
				indexOfWorkoutToUpdate = i
				oldWorkout = foundPlan.workouts[i]
			}
		};

		foundPlan.workouts.splice(indexOfWorkoutToUpdate, 1, newWorkout)

		const newPlan = await foundPlan.save()

		res.redirect('/shreddit/' + req.params.plan_id);

	} catch(err) {
		console.log(err);
	}
});


//NEW
router.get('/:plan_id/:workout_id/new', async (req, res) => {
	try{
		const foundPlan = await Plan.findById(req.params.plan_id)

		const foundWorkout = await Workout.findById(req.params.workout_id)

		res.render('new.ejs', {
			planId: req.params.plan_id,
			workoutId: req.params.workout_id
		})
	} catch (err){
		console.log(err);
	}
});


//CREATE new activity
router.post('/:plan_id/:workout_id', async (req, res) => {
	Activity.create(req.body, async (err, createdActivity) => {
		try{
			const foundPlan = await Plan.findById(req.params.plan_id)

			const foundWorkout = await Workout.findById(req.params.workout_id)

			foundWorkout.activities.push(createdActivity)

			const newWorkout = await foundWorkout.save()

			let indexOfWorkoutToUpdate = null;
			let oldWorkout = null;

			for (let i = 0; i < foundPlan.workouts.length; i++) {
				if(foundPlan.workouts[i]._id.toString() === req.params.plan_id) {
					indexOfWorkoutToUpdate = i
				}
			}

			foundPlan.workouts.splice(indexOfWorkoutToUpdate, 1, newWorkout)

			const newPlan = await foundPlan.save()

			res.redirect('/shreddit/' + foundPlan._id);
		} catch(err){
			console.log(err);
		};
	});
});


//DESTROY Activity
router.delete('/:plan_id/:workout_id/:activity_id', async (req, res) => {
	Activity.findByIdAndRemove(req.params.id, async (err, deletedActivity) => {
		try{
			const foundPlan = await Plan.findById(req.params.plan_id)

			const foundWorkout = await Workout.findById(req.params.workout_id)

			let indexOfActivityToDelete = null;
			let foundActivity = null;
			let newWorkout = null;

			for(let i = 0; i < foundWorkout.activities.length; i++){
				if (foundWorkout.activities[i]._id.toString() === req.params.activity_id){
					indexOfActivityToDelete = i
					foundActivity = foundWorkout.activities[i]
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
			};

			foundPlan.workouts.splice(indexOfWorkoutToUpdate, 1, newWorkout)

			const newPlan = await foundPlan.save()

			res.redirect('/shreddit/' + req.params.plan_id)

		} catch (err){
			console.log(err);
		};
	});
});


//DESTROY(aka complete) Workout
router.delete('/:plan_id/:workout_id', async (req, res) => {
	Workout.findByIdAndRemove(req.params.id, async (err, deletedWorkout) => {
		try{
			const foundPlan = await Plan.findById(req.params.plan_id)

			const foundWorkout = await Workout.findById(req.params.workout_id)

			let indexOfWorkoutToDelete = null;
			let completedWorkout = null;
			let newWorkout = null;

			for(let i = 0; i < foundPlan.workouts.length; i++){
				if (foundPlan.workouts[i]._id.toString() === req.params.workout_id){
					indexOfWorkoutToDelete = i
					completedWorkout = foundWorkout[i]
					foundPlan.workouts.splice(indexOfWorkoutToDelete, 1)
					newWorkout = await foundWorkout.save()
				}
			};

		//UPDATE WORKOUT & PLAN
			let indexOfPlanToUpdate = null;
			let oldPlan = null;

			for (let i = 0; i < foundPlan.length; i++) {
				if(foundPlan[i]._id.toString() === req.params.plan_id) {
					indexOfPlanToUpdate = i
					oldPlan = foundPlan[i]
					foundPlan.splice(i, 1)
				}
			};

			const newPlan = await foundPlan.save()

			res.redirect('/shreddit/' + req.params.plan_id)

		}catch(err){
			console.log(err);
		};
	});
});

//SEED DATABASE ROUTE
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
	];

	await Activity.create(activities)
  	res.send('now there\'s some data <a href="/">Home</a>')
});


module.exports = router;