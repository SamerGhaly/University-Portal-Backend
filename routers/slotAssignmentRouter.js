const express = require('express')
const router = express.Router()

const {
  addSlot,
  updateSlot,
  deleteSlot,
  assignMemberToSlot,
  updateMemberSlotAssignment,
  deleteMemberSlotAssignment,
} = require('../controllers/slotAssignmentController')
const {
  validateAddSlot,
  validateUpdateSlot,
  validateDeleteSlot,
  validateAssignSlotToMember,
  validateUpdateSlotAssignment,
  validateDeleteSlotAssignment,
} = require('../validations/slotAssignmentValidation')
const {
  verifyTA,
  verifyInstructor,
} = require('../authorizations/memberAuthorization')
const verifyToken = require('../authorizations/verifyToken')

router.post('/addSlot', validateAddSlot, verifyToken, verifyTA, addSlot)
router.put(
  '/updateSlot',
  validateUpdateSlot,
  verifyToken,
  verifyTA,
  updateSlot
)

router.delete(
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

router.put(
  '/updateSlotMemberAssign',
  validateUpdateSlotAssignment,
  verifyToken,
  verifyInstructor,
  updateMemberSlotAssignment
)

router.delete(
  '/deleteSlotMemberAssign',
  validateDeleteSlotAssignment,
  verifyToken,
  verifyInstructor,
  deleteMemberSlotAssignment
)

module.exports = router
