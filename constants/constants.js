const memberRoles = {
  HR: 'hr',
  HOD: 'head of department',
  INSTRUCTOR: 'instructor',
  TA: 'teaching assistant',
  CO: 'course Coordinator',
}
const roomTypes = {
  HALL: 'hall',
  LAB: 'lab',
  TUTURIAL: 'tuturial',
  OFFICE: 'office',
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
const requestType = {
  ACCEPT: 'accept',
  REJECT: 'reject',
  PENDING: 'pending',
}

module.exports = { memberRoles, roomTypes, weekDays, requestType }
