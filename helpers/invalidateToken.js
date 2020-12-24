const TokenBlacklist = require('../models/tokenBlacklistModel')

const invalidateToken = async (token, member, date) => {
  await TokenBlacklist.create({
    token,
    member,
    date,
  })
  return true
}

module.exports = invalidateToken
