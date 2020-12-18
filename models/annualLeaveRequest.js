const mongoose = require('mongoose')

const annualLeaveRequestSchema = new mongoose.Schema({
  from: Date,
  to: Date,
  comment: String,
  status: String,
  dateSubmitted: Date,
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  },
})

module.exports = mongoose.model('AnnualLeaveRequest', annualLeaveRequestSchema)
