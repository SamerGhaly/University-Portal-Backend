const mongoose = require('mongoose')

const slotLinkingRequestSchema = new mongoose.Schema({
  slot: Number,
  day: String,
  status: String,
  comment: String,
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  },
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  },
})

module.exports = mongoose.model('SlotLinkingRequest', slotLinkingRequestSchema)
