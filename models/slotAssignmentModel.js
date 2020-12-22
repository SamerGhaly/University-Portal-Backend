const mongoose = require("mongoose");

const slotAssignmentSchema = new mongoose.Schema({
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
  },
  slot: Number,
  day: String,
  type: String,
});

module.exports = mongoose.model('SlotAssignment', slotAssignmentSchema)
