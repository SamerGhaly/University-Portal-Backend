const memberRoles = {
  HR: 'hr',
  HOD: 'head of department',
  INSTRUCTOR: 'instructor',
  TA: 'teaching assistant',
  COORDINATOR: 'coordinator',
}
const roomTypes = {
  HALL: 'hall',
  LAB: 'lab',
  TUTORIAL: 'tutorial',
  OFFICE: 'office',
}

const attendanceRecordTypes = {
  SIGN_IN: 'signin',
  SIGN_OUT: 'signout',
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

const weekDaysNumbers = {
  0: weekDays.SUNDAY,
  1: weekDays.MONDAY,
  2: weekDays.TUESDAY,
  3: weekDays.WEDNESDAY,
  4: weekDays.THURSDAY,
  5: weekDays.FRIDAY,
  6: weekDays.SATURDAY,
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

const slotTypes = {
  TUTORIAL: 'tutorial',
  LECTURE: 'lecture',
  LAB: 'lab',
}
const requestType = {
  ACCEPT: 'accept',
  REJECT: 'reject',
  PENDING: 'pending',
  CANCELLED: 'cancelled',
}
module.exports = {
  memberRoles,
  attendanceRecordTypes,
  roomTypes,
  gender,
  weekDays,
  months,
  slotTypes,
  requestType,
  weekDaysNumbers,
}
