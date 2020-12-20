const Joi = require("joi");

const { validationError } = require("../constants/errorCodes");

const validateAddFaculty = (req, res, next) => {
  const addFacultySchema = Joi.object({
    name: Joi.string().required(),
  });
  const checkSchema = addFacultySchema.validate(req.body);

  if (checkSchema.error) {
    return res.json({
      code: validationError,
      message: checkSchema.error.details[0],
    });
  }
  next();
};

const validateUpdateFaculty = (req, res, next) => {
  const updateFacultySchema = Joi.object({
    name: Joi.string().required(),
    id: Joi.string().required(),
  });
  const checkSchema = updateFacultySchema.validate(req.body);
  if (checkSchema.error) {
    return res.json({
      code: validationError,
      message: checkSchema.error.details[0],
    });
  }
  next();
};

const validateDeleteFaculty = (req, res, next) => {
  const deleteFacultySchema = Joi.object({
    id: Joi.string().required(),
  });
  const checkSchema = deleteFacultySchema.validate(req.body);
  if (checkSchema.error) {
    return res.json({
      code: validationError,
      message: checkSchema.error.details[0],
    });
  }
  next();
};
module.exports = {
  validateAddFaculty,
  validateUpdateFaculty,
  validateDeleteFaculty,
};
