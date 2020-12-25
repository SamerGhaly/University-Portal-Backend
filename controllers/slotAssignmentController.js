const {
  catchError,
  courseDoesNotExist,
  roomDoesnotExist,
  userNotFound,
  coordinatorCannotAssign,
  roomIsOffice,
  courseCoverageAchieved,
  slotAlreadyTaken,
  slotAssignmentNotFound,
  slotAlreadyAssigned,
  memberNotAssignedToCourse,
  instructorNotInCourse,
  slotNotAssigned,
} = require('../constants/errorCodes')
const CourseModel = require('../models/courseModel')
const MemberModel = require('../models/memberModel')
const RoomModel = require('../models/roomModel')
const CourseAssignmentModel = require('../models/courseAssignment')
const { memberRoles, roomTypes } = require('../constants/constants')
const SlotAssignmentModel = require('../models/slotAssignmentModel')

const assignSlot = (req, res) => {
  try {
    //check member on course
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const addSlot = async (req, res) => {
  try {
    const checkCourse = await CourseModel.findById(req.body.course)
    if (!checkCourse) {
      return res.json({
        code: courseDoesNotExist,
        message: 'Course Does not exist',
      })
    }
    const checkRoom = await RoomModel.findById(req.body.room)
    if (!checkRoom) {
      return res.json({
        code: roomDoesnotExist,
        message: 'Room Does not exist',
      })
    }
    //check room is not office
    if (checkRoom.type === roomTypes.OFFICE) {
      return res.json({
        code: roomIsOffice,
        message: 'Office cannot have lectures,labs or tutorials',
      })
    }
    //Coordinator on course
    const userId = req.member.memberId
    const checkCoordinatorAssign = await CourseAssignmentModel.findOne({
      member: userId,
      course: req.body.course,
      role: memberRoles.COORDINATOR,
    })
    if (!checkCoordinatorAssign) {
      return res.json({
        code: coordinatorCannotAssign,
        message: 'Member is not coordinator on this course',
      })
    }
    //check coverage
    const countSlots = await SlotAssignmentModel.countDocuments({
      course: req.body.course,
    })
    if (countSlots === checkCourse.slotsPerWeek) {
      return res.json({
        code: courseCoverageAchieved,
        message: 'Course Coverage Reached',
      })
    }
    //slot not taken
    const checkTaken = await SlotAssignmentModel.findOne({
      course: req.body.course,
      slot: req.body.slot,
      day: req.body.day,
      room: req.body.room,
    })
    if (checkTaken) {
      return res.json({
        code: slotAlreadyTaken,
        message: 'Slot is already taken',
      })
    }
    await SlotAssignmentModel.create({
      course: req.body.course,
      slot: req.body.slot,
      day: req.body.day,
      room: req.body.room,
    })
    return res.json({
      message: 'Slot Added Successfully to Course',
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const updateSlot = async (req, res) => {
  try {
    const assign = await SlotAssignmentModel.findById(req.body.assignmentId)
    if (!assign) {
      return res.json({
        code: slotAssignmentNotFound,
        message: 'Slot Assignment Not Fonud',
      })
    }
    if (req.body.course) {
      const checkCourse = await CourseModel.findById(req.body.course)
      if (!checkCourse) {
        return res.json({
          code: courseDoesNotExist,
          message: 'Course Does not exist',
        })
      }
      //check coverage
      const countSlots = await SlotAssignmentModel.countDocuments({
        course: req.body.course,
      })
      if (countSlots === checkCourse.slotsPerWeek) {
        return res.json({
          code: courseCoverageAchieved,
          message: 'Course Coverage Reached',
        })
      }
      //Coordinator on course
      const userId = req.member.memberId
      const checkCoordinatorAssign = await CourseAssignmentModel.findOne({
        member: userId,
        course: req.body.course,
        role: memberRoles.COORDINATOR,
      })
      if (!checkCoordinatorAssign) {
        return res.json({
          code: coordinatorCannotAssign,
          message: 'Member is not coordinator on this course',
        })
      }
      assign.course = req.body.course
    }
    if (req.body.room) {
      const checkRoom = await RoomModel.findById(req.body.room)
      if (!checkRoom) {
        return res.json({
          code: roomDoesnotExist,
          message: 'Room Does not exist',
        })
      }
      //check room is not office
      if (checkRoom.type === roomTypes.OFFICE) {
        return res.json({
          code: roomIsOffice,
          message: 'Office cannot have lectures,labs or tutorials',
        })
      }
      assign.room = req.body.room
    }
    if (req.body.slot) assign.slot = req.body.slot
    if (req.body.day) assign.day = req.body.day

    //slot not taken
    const checkTaken = await SlotAssignmentModel.findOne({
      course: assign.course,
      slot: assign.slot,
      day: assign.day,
      room: assign.room,
    })
    if (checkTaken) {
      return res.json({
        code: slotAlreadyTaken,
        message: 'Slot is already taken',
      })
    }
    await SlotAssignmentModel.findByIdAndUpdate(assign._id, assign)
    return res.json({
      message: 'Slot Updated Successfully',
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const deleteSlot = async (req, res) => {
  try {
    const assign = await SlotAssignmentModel.findById(req.body.assignmentId)
    if (!assign) {
      return res.json({
        code: slotAssignmentNotFound,
        message: 'Slot Assignment Not Fonud',
      })
    }
    await SlotAssignmentModel.findByIdAndDelete(assign._id)

    return res.json({
      message: 'Assignment Deleted successfully',
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const assignMemberToSlot = async (req, res) => {
  try {
    const checkAssignedSlot = await SlotAssignmentModel.findById(
      req.body.assignmentId
    )
    if (!checkAssignedSlot) {
      return res.json({
        code: slotAssignmentNotFound,
        message: 'Slot Assignment Not Fonud',
      })
    }
    const checkMember = await MemberModel.findById(req.body.memberId)
    if (!checkMember) {
      return res.json({
        code: userNotFound,
        message: 'User Not Found',
      })
    }
    if (checkAssignedSlot.member) {
      return res.json({
        code: slotAlreadyAssigned,
        message: 'Slot ALready Assigned',
      })
    }
    const instructorId = req.member.memberId
    const checkInstructorOnCourse = await CourseAssignmentModel.findOne({
      member: instructorId,
      course: checkAssignedSlot.course,
    })
    if (!checkInstructorOnCourse) {
      return res.status(403).json({
        code: instructorNotInCourse,
        message: 'Instructor Not On Course',
      })
    }
    const checkSameCourse = await CourseAssignmentModel.findOne({
      member: req.body.memberId,
      course: checkAssignedSlot.course,
    })
    console.log(checkSameCourse)
    if (!checkSameCourse) {
      return res.status(400).json({
        code: memberNotAssignedToCourse,
        message: 'Memer Not Assigned To Course',
      })
    }
    checkAssignedSlot.member = req.body.memberId
    await SlotAssignmentModel.findByIdAndUpdate(
      checkAssignedSlot._id,
      checkAssignedSlot
    )
    return res.json({
      message: 'Member Assigned Successfully',
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const updateMemberSlotAssignment = async (req, res) => {
  try {
    const slotAssignmentFound = await SlotAssignmentModel.findById(
      req.body.assignmentId
    )
    if (!slotAssignmentFound) {
      return res.status(404).json({
        code: slotAssignmentNotFound,
        message: 'Slot Assignment Does Not Exist',
      })
    }
    const instructorId = req.member.memberId //from token
    //check instructor on course
    const checkInstructorOnCourse = await CourseAssignmentModel.findOne({
      member: instructorId,
      course: slotAssignmentFound.course,
    })
    if (!checkInstructorOnCourse) {
      return res.status(403).json({
        code: instructorNotInCourse,
        message: 'Instructor Not In Course',
      })
    }

    //check new member on course
    const newMemberOnCourse = await CourseAssignmentModel.findOne({
      member: req.body.newMemberId,
      course: slotAssignmentFound.course,
    })
    if (!newMemberOnCourse) {
      return res.status(400).json({
        code: memberNotAssignedToCourse,
        message: 'member not assigned to course',
      })
    }
    slotAssignmentFound.member = req.body.newMemberId
    await SlotAssignmentModel.findByIdAndUpdate(
      slotAssignmentFound._id,
      slotAssignmentFound
    )
    return res.json({
      message: 'Slot Assignment Updated Successfully',
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const deleteMemberSlotAssignment = async (req, res) => {
  try {
    const slotAssignFound = await SlotAssignmentModel.findById(
      req.body.assignmentId
    )
    if (!slotAssignFound) {
      return res.status(404).json({
        code: slotAssignmentNotFound,
        message: 'Slot Asssignment Not Found',
      })
    }

    if (!slotAssignFound.member) {
      return res.status(404).json({
        code: slotNotAssigned,
        message: 'Slot Not Assigned TO Member',
      })
    }

    const instructorId = req.member.memberId
    //check instructor on course
    const checkInstructorOnCourse = await CourseAssignmentModel.findOne({
      member: instructorId,
      course: slotAssignFound.course,
    })
    if (!checkInstructorOnCourse) {
      return res.status(403).json({
        code: instructorNotInCourse,
        message: 'Instructor not on course',
      })
    }
    const newSlot = slotAssignFound
    newSlot.member = undefined
    await SlotAssignmentModel.findByIdAndUpdate(slotAssignFound._id, {
      $unset: { member: '' },
    })
    return res.json({
      message: 'Member removed from slot',
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

module.exports = {
  assignSlot,
  addSlot,
  updateSlot,
  deleteSlot,
  assignMemberToSlot,
  updateMemberSlotAssignment,
  deleteMemberSlotAssignment,
}
