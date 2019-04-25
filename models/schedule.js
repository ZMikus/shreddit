const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  week:{type: String},
  day:{type: String}
})

const = mongoose.model('Schedule', scheduleSchema)