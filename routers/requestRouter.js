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
  validateAcceptAccidentalLeave,
  validateChangeDayOffRequest,
  validateViewSlotLinkingRequest,
  validateSendAnnualLeaveRequest,
  validateAcceptRejectAnnualLeaveRequest,
  validateCancelAnnualLeaveRequest,
  validateAcceptCompensationLeavesRequest,
  validateViewRequest,
} = require('../validations/requestValidation')
const {
  accidentalCancelRequest,
  accidentalRejectRequest,
  accidentalAcceptRequest,
  sendAnnualLeave,
  acceptAnnualLeaveRequest,
  rejectAnnualLeaveRequest,
  cancelAnnualLeaveRequest,
  accidentalLeaveRequest,
  changeDayOffRequest,
  acceptCompensationLeaveRequest,
  viewAnnualRequests,
  viewAccidentalRequests,
  viewChangeDayOffRequests,
  viewSickRequests,
  viewMaternityRequests,
  viewCompensationRequests,
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
  validateAccidentalLeave,
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
  validateRejectCompensationLeavesRequest,
} = require('../validations/requestValidation')
const {
  sendSlotLinking,
  acceptSlotLinkingRequest,
  rejectSlotLinkingRequest,
  cancelSlotLinkingRequest,
  viewSlotLinkning,
  sendReplacementRequest,
  rejectCompensationLeaveRequest,
} = require('../controllers/requestController')

router.post(
  '/sendReplacementRequest',
  validateReplcamentRequest,
  verifyToken,
  verifyInstructorTA,
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
  '/accidentalAcceptRequest',
  validateAcceptAccidentalLeave,
  verifyToken,
  verifyHOD,
  accidentalAcceptRequest
)
accidentalRejectRequest
router.post(
  '/accidentalRejectRequest',
  validateAcceptAccidentalLeave,
  verifyToken,
  verifyHOD,
  accidentalRejectRequest
)
router.post(
  '/accidentalCancelRequest',
  validateAcceptAccidentalLeave,
  verifyToken,
  verifyAcademic,
  accidentalCancelRequest
)

router.post(
  '/sendAnnualLeaveRequest',
  validateSendAnnualLeaveRequest,
  verifyToken,
  verifyAcademic,
  sendAnnualLeave
)

// router.post(
//   '/acceptcompensationLeaveRequest',
//   validat,
//   verifyToken,
//   verifyHOD,
//   acceptAnnualLeaveRequest
// )

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
  verifyAcademic,
  accidentalLeaveRequest
)
router.post(
  '/compensationLeaveRequest',
  validateCompensationLeavesRequest,
  verifyToken,
  verifyAcademic,
  compensationLeaveRequest
)

router.post(
  '/acceptCompensationLeaveRequest',
  validateAcceptCompensationLeavesRequest,
  verifyToken,
  verifyHOD,
  acceptCompensationLeaveRequest
)

router.post(
  '/rejectCompensationLeaveRequest',
  validateRejectCompensationLeavesRequest,
  verifyToken,
  verifyHOD,
  rejectCompensationLeaveRequest
)

router.post(
  '/viewChangeDayOffRequestsInDep',
  validateViewRequest,
  verifyToken,
  verifyHOD,
  viewChangeDayOffRequests
)

router.post(
  '/viewAnnualRequestsInDep',
  validateViewRequest,
  verifyToken,
  verifyHOD,
  viewAnnualRequests
)

router.post(
  '/viewAccidentalRequestsInDep',
  validateViewRequest,
  verifyToken,
  verifyHOD,
  viewAccidentalRequests
)

router.post(
  '/viewSickRequestsInDep',
  validateViewRequest,
  verifyToken,
  verifyHOD,
  viewSickRequests
)

router.post(
  '/viewMaternityRequestsInDep',
  validateViewRequest,
  verifyToken,
  verifyHOD,
  viewMaternityRequests
)

router.post(
  '/viewCompensationRequestsInDep',
  validateViewRequest,
  verifyToken,
  verifyHOD,
  viewCompensationRequests
)

router.post(
  '/viewChangeDayOffRequestsInDep',
  validateViewRequest,
  verifyToken,
  verifyHOD,
  viewChangeDayOffRequests
)

router.post(
  '/viewMyAnnualRequests',
  verifyToken,
  verifyAcademic,
  viewAnnualRequests
)

router.post(
  '/viewMyAccidentalRequests',
  validateViewRequest,
  verifyToken,
  verifyHOD,
  viewAccidentalRequests
)

router.post(
  '/viewMySickRequests',
  validateViewRequest,
  verifyToken,
  verifyHOD,
  viewSickRequests
)

router.post(
  '/viewMyMaternityRequests',
  validateViewRequest,
  verifyToken,
  verifyHOD,
  viewMaternityRequests
)

router.post(
  '/viewMyCompensationRequests',
  validateViewRequest,
  verifyToken,
  verifyHOD,
  viewCompensationRequests
)

module.exports = router
