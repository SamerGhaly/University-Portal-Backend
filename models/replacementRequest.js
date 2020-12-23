const mongoose = require('mongoose')

const replacementRequestSchema = new mongoose.Schema({
  comment: String,
  reason: String,
  status: String,
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  },
  replacementMember: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  },
  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SlotAssignment',
  },
  dateOfReplacement: Date,
})

module.exports = mongoose.model('ReplacementRequest', replacementRequestSchema)
