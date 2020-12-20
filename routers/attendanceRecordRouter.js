const express = require('express')
const router = express.Router()
const verifyToken = require('../authorizations/verifyToken')
const {
  validateViewMyAttendanceRecords,
  validateViewMemberAttendanceRecords,
} = require('../validations/attendanceRecordValidation')

const {
  viewAttendanceRecords,
} = require('../controllers/attendanceRecordContoller')
const { verify, verifyHR } = require('../authorizations/memberAuthorization')

router.post(
  '/viewMyAttendance',
  verifyToken,
  validateViewMyAttendanceRecords,
  viewAttendanceRecords
)

router.post(
  '/viewMemberAttendance',
  verifyToken,
  verifyHR,
  validateViewMemberAttendanceRecords,
  viewAttendanceRecords
)

module.exports = router
