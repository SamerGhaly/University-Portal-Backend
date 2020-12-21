const Joi = require("joi");
const { validationError } = require("../constants/errorCodes");

const validateAddCourseSlot = (req, res, next) => {
  const addCourseSlotSchema = Joi.object({
    course: Joi.string().required(),
    room: Joi.string().required(),
    slot: Joi.number().integer().min(1).max(5).required(),
    day: Joi.string().required(),
    type: Joi.string().required(),
  });
  const checkSchema = addCourseSlotSchema.validate(req.body);
  if (checkSchema.error) {
    return res.json({
      code: validationError,
      message: checkSchema.error.details[0],
    });
  }
  next();
};
module.exports = {
  validateAddCourseSlot,
};
