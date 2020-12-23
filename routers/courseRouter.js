const express = require('express')
const router = express.Router()

const {validateMemberPerAllCoursesorSpecific,validateMemberPerCourse,validateCourseInstructorU,validateCourse,validateCourseU,validateCourseInstructor}=require("../validations/courseValidation")
const {viewInstructorSlotsInCourse,viewCourseCoverageInstructor,viewCourseCoverageHOD,viewOneCourseCoverageHOD,viewMemberSlotsInCourse,viewMemberInCourse,updateCourseInstructor,deleteCourseInstructor,addCourse,updateCourse,deleteCourse,assignCourseInstructor}=require("../controllers/courseController")

const verifyToken = require('../authorizations/verifyToken')
const { verifyHR, verifyInstructor ,verifyHOD} = require('../authorizations/memberAuthorization')

// router.post('addCourse',verifyToken,verifyHR,validateCourse,addCourse)
router.post('/addCourse',validateCourse,addCourse)
router.put('/updateCourse',validateCourseU,updateCourse)
router.delete('/deleteCourse',validateCourseU,deleteCourse)
router.post('/assignCourseInstructor',validateCourseInstructor,verifyToken,assignCourseInstructor)
router.delete('/deleteCourseInstructor',validateCourseInstructor,verifyToken,deleteCourseInstructor)
router.put('/updateCourseInstructor',validateCourseInstructorU,verifyToken,updateCourseInstructor)
router.post('/viewMemberInCourseHOD',verifyHOD,verifyToken,validateMemberPerCourse,viewMemberInCourse)
router.post('/viewMemberSlotsInCourse',verifyToken,validateMemberPerCourse,viewMemberSlotsInCourse)
router.post('/viewOneCourseCoverageHOD',verifyToken,validateMemberPerCourse,viewOneCourseCoverageHOD)
router.get('/viewCourseCoverageHOD',verifyToken,viewCourseCoverageHOD)
router.get('/viewCourseCoverageInstructor',verifyToken,viewCourseCoverageInstructor)
router.post('/viewInstructorSlotsInCourse',verifyToken,validateMemberPerAllCoursesorSpecific,viewInstructorSlotsInCourse)
router.post('/viewMemberInCourseInstructor',verifyToken,verifyInstructor,validateMemberPerCourse,viewMemberInCourse)

module.exports=router