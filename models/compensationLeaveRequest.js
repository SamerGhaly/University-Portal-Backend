const mongoose = require('mongoose')

const compensationLeaveRequestSchema = new mongoose.Schema({
  absentDate: Date,
  compensationDate: Date,
  comment: String,
  status: String,
  dateSubmitted: Date,
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  },
})

module.exports = mongoose.model(
  'CompensationLeaveRequest',
  compensationLeaveRequestSchema
)
