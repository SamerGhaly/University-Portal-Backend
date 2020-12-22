const {
  catchError,
  slotAssignmentNotFound,
  slotAlreadyAssigned,
  memberNotAssignedToCourse,
  requestAlreadyMade,
  databaseerror,
  requestDoesNotExist,
  requestNotPending,
  notCoordinator,
} = require('../constants/errorCodes')

const { requestType, memberRoles } = require('../constants/constants')
const Request = require('../models/changeDayOffRequest')
const sickRequest = require('../models/sickLeaveRequest')
const maternityRequest = require('../models/maternityLeaveRequest')
const Member = require('../models/memberModel')

const SlotAssignmentModel = require('../models/slotAssignmentModel')
const SlotLinkingModel = require('../models/slotLinkingRequest')
const MemberModel = require('../models/memberModel')
const CourseAssignmentModel = require('../models/courseAssignment')
const { findById, findByIdAndUpdate } = require('../models/changeDayOffRequest')

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
        code: notCoordinator,
        message: 'Not a Coordinator',
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
    const request = await Request.findById(req.body.requestId)
    const user = await Member.findById(request.member)
    const hod = await Member.findById(req.member.memberId)
    console.log(memberid)
    console.log(hod)
    if (hod.department.toString() === user.department.toString()) {
      if (request) {
        Member.findByIdAndUpdate(
          request.member,
          { dayoff: request.newDayOff },
          function (err) {
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
              return res.json({
                message: 'Request accepted anad DayOff updated successfully',
              })
            }
          }
        )
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
    const request = await Request.findById(req.body.requestId)
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
    const request = await Request.findById(req.body.requestId)
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
    const request = await Request.findById(req.body.requestId)
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
    const request = await Request.findById(req.body.requestId)
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
    const ourDay = new Date()
    console.log(ourDay)
    console.log(findrequest.from)
    if (findrequest) {
      if (send.toString() === findrequest.member.toString()) {
        if (findrequest.status === requestType.PENDING) {
          sickRequest.findByIdAndDelete(req.body.requestId, function (err) {
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
          console.log('here')
          if (findrequest.from > ourDay) {
            console.log('here2')
            sickRequest.findByIdAndDelete(req.body.requestId, function (err) {
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
            })
          } else {
            return res.json({
              message: 'Request Date already passed',
            })
          }
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
          maternityRequest.findByIdAndDelete(
            req.body.requestId,
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
            maternityRequest.findByIdAndDelete(
              req.body.requestId,
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
          Request.findByIdAndDelete(req.body.requestId, function (err) {
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
}
