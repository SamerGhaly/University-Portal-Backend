require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const MemberModel = require('../models/memberModel')
const {
  userNotFound,
  unActivatedAccount,
  emailAlreadyExists,
  catchError,
  memberAlreadyActivated,
} = require('../constants/errorCodes')

const login = async (req, res) => {
  try {
    const memberFound = await MemberModel.findOne({ email: req.body.email })
    if (!memberFound) {
      return res.json({
        code: userNotFound,
        message: 'User Not Found',
      })
    }

    if (!memberFound.activated) {
      return res.json({
        code: unActivatedAccount,
        message: 'Please Activate the account first before login',
      })
    }

    const checkPass = await bcrypt.compareSync(
      req.body.password,
      memberFound.password
    )
    if (!checkPass) {
      return res.status(401).json({
        message: 'Wrong Password',
      })
    }
    const payload = {}
    payload.memberId = memberFound._id
    payload.type = memberFound.type

    const token = await jwt.sign(payload, process.env.SIGNING_KEY, {
      expiresIn: '8h',
    })
    return res.json({
      token,
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: 'catch error',
      code: catchError,
    })
  }
}

const addMember = async (req, res) => {
  const member = req.body
  //Check if email is unique
  const checkMemberFound = await MemberModel.findOne({ email: member.email })
  if (checkMemberFound) {
    return res.json({
      code: emailAlreadyExists,
      message: 'Email already Exists',
    })
  }
  //Check if office has capacity

  let customId
  if (member.type === 'hr') {
    const countHR = await MemberModel.countDocuments({ type: 'hr' })
    member.dayoff = 'Saturday'
    customId = 'hr-' + (countHR + 1)
  } else {
    const countAcademic = await MemberModel.countDocuments({
      type: { $ne: 'hr' },
    })
    customId = 'ac-' + (countAcademic + 1)
  }
  member.password = await bcrypt.hashSync('123456', Number(process.env.SALT))
  member.activated = false
  member.customId = customId
  const createdMember = await MemberModel.create(member)
  return res.json({
    message: 'Member Added',
    data: createdMember,
  })
}

const activateAccount = async (req, res) => {
  try {
    const memberFound = await MemberModel.findById(req.body.memberId)
    if (!memberFound) {
      return res.status(404).json({
        code: userNotFound,
        message: 'Member Does Not Exist',
      })
    }
    if (memberFound.activated) {
      return res.json({
        code: memberAlreadyActivated,
        message: 'Member Already Activated',
      })
    }
    memberFound.activated = true
    memberFound.password = await bcrypt.hashSync(
      req.body.newPassword,
      Number(process.env.SALT)
    )
    await memberFound.save()
    return res.json({
      message: 'Account Activated Successfully',
    })
  } catch (err) {
    console.log(err)
    return res.json({
      message: 'catch error',
      code: catchError,
    })
  }
}

module.exports = { addMember, login, activateAccount }
