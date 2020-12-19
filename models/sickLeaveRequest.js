const mongoose = require('mongoose')

const sickLeaveRequestSchema = new mongoose.Schema({
  from: Date,
  to: Date,
  comment: String,
  status: String,
  dateSubmitted: Date,
  documents: Array,
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  },
})

module.exports = mongoose.model('SickLeaveRequest', sickLeaveRequestSchema)
