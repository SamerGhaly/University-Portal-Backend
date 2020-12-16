const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
  name: String,
  type: String,
  capacity: Number,
})

roomSchema.virtual('members', {
  ref: 'Member',
  localField: '_id',
  foreignField: 'office',
})

roomSchema.virtual('schedule', {
  ref: 'Schedule',
  localField: '_id',
  foreignField: 'room',
})

roomSchema.set('toObject', { virtuals: true })
roomSchema.set('toJSON', { virtuals: true })

module.exports = mongoose.model('Room', roomSchema)
