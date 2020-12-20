const express = require("express");
const router = express.Router();

const { validateAddFaculty } = require("../validations/facultyValidation");
const { addFaculty } = require("../controllers/facultyController");
const { validateUpdateFaculty } = require("../validations/facultyValidation");
const { updateFaculty } = require("../controllers/facultyController");
const { validateDeleteFaculty } = require("../validations/facultyValidation");
const { deleteFaculty } = require("../controllers/facultyController");

router.post("/addFaculty", validateAddFaculty, addFaculty);
router.put("/updateFaculty", validateUpdateFaculty, updateFaculty);
router.delete("/deleteFaculty", validateDeleteFaculty, deleteFaculty);

module.exports = router;
