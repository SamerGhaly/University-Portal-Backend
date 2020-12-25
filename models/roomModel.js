const mongoose = require('mongoose')
const memberModel = require('./memberModel')

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
  },
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

roomSchema.post('findOneAndRemove', async (doc) => {
  await memberModel.updateMany({ office: doc._id }, { $unset: { office: '' } })
})

module.exports = mongoose.model('Room', roomSchema)
