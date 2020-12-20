const express = require('express')
const router = express.Router()

const {validateCourse,validateCourseU,validateCourseInstructor}=require("../validations/courseValidation")
const {addCourse,updateCourse,deleteCourse,assignCourseInstructor}=require("../controllers/courseController")

const verifyToken = require('../authorizations/verifyToken')
const { verifyHR } = require('../authorizations/memberAuthorization')

// router.post('addCourse',verifyToken,verifyHR,validateCourse,addCourse)
router.post('/addCourse',validateCourse,addCourse)
router.put('/updateCourse',validateCourseU,updateCourse)
router.delete('/deleteCourse',validateCourseU,deleteCourse)
router.post('/assignCourseInstructor',validateCourseInstructor,assignCourseInstructor)
module.exports=router