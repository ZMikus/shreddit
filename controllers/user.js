const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Plan = require('../models/plan');
const Workout = require('../models/workout');
const Activities = require('../models/activities')


router.post('/', async (req, res) => {
  
    
  try{
    console.log('hitting the post route')
  
  }catch(err){
    
    /// create plan
    
    // 3 wo's /week -- or # wkouts/week comes from user.find
    // which ones

    // cycle thru em

    // figure out dates 

    // user could specify plan length


    // u could cho
  }
})

module.exports = router;