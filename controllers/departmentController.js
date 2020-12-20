const { IdnotFound } = require("../constants/errorCodes");
const Department = require("../models/departmentModel");
const Faculty = require("../models/facultyModel");

const addDepartment = (req, res) => {
  if (
    Faculty.findOne({ _id: req.body.faculty }, function (err, foundFaculty) {
      console.log(err);
      console.log(foundFaculty);
      if (!foundFaculty) {
        return res.json({
          code: IdnotFound,
          message: "IdNotFound",
        });
      } else {
        Department.create(req.body);
        return res.json({
          message: "Department added successfully",
        });
      }
    })
  );
};

const updateDepartment = (req, res) => {
  if (req.body.faculty) {
    if (
      Faculty.findOne({ _id: req.body.faculty }, function (err, foundFaculty) {
        console.log(err);
        console.log(foundFaculty);
        if (!foundFaculty) {
          return res.json({
            code: IdnotFound,
            message: "facultyNotFound",
          });
        } else {
          Department.findByIdAndUpdate(
            req.body.id,
            { faculty: req.body.facuty },
            function (err) {
              if (err) {
                return res.json({
                  code: IdnotFound,
                  message: "IdNotFound",
                });
              } else {
                return res.json({
                  message: "Department updated successfully",
                });
              }
            }
          );
        }
      })
    );
  }
  if (req.body.name) {
    Department.findByIdAndUpdate(
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
            message: "Department updated successfully",
          });
        }
      }
    );
  }
};

const deleteDepartment = async (req, res) => {
  await Department.findByIdAndDelete(req.body.id, function (err) {
    if (err) {
      return res.json({
        code: IdnotFound,
        message: "IdNotFound",
      });
    } else {
      return res.json({
        message: "Department deleted successfully",
      });
    }
  });
};

module.exports = { addDepartment, updateDepartment, deleteDepartment };
