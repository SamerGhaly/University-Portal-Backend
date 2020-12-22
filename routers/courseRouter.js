const express = require('express')
const router = express.Router()

const {validateMemberPerCourse,validateCourseInstructorU,validateCourse,validateCourseU,validateCourseInstructor}=require("../validations/courseValidation")
const {viewMemberInCourse,updateCourseInstructor,deleteCourseInstructor,addCourse,updateCourse,deleteCourse,assignCourseInstructor}=require("../controllers/courseController")

const verifyToken = require('../authorizations/verifyToken')
const { verifyHR } = require('../authorizations/memberAuthorization')

// router.post('addCourse',verifyToken,verifyHR,validateCourse,addCourse)
router.post('/addCourse',validateCourse,addCourse)
router.put('/updateCourse',validateCourseU,updateCourse)
router.delete('/deleteCourse',validateCourseU,deleteCourse)
router.post('/assignCourseInstructor',validateCourseInstructor,verifyToken,assignCourseInstructor)
router.delete('/deleteCourseInstructor',validateCourseInstructor,verifyToken,deleteCourseInstructor)
router.put('/updateCourseInstructor',validateCourseInstructorU,verifyToken,updateCourseInstructor)
router.post('/viewMemberInCourse',verifyToken,validateMemberPerCourse,viewMemberInCourse)
module.exports=router