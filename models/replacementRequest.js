const mongoose = require('mongoose')

const replacementRequestSchema = new mongoose.Schema({
  slot: String,
  day: String,
  comment: String,
  status: String,
  requestType: String,
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  },
  replacementMember: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  },
})

module.exports = mongoose.model('ReplacementRequest', replacementRequestSchema)
