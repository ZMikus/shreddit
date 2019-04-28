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
			// 

			
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