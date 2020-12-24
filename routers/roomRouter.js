const express = require('express')
const router = express.Router()
const {validateRoom,validateRoomU}=require("../validations/roomValidation")
const {addRoom,updateRoom,deleteRoom}=require("../controllers/roomController")

const verifyToken = require('../authorizations/verifyToken')
const { verifyHR } = require('../authorizations/memberAuthorization')

router.post('/addRoom',verifyHR,validateRoom,addRoom)
router.put('/updateRoom',validateRoomU,updateRoom)
router.delete('/deleteRoom',validateRoomU,deleteRoom)

//router.post('/addRoom',verifyToken,verifyHR,validateRoom,addRoom)

module.exports=router