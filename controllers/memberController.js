const MemberModel = require('../models/memberModel')

const addMember = async (req, res) => {
  const member = req.body
  await MemberModel.create(member)
  return res.json({
    message: 'Member Added',
  })
}

module.exports = { addMember }
