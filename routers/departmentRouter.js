const express = require('express')
const router = express.Router()

const { validateAddDepartment } = require('../validations/departmentValidation')
const {
  viewMember_dayoff_InDepartment,
  viewMemberInDepartment,
  addDepartment,
  viewAllMember_dayoff_InDepartment,
} = require('../controllers/departmentController')

const {
  validateUpdateDepartment,
  validateViewMemberDayoff,
} = require('../validations/departmentValidation')
const { updateDepartment } = require('../controllers/departmentController')

const {
  validateDeleteDepartment,
} = require('../validations/departmentValidation')
const { deleteDepartment } = require('../controllers/departmentController')
const verifyToken = require('../authorizations/verifyToken')
const {
  verifyHR,
  verifyHOD,
  verifyInstructor,
} = require('../authorizations/memberAuthorization')

router.post(
  '/addDepartment',
  validateAddDepartment,
  verifyToken,
  verifyHR,
  addDepartment
)
router.put(
  '/updateDepartment',
  validateUpdateDepartment,
  verifyToken,
  verifyHR,
  updateDepartment
)
router.delete(
  '/deleteDepartment',
  validateDeleteDepartment,
  verifyToken,
  verifyHR,
  deleteDepartment
)
router.get(
  '/viewMemberInDepartment',
  verifyToken,
  verifyHOD,
  viewMemberInDepartment
)

router.get(
  '/viewMemberInInstructorDepartment',
  verifyToken,
  verifyInstructor,
  viewMemberInDepartment
)

router.get(
  '/viewAllMember_dayoff_InDepartment',
  verifyToken,
  verifyHOD,
  viewAllMember_dayoff_InDepartment
)
router.post(
  '/viewMember_dayoff_InDepartment',
  validateViewMemberDayoff,
  verifyToken,
  verifyHOD,
  viewMember_dayoff_InDepartment
)

module.exports = router
