const express = require('express')
const router = express.Router()

const {
  validateAddMember,
  validateUpdateMember,
  validateLogin,
  validateViewMember,
  validateResetPassword,
  validateSignInOut,
  validateMissingSign,
  validateDeleteMember,
  validateAssignTaToCourse,
  validateAssignCoordinator,
  validateUpdateAssignTaToCourse,
  validateRemoveTaFromCourse,
  validateUpdateMyProfile,
  validateUpdateSalary,
} = require('../validations/memberValidation')
const {
  addMember,
  login,
  logout,
  resetPassword,
  updateMember,
  viewMember,
  signIn,
  signOut,
  addMissingSign,
  deleteMember,
  assignTaToCourse,
  assignCoorinatorToCourse,
  updateTaAssignment,
  removeTaAssignment,
  viewMissingDaysHours,
} = require('../controllers/memberController')

const verifyToken = require('../authorizations/verifyToken')
const {
  verifyHR,
  verifyInstructor,
  verifyAcademic,
} = require('../authorizations/memberAuthorization')

router.post('/login', validateLogin, login)
router.get('/logout', verifyToken, logout)
router.post('/addMember', validateAddMember, verifyToken, verifyHR, addMember)
router.get('/signIn', verifyToken, signIn)
router.get('/signOut', verifyToken, signOut)
router.post(

  '/addMissingSign',
  validateMissingSign,
  verifyToken,
  verifyHR,
  addMissingSign
)
router.delete(
  '/deleteMember',
  validateDeleteMember,
  verifyToken,
  verifyHR,
  deleteMember
)
router.post(
  '/assignTaToCourse',
  validateAssignTaToCourse,
  verifyToken,
  verifyInstructor,
  assignTaToCourse
)
router.post(
  '/assignCoordinatorToCourse',
  validateAssignCoordinator,
  verifyToken,
  verifyInstructor,
  assignCoorinatorToCourse
)
router.put(
  '/updateTaAssignment',
  validateUpdateAssignTaToCourse,
  verifyToken,
  verifyInstructor,
  updateTaAssignment
)
router.delete(
  '/removeTaAssignment',
  validateRemoveTaFromCourse,
  verifyToken,
  verifyInstructor,
  removeTaAssignment
)
router.put(
  '/updateMember',
  validateUpdateMember,
  verifyToken,
  verifyHR,
  updateMember
)
router.put(
  '/updateMyProfile',
  validateUpdateMyProfile,
  verifyToken,
  verifyAcademic,
  updateMember
)
router.put(
  '/updateSalary',
  validateUpdateSalary,
  verifyToken,
  verifyHR,
  updateMember
)
router.get('/viewMember', verifyToken, viewMember)
router.post('/resetPassword', validateResetPassword, resetPassword)
router.get('/viewMissingDaysHours', verifyToken, viewMissingDaysHours)
module.exports = router
