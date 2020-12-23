const { required } = require('joi')

const jwt = require('jsonwebtoken')
const TokenBlacklist = require('../models/tokenBlacklistModel')

const { invalidToken } = require('../constants/errorCodes')

const verifyToken = async (req, res, next) => {
  const token = req.headers['auth-token']
  const checkBlackList = await TokenBlacklist.findOne({
    token,
  })
  if (checkBlackList)
    return res.status(403).json({
      code: invalidToken,
      message: 'token logged out',
    })

  jwt.verify(token, process.env.SIGNING_KEY, (err, payload) => {
    if (err) {
      return res.status(403).json({
        code: invalidToken,
        message: 'token error',
      })
    } else {
      req.member = payload
      next()
    }
  })
}

module.exports = verifyToken
