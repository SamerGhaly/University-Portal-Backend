const express = require('express')
const router = express.Router()

const {
  validateChangeDayOffRequest,
} = require('../validations/requestValidation')
const { changeDayOffRequest } = require('../controllers/requestController')
const {
  validateAcceptDayOffRequest,
} = require('../validations/requestValidation')
const { acceptDayOffRequest } = require('../controllers/requestController')
const {
  validateRejectDayOffRequest,
} = require('../validations/requestValidation')
const { rejectDayOffRequest } = require('../controllers/requestController')
const {
  validateSickLeavesRequest,
} = require('../validations/requestValidation')
const { sickLeaveRequest } = require('../controllers/requestController')
const {
  validateMaternityLeavesRequest,
} = require('../validations/requestValidation')
const { maternityLeaveRequest } = require('../controllers/requestController')

const {
  validateAcceptSickLeavesRequest,
} = require('../validations/requestValidation')
const { acceptSickLeaveRequest } = require('../controllers/requestController')
const {
  validateRejectSickLeavesRequest,
} = require('../validations/requestValidation')
const { rejectSickLeaveRequest } = require('../controllers/requestController')

const {
  validateAcceptMaternityLeavesRequest,
} = require('../validations/requestValidation')
const {
  acceptMaternityLeaveRequest,
} = require('../controllers/requestController')
const {
  validateRejectMaternityLeavesRequest,
} = require('../validations/requestValidation')
const {
  rejectMaternityLeaveRequest,
} = require('../controllers/requestController')
const {
  validateCancelSickLeavesRequest,
} = require('../validations/requestValidation')
const { cancelSickLeaveRequest } = require('../controllers/requestController')
const {
  validateCancelMaternityLeavesRequest,
} = require('../validations/requestValidation')
const {
  cancelMaternityLeaveRequest,
} = require('../controllers/requestController')

router.post('/changeDayOff', validateChangeDayOffRequest, changeDayOffRequest)
router.post('/acceptDayOff', validateAcceptDayOffRequest, acceptDayOffRequest)
router.post('/rejectDayOff', validateRejectDayOffRequest, rejectDayOffRequest)
router.post('/sickLeave', validateSickLeavesRequest, sickLeaveRequest)
router.post(
  '/maternityLeave',
  validateMaternityLeavesRequest,
  maternityLeaveRequest
)
router.post(
  '/acceptSickLeave',
  validateAcceptSickLeavesRequest,
  acceptSickLeaveRequest
)
router.post(
  '/rejectSickLeave',
  validateRejectSickLeavesRequest,
  rejectSickLeaveRequest
)
router.post(
  '/acceptMaternityLeave',
  validateAcceptMaternityLeavesRequest,
  acceptMaternityLeaveRequest
)
router.post(
  '/rejectMaternityLeave',
  validateRejectMaternityLeavesRequest,
  rejectMaternityLeaveRequest
)
router.post(
  '/cancelSickLeaveRequest',
  validateCancelMaternityLeavesRequest,
  cancelSickLeaveRequest
)
router.post(
  '/cancelMaternityLeaveRequest',
  validateCancelSickLeavesRequest,
  cancelMaternityLeaveRequest
)

module.exports = router
