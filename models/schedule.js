const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  week:{type: String},
  day:{type: String}
  

})

const User = mongoose.model('Schedule', scheduleSchema)