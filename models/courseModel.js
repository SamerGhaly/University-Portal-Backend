const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: String,
  semester: Number,
  coordinator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
  },
});

module.exports = mongoose.model("Course", courseSchema);
