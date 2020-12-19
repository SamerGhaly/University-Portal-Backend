const Joi=require("joi")
const validateCourse=(req,res,next)=>{
    const courseSchema=Joi.object({
        name:Joi.string().required(),
        slotsPerWeek:Joi.number().required(),
        departmentId:Joi.string().length(24).required(),
    })
    const checkSchema=courseSchema.validate(req.body)
    if(checkSchema.error) return res.status(400).json({
        code: checkSchema,
        message: checkSchema.error.details[0],
      })
      next()
}
module.exports={validateCourse}