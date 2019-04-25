const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({

  name:{
    name:String,
    required: true
    },
  type:{
    name: String,
    required: true
  },
  duration:{type: Number}

})

const workOut = mongoose.model('Workout', workOutSchema)