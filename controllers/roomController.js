const Room =require("../models/roomModel")
const {catchError} =require("../constants/errorCodes")
const addRoom=async (req,res)=>{
    try{ 
    const office=new Room({
      name:req.body.name,
      type:req.body.type,
      capacity:req.body.capacity,

    })
   await office.save();
}catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }

}
module.exports={addRoom}