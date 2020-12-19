const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: String,
  semester: Number,
  department: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
  ],
});

module.exports = mongoose.model("Course", courseSchema);
