const memberRoles = {
  HR: 'hr',
  HOD: 'head of department',
  INSTRUCTOR: 'instructor',
  TA: 'teaching assistant',
}
const roomTypes={
    HALL: "hall",
    LAB :"lab",
    TUTURIAL:"tuturial",
    OFFICE:"office"
}

const attendanceRecordTypes = {
  SIGN_IN: 'sign in',
  SIGN_OUT: 'sign out',
}

module.exports = { memberRoles, attendanceRecordTypes,roomTypes }
