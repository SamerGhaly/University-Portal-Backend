const memberRoles = {
  HR: 'hr',
  HOD: 'head of department',
  INSTRUCTOR: 'instructor',
  TA: 'teaching assistant',
  COORDINATOR: 'coordinator',
}

const attendanceRecordTypes = {
  SIGN_IN: 'sign in',
  SIGN_OUT: 'sign out',
}
const roomTypes = {
  HALL: 'hall',
  LAB: 'lab',
  TUTURIAL: 'tuturial',
  OFFICE: 'office',
}

const gender = {
  MALE: 'male',
  FEMALE: 'female',
}

const weekDays = {
  FRIDAY: 'friday',
  SATURDAY: 'saturday',
  SUNDAY: 'sunday',
  MONDAY: 'monday',
  TUESDAY: 'tuesday',
  WEDNESDAY: 'wednesday',
  THURSDAY: 'thursday',
}

const months = {
  JANUARY: 'january',
  FEBRUARY: 'february',
  MARCH: 'march',
  APRIL: 'april',
  MAY: 'may',
  JUNE: 'june',
  JULY: 'july',
  AUGUST: 'august',
  SEPTEMBER: 'september',
  OCTOBER: 'october',
  NOVEMBER: 'november',
  DECEMBER: 'december',
}

module.exports = {
  memberRoles,
  attendanceRecordTypes,
  roomTypes,
  gender,
  weekDays,
  months,
}
