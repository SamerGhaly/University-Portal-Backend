const express = require('express')
const router = express.Router()

const {
  validateMemberPerAllCoursesorSpecific,
  validateMemberPerCourse,
  validateCourseInstructorU,
  validateCourse,
  validateCourseU,
  validateCourseInstructor,
  validateCourseInstructorD,
} = require('../validations/courseValidation')
const {
  viewInstructorSlotsInCourse,
  viewCourseCoverageInstructor,
  viewCourseCoverageHOD,
  viewOneCourseCoverageHOD,
  viewMemberSlotsInCourse,
  viewMemberInCourse,
  updateCourseInstructor,
  deleteCourseInstructor,
  addCourse,
  updateCourse,
  deleteCourse,
  assignCourseInstructor,
} = require('../controllers/courseController')

const verifyToken = require('../authorizations/verifyToken')
const {
  verifyHR,
  verifyInstructor,
  verifyHOD,
} = require('../authorizations/memberAuthorization')

// router.post('addCourse',verifyToken,verifyHR,validateCourse,addCourse)
router.post('/addCourse', validateCourse, verifyToken, verifyHR, addCourse)
router.put(
  '/updateCourse',
  validateCourseU,
  verifyToken,
  verifyHR,
  updateCourse
)
router.delete(
  '/deleteCourse',
  validateCourseU,
  verifyToken,
  verifyHR,
  deleteCourse
)

router.post(
  '/assignCourseInstructor',
  validateCourseInstructor,
  verifyToken,
  verifyHOD,
  assignCourseInstructor
)

router.delete(
  '/deleteCourseInstructor',
  validateCourseInstructorD,
  verifyToken,
  verifyHOD,
  deleteCourseInstructor
)

router.put(
  '/updateCourseInstructor',
  validateCourseInstructorU,
  verifyToken,
  verifyHOD,
  updateCourseInstructor
)

router.post(
  '/viewMemberInCourseHOD',
  validateMemberPerCourse,
  verifyToken,
  verifyHOD,
  viewMemberInCourse
)
router.post(
  '/viewMemberSlotsInCourse',
  validateMemberPerCourse,
  verifyToken,
  verifyHOD,
  viewMemberSlotsInCourse
)
router.post(
  '/viewOneCourseCoverageHOD',
  validateMemberPerCourse,
  verifyToken,
  verifyHOD,
  viewOneCourseCoverageHOD
)
router.get(
  '/viewCourseCoverageHOD',
  verifyToken,
  verifyHOD,
  viewCourseCoverageHOD
)
router.get(
  '/viewCourseCoverageInstructor',
  verifyToken,
  verifyInstructor,
  viewCourseCoverageInstructor
)
router.post(
  '/viewInstructorSlotsInCourse',
  verifyToken,
  verifyInstructor,
  validateMemberPerAllCoursesorSpecific,
  viewInstructorSlotsInCourse
)
router.post(
  '/viewMemberInCourseInstructor',
  verifyToken,
  verifyInstructor,
  validateMemberPerCourse,
  viewMemberInCourse
)

module.exports = router
