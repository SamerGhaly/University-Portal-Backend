const express = require("express");
const router = express.Router();

const {
  validateAddDepartment,
} = require("../validations/departmentValidation");
const {viewMember_dayoff_InDepartment, viewMemberInDepartment,
addDepartment,viewAllMember_dayoff_InDepartment } = require("../controllers/departmentController");

const {
  validateUpdateDepartment,
} = require("../validations/departmentValidation");
const { updateDepartment } = require("../controllers/departmentController");

const {
  validateDeleteDepartment,
} = require("../validations/departmentValidation");
const { deleteDepartment } = require("../controllers/departmentController");
const verifyToken = require('../authorizations/verifyToken')
 
router.post("/addDepartment", validateAddDepartment, addDepartment);
router.put("/updateDepartment", validateUpdateDepartment, updateDepartment);
router.delete("/deleteDepartment", validateDeleteDepartment, deleteDepartment);
router.get('/viewMemberInDepartment',verifyToken,viewMemberInDepartment)
router.get('/viewAllMember_dayoff_InDepartment',verifyToken,viewAllMember_dayoff_InDepartment)
router.post('/viewMember_dayoff_InDepartment',verifyToken,viewMember_dayoff_InDepartment)

module.exports = router;
