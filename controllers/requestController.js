const {
  catchError,
  slotAssignmentNotFound,
  slotAlreadyAssigned,
  memberNotAssignedToCourse,
  requestAlreadyMade,
  databaseerror,
  requestDoesNotExist,
  requestNotPending,
  notCoordinatorOnCourse,
  cannotCancel,
  slotNotAssignedToMember,
  dateInThePast,
  slotIsNotOnReplacementDay,
  cannotSendReplacementOnFriday,
  memberNotFree,
  courseDoesNotExist,
  zeroAnnualLeaves,
  zeroAccidentalLeaves,
  mustBeBeforeTargetDay,
  FromDayAfterToDay,
  userNotFound,
  noAvailableDays,
  notYourRequest,
  noReplacementFound,
  requestNotAccepted,
  differentDepartments,
} = require('../constants/errorCodes')

const {
  requestType,
  memberRoles,
  weekDaysNumbers,
  weekDays,
} = require('../constants/constants')
const Request = require('../models/changeDayOffRequest')
const sickRequest = require('../models/sickLeaveRequest')
const maternityRequest = require('../models/maternityLeaveRequest')
const Member = require('../models/memberModel')
const Replacment = require('../models/replacementRequest')
const SlotAssignmentModel = require('../models/slotAssignmentModel')
const SlotLinkingModel = require('../models/slotLinkingRequest')
const MemberModel = require('../models/memberModel')
const CourseAssignmentModel = require('../models/courseAssignment')
const slotAssignmentModel = require('../models/slotAssignmentModel')
const courseModel = require('../models/courseModel')
const AccidentalLeaveRequest = require('../models/accidentalLeaveRequest')
const annualLeaveRequest = require('../models/annualLeaveRequest')
const replacementRequest = require('../models/replacementRequest')
const CompensationModel = require('../models/compensationLeaveRequest')
const { calcMemberanualLeavesLeft } = require('../helpers/calculateTime')
const sendSlotLinking = async (req, res) => {
  try {
    const tokenId = req.member.memberId //from token
    //check is slot is found
    const slotFound = await SlotAssignmentModel.findById(req.body.slotId)
    if (!slotFound) {
      return res.status(404).json({
        code: slotAssignmentNotFound,
        message: 'Slot Assignment Not Found',
      })
    }

    //Check SlotLinking request done before
    const requestFound = await SlotLinkingModel.findOne({
      slot: req.body.slotId,
      member: tokenId,
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
      member: tokenId,
      course: slotFound.course,
    })
    if (!checkMemberInCourse) {
      return res.status(403).json({
        code: memberNotAssignedToCourse,
        message: 'Member is not assigned to course',
      })
    }

    await SlotLinkingModel.create({
      slot: slotFound._id,
      member: tokenId,
      status: requestType.PENDING,
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

const acceptSlotLinkingRequest = async (req, res) => {
  try {
    const requestFound = await SlotLinkingModel.findById(
      req.body.requestId
    ).populate('slot')
    if (!requestFound) {
      return res.status(404).json({
        code: requestDoesNotExist,
        message: 'Request Does Not Exist',
      })
    }
    if (requestFound.status !== requestType.PENDING) {
      return res.status(400).json({
        code: requestNotPending,
        message: 'This request is not pending',
      })
    }
    if (requestFound.slot.member) {
      return res.status(400).json({
        code: slotAlreadyAssigned,
        message: 'Slot Already Assigned',
      })
    }
    const tokenId = req.member.memberId
    const courseAssignment = await CourseAssignmentModel.findOne({
      member: tokenId,
      course: requestFound.slot.course,
      role: memberRoles.COORDINATOR,
    })
    if (!courseAssignment) {
      return res.status(403).json({
        code: notCoordinatorOnCourse,
        message: 'Not a Coordinator on this course',
      })
    }

    // Add to slotAssignment
    const newSlot = requestFound.slot
    newSlot.member = requestFound.member
    console.log(newSlot)
    await SlotAssignmentModel.findByIdAndUpdate(requestFound.slot._id, {
      $set: { member: requestFound.member },
    })
    requestFound.status = requestType.ACCEPT
    await SlotLinkingModel.findByIdAndUpdate(req.body.requestId, requestFound)
    return res.json({
      message: 'Request was accepted successfully',
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const rejectSlotLinkingRequest = async (req, res) => {
  try {
    const requestFound = await SlotLinkingModel.findById(
      req.body.requestId
    ).populate('slot')
    if (!requestFound) {
      return res.status(404).json({
        code: requestDoesNotExist,
        message: 'Request Does Not Exist',
      })
    }
    if (requestFound.status !== requestType.PENDING) {
      return res.status(400).json({
        code: requestNotPending,
        message: 'Request is not pending',
      })
    }
    //Check member who rejects is the course coordinator
    const tokenId = req.member.memberId
    console.log(tokenId, requestFound.slot)
    const courseAssignment = await CourseAssignmentModel.findOne({
      member: tokenId,
      course: requestFound.slot.course,
      role: memberRoles.COORDINATOR,
    })
    console.log(courseAssignment)

    if (!courseAssignment) {
      return res.status(403).json({
        code: notCoordinatorOnCourse,
        message: 'Not a Coordinator on this course',
      })
    }

    await SlotLinkingModel.findByIdAndUpdate(req.body.requestId, {
      $set: { status: requestType.REJECT },
    })
    return res.json({
      message: 'Request is rejected successfully',
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const cancelSlotLinkingRequest = async (req, res) => {
  try {
    const requestFound = await SlotLinkingModel.findById(req.body.requestId)
    if (!requestFound) {
      return res.status(404).json({
        code: requestDoesNotExist,
        message: 'Request Does Not Exist',
      })
    }
    const tokenId = req.member.memberId
    if (tokenId !== requestFound.member.toString()) {
      return res.status(403).json({
        code: cannotCancel,
        message: 'Not Authorized to cancel others requests',
      })
    }
    if (requestFound.status !== requestType.PENDING) {
      return res.status(400).json({
        code: requestNotPending,
        message: 'Request is not Pending',
      })
    }

    await SlotLinkingModel.findByIdAndUpdate(req.body.requestId, {
      $set: { status: requestType.CANCELLED },
    })
    return res.json({
      message: 'Slot Linking Request is cancelled successfully',
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const viewSlotLinkning = async (req, res) => {
  try {
    const coordinatorId = req.member.memberId // from token
    const courseId = req.body.courseId
    const checkCourse = await courseModel.findById(courseId)
    if (!checkCourse) {
      return res.status(404).json({
        code: courseDoesNotExist,
        message: 'Course Does Not Exist',
      })
    }
    const checkCoordinatorOnCourse = await CourseAssignmentModel.findOne({
      member: coordinatorId,
      course: courseId,
      role: memberRoles.COORDINATOR,
    })
    if (!checkCoordinatorOnCourse) {
      return res.status(403).json({
        code: notCoordinatorOnCourse,
        message: 'Not Coordinator on this course',
      })
    }

    const records = await SlotLinkingModel.find({})
      .populate({
        path: 'slot',
        match: {
          course: courseId,
        },
        select: 'slot day',
      })
      .populate({
        path: 'member',
        select: '_id name email type ',
      })
    const result = []
    records.forEach((record) => {
      record.slot && result.push(record)
    })
    return res.json({
      data: result,
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}
const Compensation = require('../models/compensationLeaveRequest')
const { findById } = require('../models/courseModel')

const changeDayOffRequest = (req, res) => {
  if (
    Member.findOne({ _id: req.member.memberId }, function (err, foundMember) {
      if (!foundMember) {
        return res.json({
          code: databaseerror,
          message: 'memberNotFound',
        })
      } else {
        const newrequest = req.body
        newrequest.member = req.member.memberId
        newrequest.status = requestType.PENDING
        Request.create(newrequest)
        return res.json({
          message: 'Change DayOff Request sent successfully',
        })
      }
    })
  );
}

const acceptDayOffRequest = async (req, res) => {
  console.log(req.member.memberId)
  try {
    console.log(req.body.requestId)
    const request = await Request.findById(req.body.requestId)
    if (!request) {
      return res.status(404).json({
        code: requestDoesNotExist,
        message: 'Request Does Not Exist',
      })
    }
    if (request.status !== requestType.PENDING) {
      return res.status(400).json({
        code: requestNotPending,
        message: 'Request is not pending',
      })
    }
    const user = await Member.findById(request.member)
    const hod = await Member.findById(req.member.memberId)

    if (hod.department.toString() === user.department.toString()) {
      if (request) {
        Member.findById(user, function (err) {
          if (err) {
            return res.json({
              code: databaseerror,
              message: 'databaseerror',
            })
          } else {
            Request.findByIdAndUpdate(
              req.body.requestId,
              { status: requestType.ACCEPT },
              function (err) {
                if (err) {
                  return res.json({
                    code: databaseerror,
                    message: 'databaseerror',
                  })
                }
              }
            )
            Member.findByIdAndUpdate(
              user,
              { dayoff: request.newDayOff },
              function (err) {
                if (err) {
                  return res.json({
                    code: databaseerror,
                    message: 'databaseerror',
                  })
                }
              }
            )
            return res.json({
              message: 'Request accepted anad DayOff updated successfully',
            })
          }
        })
      } else {
        return res.json({
          code: databaseerror,
          message: 'database error',
        })
      }
    } else {
      return res.json({
        message: 'Not Same Department',
      })
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const rejectDayOffRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.body.requestId)
    if (!request) {
      return res.status(404).json({
        code: requestDoesNotExist,
        message: 'Request Does Not Exist',
      })
    }
    if (request.status !== requestType.PENDING) {
      return res.status(400).json({
        code: requestNotPending,
        message: 'Request is not pending',
      })
    }
    const user = await Member.findById(request.member)
    const hod = await Member.findById(req.member.memberId)
    if (hod.department.toString() === user.department.toString()) {
      if (request) {
        Request.findByIdAndUpdate(
          req.body.requestId,
          { status: requestType.REJECT },
          function (err) {
            if (err) {
              return res.json({
                code: databaseerror,
                message: 'database error',
              })
            } else {
              return res.json({
                message: 'Request rejected',
              })
            }
          }
        )
      } else {
        return res.json({
          message: 'No Request Found',
        })
      }
    } else {
      return res.json({
        message: 'Not Same Department',
      })
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const sickLeaveRequest = async (req, res) => {
  const reqdatefrom = new Date(req.body.from)
  const reqdateto = new Date(req.body.to)
  const limitday = new Date(reqdateto.getTime() + 3 * 24 * 60 * 60 * 1000)

  try {
    if (reqdatefrom < reqdateto) {
      const dateSubmitted = new Date()
      if (dateSubmitted <= limitday) {
        console.log(dateSubmitted.getDate())
        const newrequest = req.body
        newrequest.member = req.member.memberId
        newrequest.status = requestType.PENDING
        sickRequest.create(newrequest)
        return res.json({
          message: 'Sick Leave Request sent successfully',
        })
      } else {
        return res.json({
          message: 'RequestDate must be after ToDate',
        })
      }
    } else {
      return res.json({
        message: 'FromDate must be less than ToDate',
      })
    }
  } catch (err) {
    console.log(err)
    return res.json({
      code: catchError,
      message: 'Catch error',
    })
  }
}

const maternityLeaveRequest = async (req, res) => {
  const reqdatefrom = new Date(req.body.from)
  const reqdateto = new Date(req.body.to)
  const member = await Member.findById(req.member.memberId)
  try {
    if (reqdatefrom < reqdateto) {
      // console.log(member.gender)
      if (member.gender === 'female') {
        const newrequest = req.body
        newrequest.member = req.member.memberId
        newrequest.status = requestType.PENDING
        await maternityRequest.create(newrequest)
        return res.json({
          message: 'Maternity Leave Request sent successfully',
        })
      } else {
        return res.json({
          message: 'Member Gender must be Female',
        })
      }
    } else {
      return res.json({
        message: 'FromDate must be less than ToDate',
      })
    }
  } catch (err) {
    console.log(err)
    return res.json({
      code: catchError,
      message: 'Catch error',
    })
  }
}

const acceptSickLeaveRequest = async (req, res) => {
  try {
    const request = await sickRequest.findById(req.body.requestId)
    if (!request) {
      return res.status(404).json({
        code: requestDoesNotExist,
        message: 'Request Does Not Exist',
      })
    }
    if (request.status !== requestType.PENDING) {
      return res.json({
        code: requestNotPending,
        message: 'Request Not Pending',
      })
    }
    const user = await Member.findById(request.member)
    const hod = await Member.findById(req.member.memberId)
    const exist = await sickRequest.findById(req.body.requestId)
    if (hod.department.toString() === user.department.toString()) {
      if (exist) {
        sickRequest.findByIdAndUpdate(
          req.body.requestId,
          { status: requestType.ACCEPT },
          function (err) {
            if (err) {
              return res.json({
                code: databaseerror,
                message: 'database error',
              })
            } else {
              return res.json({
                message: 'Request accepetd',
              })
            }
          }
        )
      } else {
        return res.json({
          message: 'No Request Found',
        })
      }
    } else {
      return res.json({
        message: 'Not Same Department',
      })
    }
  } catch (err) {
    console.log(err)
    return res.json({
      code: catchError,
      message: 'Catch error',
    })
  }
}

const rejectSickLeaveRequest = async (req, res) => {
  try {
    const request = await sickRequest.findById(req.body.requestId)
    if (!request) {
      return res.status(404).json({
        code: requestDoesNotExist,
        message: 'Request Does Not Exist',
      })
    }
    if (request.status !== requestType.PENDING) {
      return res.json({
        code: requestNotPending,
        message: 'Request Not Pending',
      })
    }
    const user = await Member.findById(request.member)
    const hod = await Member.findById(req.member.memberId)
    const exist = await sickRequest.findById(req.body.requestId)
    if (hod.department.toString() === user.department.toString()) {
      if (exist) {
        sickRequest.findByIdAndUpdate(
          req.body.requestId,
          { status: requestType.REJECT },
          function (err) {
            if (err) {
              return res.json({
                code: databaseerror,
                message: 'database error',
              })
            } else {
              return res.json({
                message: 'Request rejected',
              })
            }
          }
        )
      } else {
        return res.json({
          message: 'No Request Found',
        })
      }
    } else {
      return res.json({
        message: 'Not Same Department',
      })
    }
  } catch (err) {
    console.log(err)
    return res.json({
      code: catchError,
      message: 'Catch error',
    })
  }
}

const acceptMaternityLeaveRequest = async (req, res) => {
  try {
    const request = await maternityRequest.findById(req.body.requestId)
    if (!request) {
      return res.status(404).json({
        code: requestDoesNotExist,
        message: 'Request Does Not Exist',
      })
    }
    if (request.status !== requestType.PENDING) {
      return res.json({
        code: requestNotPending,
        message: 'Request Not Pending',
      })
    }
    const user = await Member.findById(request.member)
    const hod = await Member.findById(req.member.memberId)
    const exist = await maternityRequest.findById(req.body.requestId)
    if (hod.department.toString() === user.department.toString()) {
      if (exist) {
        maternityRequest.findByIdAndUpdate(
          req.body.requestId,
          { status: requestType.ACCEPT },
          function (err) {
            if (err) {
              return res.json({
                code: databaseerror,
                message: 'database error',
              })
            } else {
              return res.json({
                message: 'Request accepetd',
              })
            }
          }
        )
      } else {
        return res.json({
          message: 'No Request Found',
        })
      }
    } else {
      return res.json({
        message: 'Not Same Department',
      })
    }
  } catch (err) {
    console.log(err)
    return res.json({
      code: catchError,
      message: 'Catch error',
    })
  }
}

const rejectMaternityLeaveRequest = async (req, res) => {
  try {
    const request = await maternityRequest.findById(req.body.requestId)
    if (!request) {
      return res.status(404).json({
        code: requestDoesNotExist,
        message: 'Request Does Not Exist',
      })
    }
    if (request.status !== requestType.PENDING) {
      return res.json({
        code: requestNotPending,
        message: 'Request Not Pending',
      })
    }
    const user = await Member.findById(request.member)
    const hod = await Member.findById(req.member.memberId)
    const exist = await maternityRequest.findById(req.body.requestId)
    if (hod.department.toString() === user.department.toString()) {
      if (exist) {
        maternityRequest.findByIdAndUpdate(
          req.body.requestId,
          { status: requestType.REJECT },
          function (err) {
            if (err) {
              return res.json({
                code: databaseerror,
                message: 'database error',
              })
            } else {
              return res.json({
                message: 'Request rejected',
              })
            }
          }
        )
      } else {
        return res.json({
          message: 'No Request Found',
        })
      }
    } else {
      return res.json({
        message: 'Not Same Department',
      })
    }
  } catch (err) {
    console.log(err)
    return res.json({
      code: catchError,
      message: 'Catch error',
    })
  }
}

const cancelSickLeaveRequest = async (req, res) => {
  try {
    const send = req.member.memberId
    const findrequest = await sickRequest.findById(req.body.requestId)
    if (!findrequest) {
      return res.json({
        code: requestDoesNotExist,
        message: 'Request Does Not Exist',
      })
    }

    const ourDay = new Date()
    if (findrequest) {
      if (send.toString() === findrequest.member.toString()) {
        if (findrequest.status === requestType.PENDING) {
          sickRequest.findByIdAndUpdate(
            req.body.requestId,
            { $set: { status: requestType.CANCELLED } },
            function (err) {
              if (err) {
                return res.json({
                  code: databaseerror,
                  message: 'database error',
                })
              } else {
                return res.json({
                  message: 'Request Cancelled',
                })
              }
            }
          )
        }
        if (
          findrequest.status === requestType.ACCEPT ||
          findrequest.status === requestType.REJECT
        ) {
          if (findrequest.from > ourDay) {
            sickRequest.findByIdAndUpdate(
              req.body.requestId,
              { $set: { status: requestType.CANCELLED } },
              function (err) {
                if (err) {
                  return res.status(500).json({
                    code: databaseerror,
                    message: 'database error',
                  })
                } else {
                  return res.json({
                    message: 'Request Cancelled',
                  })
                }
              }
            )
          } else {
            return res.json({
              message: 'Request Date already passed',
            })
          }
        } else {
          return res.json({
            code: cannotCancel,
            message: 'Request Already Cancelled',
          })
        }
      } else {
        return res.json({
          message: 'Not Same Member',
        })
      }
    } else {
      return res.json({
        message: 'Wrong RequestId',
      })
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const cancelMaternityLeaveRequest = async (req, res) => {
  try {
    const send = req.member.memberId
    const findrequest = await maternityRequest.findById(req.body.requestId)
    const ourDay = new Date()
    if (findrequest) {
      if (send.toString() === findrequest.member.toString()) {
        if (findrequest.status === requestType.PENDING) {
          maternityRequest.findByIdAndUpdate(
            req.body.requestId,
            { $set: { status: requestType.CANCELLED } },
            function (err) {
              if (err) {
                return res.json({
                  code: databaseerror,
                  message: 'database error',
                })
              } else {
                return res.json({
                  message: 'Request Cancelled',
                })
              }
            }
          )
        } else if (
          findrequest.status === requestType.ACCEPT ||
          findrequest.status === requestType.REJECT
        ) {
          if (findrequest.from > ourDay) {
            maternityRequest.findByIdAndUpdate(
              req.body.requestId,
              { $set: { status: requestType.CANCELLED } },
              function (err) {
                if (err) {
                  return res.status(500).json({
                    code: databaseerror,
                    message: 'database error',
                  })
                } else {
                  return res.json({
                    message: 'Request Cancelled',
                  })
                }
              }
            )
          } else {
            return res.json({
              message: 'Request Date already passed',
            })
          }
        } else {
          return res.status(400).json({
            code: cannotCancel,
            message: 'Request Already Cancelled',
          })
        }
      } else {
        return res.json({
          message: 'Not Same Member',
        })
      }
    } else {
      return res.json({
        message: 'Wrong RequestId',
      })
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const cancelChangeDayOffRequest = async (req, res) => {
  try {
    const send = req.member.memberId
    const findrequest = await Request.findById(req.body.requestId)

    if (findrequest) {
      if (send.toString() === findrequest.member.toString()) {
        if (findrequest.status === requestType.PENDING) {
          Request.findByIdAndDelete(req.body.requestId, function (err) {
            if (err) {
              return res.json({
                code: databaseerror,
                message: 'database error',
              })
            } else {
              return res.json({
                message: 'Request Cancelled',
              })
            }
          })
        }
        if (
          findrequest.status === requestType.ACCEPT ||
          findrequest.status === requestType.REJECT
        ) {
          return res.json({
            message: 'Not Pending Request',
          })
        }
      } else {
        return res.json({
          message: 'Not Same Member',
        })
      }
    } else {
      return res.json({
        message: 'Wrong RequestId',
      })
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const sendReplacementRequest = async (req, res) => {
  try {
    const replacementId = req.body.replacementMemberId
    const dateOfReplacement = new Date(req.body.dateOfReplacement)
    const slotId = req.body.slotId
    // Check if not found
    const replacementMemberFound = await MemberModel.findById(replacementId)
    if (!replacementMemberFound) {
      return res.status(404).json({
        code: userNotFound,
        message: 'Member Does Not Exist!',
      })
    }

    const slotFound = await SlotAssignmentModel.findById(slotId)
    if (!slotFound) {
      return res.status(404).json({
        code: slotAssignmentNotFound,
        message: 'Slot Does Not Exist!',
      })
    }

    const tokenId = req.member.memberId
    if (!slotFound.member || slotFound.member.toString() !== tokenId) {
      return res.status(403).json({
        code: slotNotAssignedToMember,
        message: 'Slot Not Assigned to this member',
      })
    }
    const checkSameCourse = await CourseAssignmentModel.findOne({
      member: replacementId,
      course: slotFound.course,
    })
    if (!checkSameCourse) {
      return res.status(400).json({
        code: memberNotAssignedToCourse,
        message: 'Member Not Assigned To Course',
      })
    }

    if (dateOfReplacement < new Date()) {
      return res.status(400).json({
        code: dateInThePast,
        message: 'Date in the past',
      })
    }
    const dayNumber = dateOfReplacement.getDay()
    if (weekDaysNumbers[dayNumber] === weekDaysNumbers[5]) {
      return res.status(400).json({
        code: cannotSendReplacementOnFriday,
        message: 'Cannot Send Replacement on Friday',
      })
    }

    if (weekDaysNumbers[dayNumber] !== slotFound.day) {
      return res.status(400).json({
        code: slotIsNotOnReplacementDay,
        message: 'Slot is not on the replacement day',
      })
    }
    const checkmembernotfree = await slotAssignmentModel.findOne({
      member: replacementId,
      day: slotFound.day,
      slot: slotFound.slot,
    })
    if (checkmembernotfree) {
      return res.status(400).json({
        code: memberNotFree,
        message: 'Member not free in this slot ',
      })
    }

    const newReplacement = {}
    newReplacement.replacementMember = req.body.replacementMemberId
    newReplacement.slot = req.body.slotId
    newReplacement.dateOfReplacement = req.body.dateOfReplacement
    newReplacement.member = req.member.memberId
    newReplacement.status = requestType.PENDING
    if (req.body.reason) {
      newReplacement.reason = req.body.reason
    }
    await Replacment.create(newReplacement)

    return res.json({
      message: 'Request sent successfully',
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}
// absentDate: Date,
// reason: String,
// status: String,
// dateSubmitted: Date,
// member: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: 'Member',
// },
const accidentalLeaveRequest = async (req, res) => {
  try {
    const obj = {}
    obj.member = req.member.memberId
    obj.status = requestType.PENDING
    obj.dateSubmitted = new Date()
    const reason = req.body.reason
    if (reason) obj.reason = reason
    let dateArr = req.body.absentDate.split('-')
    obj.absentDate = new Date(dateArr[0], dateArr[1] - 1, dateArr[2])
    const member = await Member.findById(obj.member)
    let accidentalDaysTaken = member.accidentalDaysTaken
    let annualBalance = calcMemberanualLeavesLeft(member)
    console.log(annualBalance)
    if (accidentalDaysTaken < 6 && annualBalance >= 1) {
      AccidentalLeaveRequest.create(obj)
    } else {
      if (accidentalDaysTaken > 5)
        return res.status(404).json({
          message: 'you used the whole 6 accidental Days leaves',
          code: zeroAccidentalLeaves,
        })
      else
        return res.status(404).json({
          message: 'you used the whole annual balance you have',
          code: zeroAnnualLeaves,
        })
    }
    res.json({
      message: 'succefully make a request',
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}
const accidentalCancelRequest = async (req, res) => {
  try {
    const memberId = req.member.memberId
    const requestId = req.body.requestId
    const request = await AccidentalLeaveRequest.findById(requestId)
    if (!request)
      return res.status(404).json({
        message: 'Request doesnot exist',
        code: requestDoesNotExist,
      })
    console.log(request.member)
    if (request.member.toString() !== memberId)
      return res.status(403).json({
        code: notYourRequest,
        message: 'You are not allowed to cancel others requests',
      })
    if (request.status === requestType.CANCELLED)
      return res.status(404).json({
        message: 'this request is alrweady cancelled',
        code: requestNotPending,
      })
    // mongoose.set('useFindAndModify', false)
    if (request.status === requestType.ACCEPT) {
      const member = await Member.findById(memberId)
      const mem = await Member.findByIdAndUpdate(
        memberId,
        {
          //  $inc: { accidentalDaysTaken: 1 } /*,'annualBalanceTaken':-1}*/,
          accidentalDaysTaken: member.accidentalDaysTaken - 1,
          annualBalanceTaken: member.annualBalanceTaken - 1,
        },
        { new: true }
      )
    }

    await AccidentalLeaveRequest.findByIdAndUpdate(requestId, {
      status: requestType.CANCELLED,
    })

    res.json({
      message: 'succefully Cancel the request',
    })
  } catch (err) {
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}
const accidentalRejectRequest = async (req, res) => {
  try {
    const requestId = req.body.requestId
    const request = await AccidentalLeaveRequest.findById(requestId).populate(
      'member'
    )
    const memberId = req.member.memberId
    // const isOuthoraized=await
    if (!request) {
      return res.status(404).json({
        code: requestDoesNotExist,
        message: 'Accidental Leave Request Does Not Exist',
      })
    }

    const hod = await MemberModel.findById(memberId)
    //  console.log(hod.department)
    if (request.member.department.toString() !== hod.department.toString())
      return res.status(403).json({
        code: differentDepartments,
        message: 'Member belongs to different department',
      })

    if (request.status !== requestType.PENDING)
      return res.status(404).json({
        message: 'this request is not pending anymore',
        code: requestNotPending,
      })

    await AccidentalLeaveRequest.findByIdAndUpdate(requestId, {
      status: requestType.REJECT,
    })

    res.json({
      message: 'succefully reject the request',
    })
  } catch (err) {
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}
const accidentalAcceptRequest = async (req, res) => {
  try {
    const requestId = req.body.requestId
    const request = await AccidentalLeaveRequest.findById(requestId).populate(
      'member'
    )
    const memberId = req.member.memberId
    // const isOuthoraized=await
    if (!request) {
      return res.status(404).json({
        code: requestDoesNotExist,
        message: 'Accidental Leave Request Does Not Exist',
      })
    }

    const hod = await MemberModel.findById(memberId)
    console.log(hod.department)
    console.log(request.member.department)
    if (request.member.department.toString() !== hod.department.toString())
      return res.status(403).json({
        code: differentDepartments,
        message: 'Member belongs to different department',
      })
    if (request.status !== requestType.PENDING)
      return res.status(404).json({
        message: 'this request is not pending anymore',
        code: requestNotPending,
      })

    const member = await Member.findById(request.member)
    let accidentalDaysTaken = member.accidentalDaysTaken
    let annualBalance = calcMemberanualLeavesLeft(member)
    console.log(annualBalance, 'annualBalance')
    console.log(member.annualBalanceTaken, 'annualBalanceTaken')

    if (accidentalDaysTaken < 6 && annualBalance >= 1) {
      await Member.findByIdAndUpdate(memberId, {
        //    $set: {
        accidentalDaysTaken: accidentalDaysTaken + 1,
        annualBalanceTaken: member.annualBalanceTaken + 1,
        //    },
      })
    } else {
      if (accidentalDaysTaken > 5)
        return res.status(404).json({
          message: 'you used the whole 6 accidental Days leaves',
          code: zeroAccidentalLeaves,
        })
      else
        return res.status(404).json({
          message: 'you have not enough AnnualLeaves ',
          annualBalance: annualBalance,
          code: zeroAnnualLeaves,
        })
    }

    await AccidentalLeaveRequest.findByIdAndUpdate(requestId, {
      status: requestType.ACCEPT,
    })

    res.json({
      message: 'succefully Accept the request',
      accidentalLeavesYouUsed: accidentalDaysTaken + 1,
      annualBalance: annualBalance - 1,
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const sendAnnualLeave = async (req, res) => {
  try {
    const tokenId = req.member.memberId
    const memberFound = await MemberModel.findById(tokenId)
    if (!memberFound) {
      return res.status(404).json({
        code: userNotFound,
        message: 'User Not Found',
      })
    }
    const today = new Date()
    const dayFromArray = req.body.from.split('-')
    const dayToArray = req.body.to.split('-')
    const dayFrom = new Date(
      new Date(
        dayFromArray[0],
        Number(dayFromArray[1]) - 1,
        dayFromArray[2]
      ).getTime() +
        2 * 60 * 60 * 1000
    )
    const dayTo = new Date(
      new Date(
        dayToArray[0],
        Number(dayToArray[1]) - 1,
        dayToArray[2]
      ).getTime() +
        2 * 60 * 60 * 1000
    )
    if (dayFrom > dayTo) {
      return res.json({
        code: FromDayAfterToDay,
        message: 'Day From Must Be Before Day To',
      })
    }
    if (dayFrom < today) {
      return res.json({
        code: mustBeBeforeTargetDay,
        message: 'Annual Leaves Must Be Submitted Before Target Day',
      })
    }
    //Get the days of annaul leave request
    const diffDaysInMillis = dayTo - dayFrom
    let diffDays = diffDaysInMillis / (24 * 60 * 60 * 1000) + 1
    // console.log('Before', diffDays)
    const checkDay = dayFrom.getTime()
    for (
      let start = checkDay;
      start <= dayTo.getTime();
      start += 24 * 60 * 60 * 1000
    ) {
      const certainDay = new Date(start).getDay()
      if (
        certainDay === 5 ||
        weekDaysNumbers[certainDay] === memberFound.dayoff
      )
        diffDays -= 1
    }
    //Get Available days for member
    const memberStartDate = memberFound.dateCreated
    // console.log(memberStartDate.toDateString())
    const diffInMonths = today.getMonth() - memberStartDate.getMonth()
    const diffInYears = today.getFullYear() - memberStartDate.getFullYear()
    let availableDays = (diffInMonths + 12 * diffInYears) * 2.5
    if (today.getDate() <= memberStartDate.getDate()) availableDays += 2.5

    availableDays -= memberFound.annualBalanceTaken
    if (diffDays >= availableDays) {
      return res.json({
        code: noAvailableDays,
        message: 'There is no available days left in the annual balance',
      })
    }
    const newReq = {}
    newReq.from = dayFrom
    newReq.to = dayTo
    newReq.status = requestType.PENDING
    newReq.dateSubmitted = today
    if (req.body.replacementId) {
      const replacementFound = await replacementRequest.findById(
        req.body.replacementId
      )
      if (!replacementFound) {
        return res.status(404).json({
          code: requestDoesNotExist,
          message: 'Request Does Not Exist!',
        })
      }
      if (replacementFound.member.toString() !== tokenId) {
        return res.status(403).json({
          code: notYourRequest,
          message: 'The replacement request must be done by you',
        })
      }
      if (!replacementFound.replacementMember) {
        return res.status(400).json({
          code: noReplacementFound,
          message: 'No Replacement Member Found',
        })
      }
      if (replacementFound.status !== requestType.ACCEPT) {
        return res.status(400).json({
          code: requestNotAccepted,
          message: 'The request is not accepted',
        })
      }
      newReq.replacement = req.body.replacementId
    }
    newReq.member = tokenId
    if (req.body.reason) newReq.reason = req.body.reason
    await annualLeaveRequest.create(newReq)

    return res.json({
      message: 'Request Created Successfully',
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const acceptAnnualLeaveRequest = async (req, res) => {
  try {
    const requestId = req.body.requestId
    const tokenId = req.member.memberId

    const requestFound = await annualLeaveRequest
      .findById(requestId)
      .populate('member')
    if (!requestFound) {
      return res.status(404).json({
        code: requestDoesNotExist,
        message: 'Annual Leave Request Does Not Exist',
      })
    }

    if (requestFound.status !== requestType.PENDING)
      return res.status(400).json({
        code: requestNotPending,
        message: 'The request is not pending',
      })
    // console.log(requestFound.member.department)
    const hod = await MemberModel.findById(tokenId)
    //  console.log(hod.department)
    if (requestFound.member.department.toString() !== hod.department.toString())
      return res.status(403).json({
        code: differentDepartments,
        message: 'Member belongs to different department',
      })

    // //Get the days of annaul leave request
    const dayFrom = requestFound.from
    const dayTo = requestFound.to
    const diffDaysInMillis = dayTo - dayFrom
    let diffDays = diffDaysInMillis / (24 * 60 * 60 * 1000) + 1
    const checkDay = dayFrom.getTime()
    for (
      let start = checkDay;
      start <= dayTo.getTime();
      start += 24 * 60 * 60 * 1000
    ) {
      const certainDay = new Date(start).getDay()
      if (
        certainDay === 5 ||
        weekDaysNumbers[certainDay] === requestFound.member.dayoff
      )
        diffDays -= 1
    }
    //  console.log(diffDays)

    //Get Available days for member
    const today = new Date()
    const memberStartDate = requestFound.member.dateCreated
    const diffInMonths = today.getMonth() - memberStartDate.getMonth()
    const diffInYears = today.getFullYear() - memberStartDate.getFullYear()
    let availableDays = (diffInMonths + 12 * diffInYears) * 2.5
    if (today.getDate() <= memberStartDate.getDate()) availableDays += 2.5

    availableDays -= requestFound.member.annualBalanceTaken
    if (diffDays > availableDays) {
      return res.json({
        code: noAvailableDays,
        message: 'There is no available days left in the annual balance',
      })
    }
    await MemberModel.findByIdAndUpdate(requestFound.member._id, {
      $set: {
        annualBalanceTaken: requestFound.member.annualBalanceTaken + diffDays,
      },
    })
    const updateBody = {}
    updateBody.status = requestType.ACCEPT
    if (req.body.comment) updateBody.comment = req.body.comment

    await annualLeaveRequest.findByIdAndUpdate(requestId, {
      $set: updateBody,
    })

    return res.json({
      message: 'Request Accepted Successfully',
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const rejectAnnualLeaveRequest = async (req, res) => {
  try {
    const requestId = req.body.requestId

    const requestFound = await annualLeaveRequest
      .findById(requestId)
      .populate('member')
    if (!requestFound) {
      return res.status(404).json({
        code: requestDoesNotExist,
        message: 'Annual Leave Request Does Not Exist',
      })
    }

    if (requestFound.status !== requestType.PENDING)
      return res.status(400).json({
        code: requestNotPending,
        message: 'The request is not pending',
      })
    const hod = await MemberModel.findById(req.member.memberId)
    if (requestFound.member.department.toString() !== hod.department.toString())
      return res.status(403).json({
        code: differentDepartments,
        message: 'Member belongs to different department',
      })

    const updateBody = {}
    updateBody.status = requestType.REJECT
    if (req.body.comment) updateBody.comment = req.body.comment

    await annualLeaveRequest.findByIdAndUpdate(requestId, {
      $set: updateBody,
    })

    return res.json({
      message: 'Request is Rejected Successfully',
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const cancelAnnualLeaveRequest = async (req, res) => {
  try {
    const tokenId = req.member.memberId
    const requestId = req.body.requestId
    const requestFound = await annualLeaveRequest
      .findById(requestId)
      .populate('member')
    if (!requestFound) {
      return res.status(404).json({
        code: requestDoesNotExist,
        message: 'Request Does Not Exist',
      })
    }
    if (requestFound.member._id.toString() !== tokenId)
      return res.status(403).json({
        code: notYourRequest,
        message: 'You are not allowed to cancel others requests',
      })
    if (requestFound.status === requestType.CANCELLED)
      return res.status(400).json({
        code: cannotCancel,
        message: 'already cancelled',
      })
    if (requestFound.from < new Date())
      return res.status(400).json({
        code: cannotCancel,
        message: 'You cannot Cancel this request because its date has come',
      })

    await annualLeaveRequest.findByIdAndUpdate(requestId, {
      $set: { status: requestType.CANCELLED },
    })

    return res.json({
      message: 'Request Cancelled Successfully',
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}
const checkday = (date1, date2) => {
  if (date1.getDate() === date2.getDate()) {
    if (date1.getMonth() === date2.getMonth()) {
      if (date1.getFullYear() === date2.getFullYear()) {
        return 1
      }
    }
  }
  return 0
}
const compensationLeaveRequest = async (req, res) => {
  try {
    const memberComp = await Member.findById(req.member.memberId)
    let dateArr = req.body.compensationDate.split('-')
    const compensationDateobject = new Date(
      dateArr[0],
      dateArr[1] - 1,
      dateArr[2]
    )
    const absent = req.body.absentDate
    let dateArr1 = absent.split('-')
    const absentDate = new Date(dateArr1[0], dateArr1[1] - 1, dateArr1[2])
    const memberCompdayoff = memberComp.dayoff

    if (weekDaysNumbers[compensationDateobject.getDay()] != memberCompdayoff) {
      return res.json({
        message: 'Compensation day must be your DayOff',
      })
    }
    if (
      weekDaysNumbers[absentDate.getDay()] === memberComp.dayoff ||
      weekDaysNumbers[absentDate.getDay()] === weekDays.FRIDAY
    ) {
      return res.json({
        message: 'Absent day should not be FRIDAY OR YOUR DAYOFF',
      })
    }

    let currentYear = absentDate.getFullYear()
    let currentMonth
    let startDate
    let endDate
    currentMonth =
      absentDate.getDate() >= 11
        ? absentDate.getMonth()
        : absentDate.getMonth() - 1
    if (currentMonth === -1) {
      currentMonth = 11
      currentYear = currentYear - 1
      startDate = new Date(currentYear, currentMonth, 11)
      endDate = new Date(currentYear + 1, 0, 11)
    } else {
      startDate = new Date(currentYear, currentMonth, 11)
      endDate = new Date(currentYear, currentMonth + 1, 11)
    }
    if (
      compensationDateobject >= startDate &&
      compensationDateobject < endDate
    ) {
      // absentDate: Date,
      // compensationDate: Date,
      // comment: String,
      // status: String,
      // dateSubmitted: Date,
      // member:
      const newrequest = {}
      newrequest.absentDate = absentDate
      newrequest.compensationDate = compensationDateobject
      newrequest.member = req.member.memberId
      newrequest.status = requestType.PENDING
      newrequest.reason = req.body.reason
      newrequest.dateSubmitted = new Date()

      Compensation.create(newrequest)
      return res.json({
        message: 'Compensation Leave Sent Successfuly',
      })
    } else {
      return res.json({
        message: 'Compensation Day must be in same month ',
      })
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const acceptCompensationLeaveRequest = async (req, res) => {
  try {
    const hod = await Member.findById(req.member.memberId)
    const compensationRequest = await CompensationModel.findById(
      req.body.requestId
    )
    console.log(hod)
    console.log(compensationRequest)

    if (!compensationRequest) {
      return res.json({
        message: 'No Compensation Request Found By this ID',
      })
    }

    if (hod.type !== memberRoles.HOD) {
      return res.json({
        message: 'Must be head of Department to accept the request',
      })
    }

    if (compensationRequest.status !== requestType.PENDING) {
      return res.json({
        message: 'Request Status must be Pending',
      })
    }

    CompensationModel.findByIdAndUpdate(
      req.body.requestId,
      { status: requestType.ACCEPT },
      function (err) {
        if (err) {
          return res.json({
            code: databaseerror,
            message: 'database error',
          })
        } else {
          return res.json({
            message: 'Compensation Request accepetd',
          })
        }
      }
    )
  } catch (err) {
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const rejectCompensationLeaveRequest = async (req, res) => {
  try {
    const hod = await Member.findById(req.member.memberId)
    const compensationRequest = await CompensationModel.findById(
      req.body.requestId
    )
    console.log(hod)
    console.log(compensationRequest)

    if (!compensationRequest) {
      return res.json({
        message: 'No Compensation Request Found By this ID',
      })
    }

    if (hod.type !== memberRoles.HOD) {
      return res.json({
        message: 'Must be head of Department to accept the request',
      })
    }

    if (compensationRequest.status !== requestType.PENDING) {
      return res.json({
        message: 'Request Status must be Pending',
      })
    }

    CompensationModel.findByIdAndUpdate(
      req.body.requestId,
      { status: requestType.REJECT, comment: req.body.comment },
      function (err) {
        if (err) {
          return res.json({
            code: databaseerror,
            message: 'database error',
          })
        } else {
          return res.json({
            message: 'Compensation Request rejected',
          })
        }
      }
    )
  } catch (err) {
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const viewAnnualRequests = async (req, res) => {
  try {
    const tokenId = req.member.memberId
    const checkDep = await MemberModel.findById(tokenId)
    const filterObj = {}
    if (req.body.status) filterObj['status'] = req.body.status
    if (checkDep.type === memberRoles.HOD) {
      const records = await annualLeaveRequest.find(filterObj).populate({
        path: 'member',
        match: {
          department: checkDep.department,
        },
      })
      let out = []
      for (let i = 0; i < records.length; i++) {
        if (records[i].member !== null) out.push(records[i])
      }
      return res.json({
        data: out,
      })
    } else {
      filterObj.member = tokenId
      const records = await annualLeaveRequest.find(filterObj)
      return res.json({
        data: records,
      })
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const viewAccidentalRequests = async (req, res) => {
  try {
    const tokenId = req.member.memberId
    const checkDep = await MemberModel.findById(tokenId)
    const filterObj = {}
    if (req.body.status) filterObj['status'] = req.body.status
    if (checkDep.type === memberRoles.HOD) {
      const records = await annualLeaveRequest.find(filterObj).populate({
        path: 'member',
        match: {
          department: checkDep.department,
        },
      })
      let out = []
      for (let i = 0; i < records.length; i++) {
        if (records[i].member !== null) out.push(records[i])
      }
      return res.json({
        data: out,
      })
    } else {
      filterObj.member = tokenId
      const records = await annualLeaveRequest.find(filterObj)
      return res.json({
        data: records,
      })
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const viewCompensationRequests = async (req, res) => {
  try {
    const tokenId = req.member.memberId
    const checkDep = await MemberModel.findById(tokenId)
    const filterObj = {}
    if (req.body.status) filterObj['status'] = req.body.status
    if (checkDep.type === memberRoles.HOD) {
      const records = await annualLeaveRequest.find(filterObj).populate({
        path: 'member',
        match: {
          department: checkDep.department,
        },
      })
      let out = []
      for (let i = 0; i < records.length; i++) {
        if (records[i].member !== null) out.push(records[i])
      }
      return res.json({
        data: out,
      })
    } else {
      filterObj.member = tokenId
      const records = await annualLeaveRequest.find(filterObj)
      return res.json({
        data: records,
      })
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const viewChangeDayOffRequests = async (req, res) => {
  try {
    const tokenId = req.member.memberId
    const checkDep = await MemberModel.findById(tokenId)
    const filterObj = {}
    if (req.body.status) filterObj['status'] = req.body.status
    if (checkDep.type === memberRoles.HOD) {
      const records = await annualLeaveRequest.find(filterObj).populate({
        path: 'member',
        match: {
          department: checkDep.department,
        },
      })
      let out = []
      for (let i = 0; i < records.length; i++) {
        if (records[i].member !== null) out.push(records[i])
      }
      return res.json({
        data: out,
      })
    } else {
      filterObj.member = tokenId
      const records = await annualLeaveRequest.find(filterObj)
      return res.json({
        data: records,
      })
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const viewSickRequests = async (req, res) => {
  try {
    const tokenId = req.member.memberId
    const checkDep = await MemberModel.findById(tokenId)
    const filterObj = {}
    if (req.body.status) filterObj['status'] = req.body.status
    if (checkDep.type === memberRoles.HOD) {
      const records = await annualLeaveRequest.find(filterObj).populate({
        path: 'member',
        match: {
          department: checkDep.department,
        },
      })
      let out = []
      for (let i = 0; i < records.length; i++) {
        if (records[i].member !== null) out.push(records[i])
      }
      return res.json({
        data: out,
      })
    } else {
      filterObj.member = tokenId
      const records = await annualLeaveRequest.find(filterObj)
      return res.json({
        data: records,
      })
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const viewMaternityRequests = async (req, res) => {
  try {
    const tokenId = req.member.memberId
    const checkDep = await MemberModel.findById(tokenId)
    const filterObj = {}
    if (req.body.status) filterObj['status'] = req.body.status
    if (checkDep.type === memberRoles.HOD) {
      const records = await annualLeaveRequest.find(filterObj).populate({
        path: 'member',
        match: {
          department: checkDep.department,
        },
      })
      let out = []
      for (let i = 0; i < records.length; i++) {
        if (records[i].member !== null) out.push(records[i])
      }
      return res.json({
        data: out,
      })
    } else {
      filterObj.member = tokenId
      const records = await annualLeaveRequest.find(filterObj)
      return res.json({
        data: records,
      })
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

module.exports = {
  changeDayOffRequest,
  acceptDayOffRequest,
  rejectDayOffRequest,
  sickLeaveRequest,
  acceptSickLeaveRequest,
  rejectSickLeaveRequest,
  maternityLeaveRequest,
  acceptMaternityLeaveRequest,
  rejectMaternityLeaveRequest,
  cancelSickLeaveRequest,
  cancelMaternityLeaveRequest,
  cancelChangeDayOffRequest,
  sendSlotLinking,
  acceptSlotLinkingRequest,
  rejectSlotLinkingRequest,
  cancelSlotLinkingRequest,
  viewSlotLinkning,
  sendReplacementRequest,
  sendAnnualLeave,
  acceptAnnualLeaveRequest,
  rejectAnnualLeaveRequest,
  cancelAnnualLeaveRequest,
  accidentalLeaveRequest,
  compensationLeaveRequest,
  acceptCompensationLeaveRequest,
  rejectCompensationLeaveRequest,
  accidentalAcceptRequest,
  accidentalRejectRequest,
  accidentalCancelRequest,
  viewAnnualRequests,
  viewAccidentalRequests,
  viewChangeDayOffRequests,
  viewSickRequests,
  viewMaternityRequests,
  viewCompensationRequests,
}
