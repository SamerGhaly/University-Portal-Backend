const express = require("express");
const router = express.Router();

const {
  validateAddDepartment,
} = require("../validations/departmentValidation");
const { addDepartment } = require("../controllers/departmentController");

const {
  validateUpdateDepartment,
} = require("../validations/departmentValidation");
const { updateDepartment } = require("../controllers/departmentController");

const {
  validateDeleteDepartment,
} = require("../validations/departmentValidation");
const { deleteDepartment } = require("../controllers/departmentController");

router.post("/addDepartment", validateAddDepartment, addDepartment);
router.put("/updateDepartment", validateUpdateDepartment, updateDepartment);
router.delete("/deleteDepartment", validateDeleteDepartment, deleteDepartment);
module.exports = router;
