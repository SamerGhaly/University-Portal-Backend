const mongoose = require('mongoose')

const blacklistTokenSchema = new mongoose.Schema({
  token: String,
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  },
  date: Date,
})

module.exports = mongoose.model('TokenBlacklist', blacklistTokenSchema)
