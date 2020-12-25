# milestone-1-team-64

## How to test ?
1. Root file is server.js
Use node server.js to run the server
2. Server is running on port 5000
Example: To Add Member, Use : localhost:5000/members/addMember

## Notes 
1. We populated the Database for you with an activated Hr Member in order to use it to insert all other users, rooms, departments, ...
email: "admin@guc.com"
password: "admin"

2. We created customized error codes for us to use in the frontend and they do not represnt HTTP status codes. 
3. For any request, in case of failure, there will be an error code and a descriptive message in the response body

## Routes

### 2 GUC Staff Members Functionalities

#### Log in with a unique email and a password

##### Request
Functionality: login to the system
Route: /member/login
Request type: POST
Request Body: {
    "email":"john@guc.com",
    "password":"1234"
}


##### Response
{
    "message": "Logged in successfully"
}
###### The token is in the auth-token response Header


#### Update My Profile

##### Request
Functionality: update my profile
Route: /member/updateMyProfile
Request type: PUT
Request Body: {
    "email":"samer@guc.com", (optional)
    "birthdate":"1998-9-9" (optional)
}

##### Response
{
    "message": "Member Updated Successfully"
}

#### Reset Password

##### Request
Functionality: reset password
Route: /member/resetPassword
Request type: POST
Request Body: {
    "memberId":"5fe526cc4a96390450b26521",
    "newPassword":"1234"

}

##### Response
{
    "message": "Account Activated Successfully"
}


### 3 HR Functionalities

#### Add location

Functionality: add location to the system
Route: /room/addRoom
Request type: POST
Request Body: {
    "name":"c6-225",
    "capacity":5,
    "type":"office"
}

Response: {
    "message": "Room added"
}

#### Update location
Functionality: update location to the system
Route: /room/updateRoom
Request type: PUT
Request Body: {
    "roomId":"5fe50ca9ae96b004b47d126a",
    "name":"c8-225", (optional)
    "capacity":30, (optional)
    "type":"office" (optional)
}

Response:
{
    "message": "Room updated"
}

#### Delete location
Functionality: delete location from the system
Route: /room/deleteRoom
Request type: DELETE
Request Body: {
    "roomId":"5fe50ca9ae96b004b47d126a"
}

Response:
  {
      "message": "Room deleted"
  }

#### Add Faculty

Functionality: add Faculty to the system
Route: /faculty/addFaculty
Request type: POST
Request Body: {
    "name":"fac 5"
}

Response: {
    "message": "faculty added successfully"
}

#### Update faculty
Functionality: update Faculty to the system
Route: /faculty/updateFaculty
Request type: PUT
Request Body: {
    "id":"5fe511b3b50be6254400e78d",
    "name":"fac 5"
}

Response:
{
    "message": "faculty updated successfully"
}

#### Delete faculty
Functionality: delete Faculty from the system
Route: /faculty/deleteFaculty
Request type: DELETE
Request Body:{
    "id":"5fe512b25883fe25184a1e52"
}

Response:
 {
    "message": "faculty deleted successfully"
}


#### Add Department

Functionality: add Department to the system
Route: /department/addDepartment
Request type: POST
Request Body: {
    "name":"dep 1",
    "faculty":"5fe511b3b50be6254400e78d"
}

Response: {
    "message": "Department added successfully"
}

#### Update Department
Functionality: update Department to the system
Route: /faculty/updateFaculty
Request type: PUT
Request Body: {
    "id":"5fe511b3b50be6254400e78d",
    "name":"dep 1", (optional)
    "faculty":"5fe511b3b50be6254400e78d" (optional)

}

Response:
{
    "message": "Department updated"
}

#### Delete Department
Functionality: delete Department from the system
Route: /faculty/deleteFaculty
Request type: DELETE
Request Body:{
    "id":"5fe512b25883fe25184a1e52"
}

Response:
 {
    "message": "Department deleted successfully"
}




#### Add Course

Functionality: add Course to the system
Route: /course/addCourse
Request type: POST
Request Body: {
    "name":"csen123",
    "slotsPerWeek":8,
    "departmentId":"5fe520c563ac6d27acba1f3b"
}

Response: {
    "message": "Course added"
}

#### Update Course
Functionality: update Course to the system
Route: /course/updateCourse
Request type: PUT
Request Body: {
    "courseId":"5fe520f663ac6d27acba1f3c",
    "name":"csen606", (optional)
    "slotsPerWeek":8, (optional)
    "departmentIdRemoved":"5fe520c563ac6d27acba1f3b", (optional)
    "departmentIdAdded":"5fe521c2118e283b186235c6" (optional)
}

Response:
{
    "message": "Course updated"
}

#### Delete Course
Functionality: delete Course from the system
Route: /course/deleteCourse
Request type: DELETE
Request Body:{
    "courseId":"5fe5244c7f51e606f4923d63"
}

Response:
{
    "message": "Course deleted"
}





#### Add Member

Functionality: add Member to the system
Route: /member/addMember
Request type: POST
Request Body: {
    "name":"john",
    "email":"marc@guc.com",
    "salary":5000,
    "office":"5fe5262a4a96390450b26520",
    "department":"5fe520c563ac6d27acba1f3b",
    "dayoff":"monday",
    "type":"teaching assistant",
    "birthdate":"1999-5-9",
    "gender":"male"
}

Response: {
    "message": "Member Added",
    "data": {
        "_id": "5fe52bee97f660228041b3d1",
        "name": "john",
        "email": "marc@guc.com",
        "salary": 5000,
        "office": "5fe5262a4a96390450b26520",
        "department": "5fe520c563ac6d27acba1f3b",
        "dayoff": "monday",
        "type": "teaching assistant",
        "birthdate": "1999-05-08T21:00:00.000Z",
        "gender": "male",
        "password": "$2a$10$htuiCIUYnstLmS2kKe/WN.v5fl9tDy02JR0Y.eZ9rTconxQC.cjF6",
        "activated": false,
        "customId": "ac-5",
        "dateCreated": "2020-12-25T02:01:50.653Z",
        "annualBalanceTaken": 0,
        "accidentalDaysTaken": 0,
        "__v": 0,
        "id": "5fe52bee97f660228041b3d1"
    }
}

#### Update Member
Functionality: update Member to the system
Route: /member/updateMember
Request type: PUT
Request Body: {
    "memberId":"5fe5270f4a96390450b26522",
    "name":"samer", (optional)
    "email":"samer@guc.com", (optional)
    "department":"5fe520c563ac6d27acba1f3b",  (optional)
    "type":"teaching assistant",  (optional)
    "gender":"male",  (optional)
    "office":"5fe543ced5ee623f380d6e88",  (optional)
    "birthdate":"1998-9-9"  (optional)
}

Response:
{
    "message": "Member Updated Successfully"
}

#### Delete Member
Functionality: delete Member from the system
Route: /member/deleteMember
Request type: DELETE
Request Body:
{
    "memberId":"5fe527204a96390450b26525"
}

Response:
{
    "message": "Member Deleted Successfully"
}



#### Update Salary
Functionality: update Salary
Route: /member/updateSalary
Request type: PUT
Request Body:
{
    "memberId":"5fe52ccf97f660228041b3d2",
    "salary":6000
}

Response:
{
    "message": "Member Updated Successfully"
}






