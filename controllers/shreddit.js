const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Plan = require('../models/plan');
const Workout = require('../models/workout');

router.get('/', (req, res) => {
	res.render('index.ejs')	
})


module.exports = router;