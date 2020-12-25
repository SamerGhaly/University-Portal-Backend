const Room = require('../models/roomModel')
const { catchError, roomDoesnotExist } = require('../constants/errorCodes')

const addRoom = async (req, res) => {
  try {
    const office = new Room({
      name: req.body.name,
      type: req.body.type,
      capacity: req.body.capacity,
    })
    await office.save()
    return res.json({ message: 'Room added' })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const updateRoom=async (req,res) => {
  try{
    const newRoom={};
    if(req.body.name)
    newRoom.name=req.body.name
    if(req.body.type)
    newRoom.type=req.body.type
   if(req.body.capacity) 
        newRoom.capacity=req.body.capacity   
    const room=await Room.findOneAndUpdate({_id:req.body.roomId},newRoom)
    if(!room) return res.status(404).json({
      message: 'room does not exist',
      code: roomDoesnotExist,
    })
    return res.json({message:"Room updated"})
  }catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findOneAndRemove({ _id: req.body.roomId })
    if (!room)
      return res.status(404).json({
        message: 'room does not exist',
        code: roomDoesnotExist,
      })
    return res.json({ message: 'Room deleted' })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}
module.exports = { addRoom, updateRoom, deleteRoom }
