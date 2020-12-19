const mongoose = require('mongoose')

const changeDayOffRequestSchema = new mongoose.Schema({
  newDayOff: String,
  status: String,
  comment: String,
  reason: String,
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  },
})

module.exports = mongoose.model(
  'ChangeDayOffRequest',
  changeDayOffRequestSchema
)
