const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Plan = require('../models/plan');
const Workout = require('../models/workout');
const Activities = require('../models/activities')
let userDbId = ''
//
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
							// const dayActivity = await Activities.find({name:typeOfActivity})
							const activitiesOfType = await Activities.find({type: typeOfActivity})
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
							
							if(a.quantity === null){
								activity.duration = 30
								activity.quantity = null
							}

							if(a.duration === null){
								activity.quantity = 30
								activity.duration = null
							}

							newWorkout.activities.push(activity)

						} // end of for loop that adds activities to workout
						newWorkout.day = allDays[i]
						// await newWorkout.save()
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
	
	console.log(req.params.id)

	try {
		// query the database to find the plan with id equal to the req.params.id
		const foundPlan = await Plan.findById(req.params.id)

		console.log("\nHere is the found plan: ")
		console.log(foundPlan)


			foundPlan.workouts.forEach((w, j) => {
				console.log("\nplan " + j + ": ");
				w.activities.forEach((a, k) => {
					console.log("activity " + k + ": ");
					console.log(a);
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
// /:plan_id/:workout_id/:plan_id/edit -- will need new url's and approach to this

router.get('/:plan_id/:workout_id/:activity_id/edit', async (req,res) => {
	try{
		let activityObject = {} 
		console.log(req.params.plan_id);
		console.log('===== Plan =======');
		console.log(req.params.workout_id);
		console.log('===== Workout =======');
		console.log(req.params.activity_id);
		console.log('===== Activity =======');

		const foundPlanId = await req.params.plan_id
		console.log(foundPlanId);
		console.log('===== foundPlanId =======');

		const foundWorkoutId = await req.params.workout_id
		console.log(foundWorkoutId);
		console.log('===== foundWorkoutId =======');

		const foundActivityId = await req.params.activity_id
		console.log(foundActivityId);
		console.log('===== foundActivityId =======');

		foundActivity = await Workout.collection.find({_id: foundActivityId})
		console.log(foundActivity);
		console.log('===== foundActivity =======');





		// for(let i = 0; i < foundActivity.workouts.length; i++) {
		// 	for(let j = 0; j < foundActivity.workouts[i].activities.length; i++){
		// 		console.log(foundActivity.workouts[i].activities[j]);
		// 	}	
		// }

		res.render('edit.ejs', {
			planId: foundPlanId,
			workoutId: foundWorkoutId,
			activityId: foundActivityId,
			activity: foundActivityId

		})
	} catch(err){
		console.log(err);
	}
})

// router.get('/:id/edit/', async (req, res) => {
// 	// getting this user's plan, taking 
// 	// 
// 	try {
// 		foundWorkout = await Workout.findById(req.params.id)
// 		foundActivity = await Activities.findById(foundWorkout.activities)
// 		res.render('edit.ejs', {
// 			activity: foundActivity,
// 			workout: foundWorkout
// 		})
// 	} catch(err) {
// 		console.log(err);
// 	}
// })

//UPDATE
router.put('/:id', async (req, res) => {
	try {
		updatedActivity = {
			_id: req.body.id,
			type: req.body.type,
			duration: req.body.duration,
			quantity: req.body.quantity,
			name: req.body.name
		}
		console.log('===============');
		console.log(updatedActivity);
		console.log('===============');
		const plan = await Plan.findOne({workouts: req.params.id})
		const foundWorkout = await Workout.findOne({activities: req.body.id})
		const planActivityToUpdate = await Activities.findByIdAndUpdate(req.body.id, updatedActivity, {new: true})
		plan.workouts.push(planActivityToUpdate)
		console.log('===============');
		console.log(planActivityToUpdate);
		console.log('===============');

		await planActivityToUpdate.save()
		plan.workouts.splice(plan.workouts.findIndex((workouts) => {
			return workouts.id === plan.workouts.id;
		}),1,planActivityToUpdate);
		await plan.save()
		res.redirect('/shreddit/' + plan.id);
	} catch(err) {
		console.log(err);
	}

	// Plan.findOne({workouts: req.params.id}, (err, foundPlan) => {
	// 	console.log('=====================');
	// 	console.log(foundPlan.activities);
	// 	console.log('=====================');
	// 	Workout.findById({_id: req.params.id}, (err, foundWorkout) => {
	// 		Activity.findOneAndUpdate(req.params.id, req.body, {new: true}, (err, updatedActivity)=>{
	// 			res.redirect('/shreddit');
	// 		})
	// 	})
	// });
});

//CREATE new activity
router.post('/new', (req, res) => {
	Activity.create(req.body, (err, createdActivity) => {
		if(err){
			res.send(err);
		}else{
			res.redirect('/shreddit');
		}
	})
})



//DESTROY Workout
router.delete('/:id', (req, res, next) => {
	console.log('HIT THE DELETE ROUTE')
	Plan.findOne({workouts: req.params.id}, (err, foundPlan) => {
		console.log(foundPlan);
		Workout.findById({_id: req.params.id}, (err, foundWorkout) =>{
			
			Workout.deleteOne({_id: req.params.id}, (err, deletedWorkout) => {
				console.log(req.params.id)
				if(err){
					next(err)
				}else{
					console.log(deletedWorkout)
				res.redirect('/shreddit/' + foundPlan._id)
				}				
			})
		
		})
	})
});			
		


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
			name: "Super Mans"
		},
		//weights
		{
			type: "weights",
			duration: null,
			quantity: 15,
			name: "Bench Press"
		},
		{
			type: "weights",
			duration: null,
			quantity: 15,
			name: "Military Press"
		},
		{
			type: "weights",
			duration: null,
			quantity: 20,
			name: "Squat"
		},
		
	]
		

	await Activities.create(activities)
  	res.send('now there\'s some data <a href="/">Home</a>')
})


module.exports = router;