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
} = require('../validations/memberValidation')
const {
  addMember,
  login,
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
} = require('../controllers/memberController')

const verifyToken = require('../authorizations/verifyToken')
const {
  verifyHR,
  verifyInstructor,
} = require('../authorizations/memberAuthorization')

router.post('/login', validateLogin, login)
router.post('/signIn', validateSignInOut, signIn)
router.post('/signOut', validateSignInOut, signOut)
router.post(
  '/addMissingSign',
  validateMissingSign,
  verifyToken,
  verifyHR,
  addMissingSign
)
router.post('/addMember', validateAddMember, addMember)
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
router.put('/updateMember', validateUpdateMember, verifyToken, updateMember)
router.post('/viewMember', validateViewMember, verifyToken, viewMember)
router.post('/resetPassword', validateResetPassword, resetPassword)

module.exports = router
