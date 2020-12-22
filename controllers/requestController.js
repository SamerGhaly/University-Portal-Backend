const {
  catchError,
  slotAssignmentNotFound,
  slotAlreadyAssigned,
  memberNotAssignedToCourse,
  requestAlreadyMade,
} = require('../constants/errorCodes')

const SlotAssignmentModel = require('../models/slotAssignmentModel')
const SLotLinkingModel = require('../models/slotLinkingRequest')
const MemberModel = require('../models/memberModel')
const CourseAssignmentModel = require('../models/courseAssignment')
const slotLinkingRequest = require('../models/slotLinkingRequest')

const sendSlotLinking = async (req, res) => {
  try {
    const memberId = req.member.memberId //from token
    //check is slot is found
    const slotFound = await SlotAssignmentModel.findById(req.body.slotId)
    if (!slotFound) {
      return res.status(404).json({
        code: slotAssignmentNotFound,
        message: 'Slot Assignment Not Found',
      })
      }
      
    //Check SlotLinking request done before
    const requestFound = await slotLinkingRequest.find({
      slot: req.body.slot,
      member: memberId,
    })
    if (requestFound) {
      return res.status(400).json({
        code: requestAlreadyMade,
        message: 'Request Already Made',
      })
    }

    //check Slot Not Taken
    if (slotFound.member) {
      return res.status(400).json({
        code: slotAlreadyAssigned,
        message: 'This slot is already assigned',
      })
    }

    //check member is in course
    const checkMemberInCourse = await CourseAssignmentModel.findOne({
      member: memberId,
      course: slotFound.course,
    })
    if (!checkMemberInCourse) {
      return res.status(403).json({
        code: memberNotAssignedToCourse,
        message: 'Member is not assigned to course',
      })
    }

    await SLotLinkingModel.create({
      slot: slotFound._id,
      member: memberId,
    })
    return res.json({
      message: 'Slot Linking Request Sent Successfully!',
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
  sendSlotLinking,
}
