const { IdnotFound } = require("../constants/errorCodes");
const Faculty = require("../models/facultyModel");

const addFaculty = async (req, res) => {
  await Faculty.create(req.body);
  return res.json({
    message: "faculty added successfully",
  });
};
const updateFaculty = async (req, res) => {
  await Faculty.findByIdAndUpdate(
    req.body.id,
    { name: req.body.name },
    function (err) {
      if (err) {
        return res.json({
          code: IdnotFound,
          message: "IdNotFound",
        });
      } else {
        return res.json({
          message: "faculty updated successfully",
        });
      }
    }
  );
};
const deleteFaculty = async (req, res) => {
  await Faculty.findByIdAndDelete(req.body.id, function (err) {
    if (err) {
      return res.json({
        code: IdnotFound,
        message: "IdNotFound",
      });
    } else {
      return res.json({
        message: "faculty deleted successfully",
      });
    }
  });
};
module.exports = { addFaculty, updateFaculty, deleteFaculty };
