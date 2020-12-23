const mongoose = require('mongoose')

const slotLinkingRequestSchema = new mongoose.Schema({
  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SlotAssignment',
  },
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  },
  status: String,
})

slotLinkingRequestSchema.set('toObject', { virtuals: true })
slotLinkingRequestSchema.set('toJSON', { virtuals: true })

module.exports = mongoose.model('SlotLinkingRequest', slotLinkingRequestSchema)
