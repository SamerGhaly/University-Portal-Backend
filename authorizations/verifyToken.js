const { required } = require('joi')

const jwt = require('jsonwebtoken')

const { invalidToken } = require('../constants/errorCodes')

const verifyToken = (req, res, next) => {
  const token = req.headers['auth-token']
  jwt.verify(token, process.env.SIGNING_KEY, (err, payload) => {
    if (err) {
      return res.json({
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
