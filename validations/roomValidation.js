const Joi=require("joi")
const {catchError} =require("../constants/errorCodes")
const {roomTypes}=require("../constants/constants")
const validateRoom=(req,res,next) => {
    const roomSchema=Joi.object({
        name:Joi.string().required(),
        type:Joi.string().valid(roomTypes.HALL,roomTypes.LAB,roomTypes.TUTORIAL,roomTypes.OFFICE).required(),
        capacity:Joi.number().required()
    })
    const checkSchema=roomSchema.validate(req.body)
    if(checkSchema.error)
    return res.status(400).json({
        code: checkSchema,
        message: checkSchema.error.details[0],
      })
      next()

}

const validateRoomU=(req,res,next) => {
    const roomSchema=Joi.object({
        roomId:Joi.string().length(24).required(),
        name:Joi.string(),
        type:Joi.string().valid(roomTypes.HALL,roomTypes.LAB,roomTypes.TUTORIAL,roomTypes.OFFICE),
        capacity:Joi.number()
    })
    const checkSchema=roomSchema.validate(req.body)
    if(checkSchema.error)
    return res.status(400).json({
        code: checkSchema,
        message: checkSchema.error.details[0],
      })
      next()

}
module.exports={validateRoom,validateRoomU}