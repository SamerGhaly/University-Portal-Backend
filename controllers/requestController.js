const { databaseerror, catchError } = require('../constants/errorCodes')
const { requestType } = require('../constants/constants')
const { weekDays } = require('../constants/constants')
const Request = require('../models/changeDayOffRequest')
const sickRequest = require('../models/sickLeaveRequest')
const maternityRequest = require('../models/maternityLeaveRequest')
const Member = require('../models/memberModel')
const { date } = require('joi')
const { findById } = require('../models/changeDayOffRequest')
const Compensation = require('../models/compensationLeaveRequest')

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
const compensationLeaveRequest = async (req, res) => {
  try {
    const memberComp = await Member.findById(req.member.memberId)
    let dateArr = req.body.compensationDate.split('-')
    const compensationDateobject = new Date(dateArr[0], dateArr[1], dateArr[2])
    let dateArr1 = memberComp.dayoff.split('-')
    const memberCompdayoff = new Date(dateArr1[0], dateArr1[1], dateArr1[2])

    console.log(req.body.compensationDate)
    console.log(memberComp.dayoff)
    if (compensationDateobject.getDay() !== memberCompdayoff.getDay()) {
      return res.json({
        message: 'Compensation day must be your DayOff',
      })
    }
    if (
      req.body.absentDate === memberComp.dayoff ||
      req.body.absentDate === weekDays.FRIDAY
    ) {
      return res.json({
        message: 'Absent day should not be FRIDDAY OR YOUR DAYOFF',
      })
    }

    let currentYear = new Date(req.body.absentDate).getFullYear()
    let currentMonth
    let startDate
    let endDate
    currentMonth =
      new Date(req.body.absentDate).getDate() >= 11
        ? new Date(req.body.absentDate).getMonth()
        : new Date(req.body.absentDate).getMonth() - 1
    if (currentMonth === -1) {
      currentMonth = 11
      currentYear = currentYear - 1
      startDate = new Date(currentYear, currentMonth, 11)
      endDate = new Date(currentYear + 1, 0, 11)
    } else {
      if (currentMonth === 11) {
        currentMonth = 0
        currentYear = currentYear - 1
        startDate = new Date(currentYear, 11, 11)
        endDate = new Date(currentYear + 1, currentMonth, 11)
      } else {
        startDate = new Date(currentYear, currentMonth, 11)
        endDate = new Date(currentYear, currentMonth + 1, 11)
      }
    }
    if (
      req.body.compensationDate > startDate &&
      req.body.compensationDate < endDate
    ) {
      const newrequest = req.body
      newrequest.member = req.member.memberId
      newrequest.status = requestType.PENDING
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
  compensationLeaveRequest,
}
