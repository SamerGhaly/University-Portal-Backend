const express = require('express')
const router = express.Router()

const {
  addSlot,
  updateSlot,
  deleteSlot,
  assignMemberToSlot,
} = require('../controllers/slotAssignmentController')
const {
  validateAddSlot,
  validateUpdateSlot,
  validateDeleteSlot,
  validateAssignSlotToMember,
} = require('../validations/slotAssignmentValidation')
const {
  verifyTA,
  verifyInstructor,
} = require('../authorizations/memberAuthorization')
const verifyToken = require('../authorizations/verifyToken')

router.post('/addSlot', validateAddSlot, verifyToken, verifyTA, addSlot)
router.post(
  '/updateSlot',
  validateUpdateSlot,
  verifyToken,
  verifyTA,
  updateSlot
)

router.post(
  '/deleteSlot',
  validateDeleteSlot,
  verifyToken,
  verifyTA,
  deleteSlot
)

router.post(
  '/assignSlotToMember',
  validateAssignSlotToMember,
  verifyToken,
  verifyInstructor,
  assignMemberToSlot
)

module.exports = router
