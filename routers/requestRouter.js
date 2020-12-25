const express = require('express')
const router = express.Router()
const verifyToken = require('../authorizations/verifyToken')
const {
  verifyTA,
  verifyAcademic,
  verifyHOD,
  verifyInstructorTA,
} = require('../authorizations/memberAuthorization')

const {
  validateAccidentalLeave,
  validateChangeDayOffRequest,
  validateViewSlotLinkingRequest,
  validateSendAnnualLeaveRequest,
  validateAcceptRejectAnnualLeaveRequest,
  validateCancelAnnualLeaveRequest,
} = require('../validations/requestValidation')
const {
  sendAnnualLeave,
  acceptAnnualLeaveRequest,
  rejectAnnualLeaveRequest,
  cancelAnnualLeaveRequest,
  accidentalLeaveRequest,
  changeDayOffRequest,
} = require('../controllers/requestController')
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
const {
  validateCancelChangeDayOffRequest,
} = require('../validations/requestValidation')
const {
  cancelChangeDayOffRequest,
} = require('../controllers/requestController')
const {
  validateCompensationLeavesRequest,
} = require('../validations/requestValidation')
const { compensationLeaveRequest } = require('../controllers/requestController')

const {
  validateSlotLinkingRequest,
  validateAcceptRejectLinkingRequest,
  validateReplcamentRequest,
} = require('../validations/requestValidation')
const {
  sendSlotLinking,
  acceptSlotLinkingRequest,
  rejectSlotLinkingRequest,
  cancelSlotLinkingRequest,
  viewSlotLinkning,
  sendReplacementRequest,
} = require('../controllers/requestController')

router.post(
  '/sendReplacementRequest',
  validateReplcamentRequest,
  verifyToken,
  verifyAcademic,
  sendReplacementRequest
)

router.post(
  '/sendSlotLinking',
  validateSlotLinkingRequest,
  verifyToken,
  verifyInstructorTA,
  sendSlotLinking
)

router.post(
  '/acceptSlotLinking',
  validateAcceptRejectLinkingRequest,
  verifyToken,
  verifyTA,
  acceptSlotLinkingRequest
)

router.post(
  '/rejectSlotLinking',
  validateAcceptRejectLinkingRequest,
  verifyToken,
  verifyTA,
  rejectSlotLinkingRequest
)

router.post(
  '/cancelSlotLinking',
  validateAcceptRejectLinkingRequest,
  verifyToken,
  verifyAcademic,
  cancelSlotLinkingRequest
)

router.post(
  '/viewSlotLinking',
  validateViewSlotLinkingRequest,
  verifyToken,
  verifyTA,
  viewSlotLinkning
)

router.post(
  '/changeDayOff',
  validateChangeDayOffRequest,
  verifyToken,
  verifyAcademic,
  changeDayOffRequest
)
router.post(
  '/acceptDayOff',
  validateAcceptDayOffRequest,
  verifyToken,
  verifyHOD,
  acceptDayOffRequest
)
router.post(
  '/rejectDayOff',
  validateRejectDayOffRequest,
  verifyToken,
  verifyHOD,
  rejectDayOffRequest
)
router.post(
  '/sickLeave',
  validateSickLeavesRequest,
  verifyToken,
  verifyAcademic,
  sickLeaveRequest
)
router.post(
  '/maternityLeave',
  validateMaternityLeavesRequest,
  verifyToken,
  verifyAcademic,
  maternityLeaveRequest
)
router.post(
  '/acceptSickLeave',
  validateAcceptSickLeavesRequest,
  verifyToken,
  verifyHOD,
  acceptSickLeaveRequest
)
router.post(
  '/rejectSickLeave',
  validateRejectSickLeavesRequest,
  verifyToken,
  verifyHOD,
  rejectSickLeaveRequest
)
router.post(
  '/acceptMaternityLeave',
  validateAcceptMaternityLeavesRequest,
  verifyToken,
  verifyHOD,
  acceptMaternityLeaveRequest
)
router.post(
  '/rejectMaternityLeave',
  validateRejectMaternityLeavesRequest,
  verifyToken,
  verifyHOD,
  rejectMaternityLeaveRequest
)
router.post(
  '/cancelSickLeaveRequest',
  validateCancelMaternityLeavesRequest,
  verifyToken,
  verifyAcademic,
  cancelSickLeaveRequest
)

router.post(
  '/cancelMaternityLeaveRequest',
  validateCancelSickLeavesRequest,
  verifyToken,
  verifyAcademic,
  cancelMaternityLeaveRequest
)

router.post(
  '/cancelChangeDayOffRequest',
  validateCancelChangeDayOffRequest,
  verifyToken,
  verifyAcademic,
  cancelChangeDayOffRequest
)

router.post(
  '/sendAnnualLeaveRequest',
  validateSendAnnualLeaveRequest,
  verifyToken,
  verifyAcademic,
  sendAnnualLeave
)

router.post(
  '/acceptAnnualLeaveRequest',
  validateAcceptRejectAnnualLeaveRequest,
  verifyToken,
  verifyHOD,
  acceptAnnualLeaveRequest
)

router.post(
  '/rejectAnnualLeaveRequest',
  validateAcceptRejectAnnualLeaveRequest,
  verifyToken,
  verifyHOD,
  rejectAnnualLeaveRequest
)

router.post(
  '/cancelAnnualLeaveRequest',
  validateCancelAnnualLeaveRequest,
  verifyToken,
  verifyAcademic,
  cancelAnnualLeaveRequest
)

router.post(
  '/accidentalLeaveRequest',
  validateAccidentalLeave,
  verifyToken,
  accidentalLeaveRequest
)

router.post(
  '/compensationLeaveRequest',
  validateCompensationLeavesRequest,
  verifyToken,
  compensationLeaveRequest
)
module.exports = router
