const { IdnotFound } = require("../constants/errorCodes");
const Schedule = require("../models/scheduleModel");
const weekDays = require("../constants/constants");

const addCourseSlot = async (req, res) => {
  Schedule.findById({ _id: req.body.course } , function (err , foundCourse));
};
