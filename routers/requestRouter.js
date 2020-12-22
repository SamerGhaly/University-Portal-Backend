const express = require('express')
const router = express.Router()
const verifyToken = require('../authorizations/verifyToken')

const {
  validateSlotLinkingRequest,
} = require('../validations/requestValidation')
const { sendSlotLinking } = require('../controllers/requestController')

router.post(
  '/sendSlotLinking',
  validateSlotLinkingRequest,
  verifyToken,
  sendSlotLinking
)

module.exports = router
