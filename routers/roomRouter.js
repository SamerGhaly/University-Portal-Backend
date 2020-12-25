const express = require('express')
const router = express.Router()
const {
  validateRoom,
  validateRoomU,
  validateRoomD,
} = require('../validations/roomValidation')
const {
  addRoom,
  updateRoom,
  deleteRoom,
} = require('../controllers/roomController')

const verifyToken = require('../authorizations/verifyToken')
const { verifyHR } = require('../authorizations/memberAuthorization')

<<<<<<< HEAD
router.post('/addRoom', validateRoom, verifyToken, verifyHR, addRoom)
router.put('/updateRoom', validateRoomU, verifyToken, verifyHR, updateRoom)
router.delete('/deleteRoom', validateRoomD, verifyToken, verifyHR, deleteRoom)
=======
router.post('/addRoom',verifyHR,validateRoom,addRoom)
router.put('/updateRoom',validateRoomU,updateRoom)
router.delete('/deleteRoom',validateRoomU,deleteRoom)
>>>>>>> 3f9dc90dba30d2d5af04e3fa178b6eac3cb05c38

module.exports = router
