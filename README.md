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
4. We are using environment variables, so please make sure to add a .env file with these variables and corresponding values  
MONGODB_URI  
SIGNING_KEY  

5. Kindly find below the link to the UML :
https://drive.google.com/file/d/1m0H27HB1s1gr2yOPDQOu7QU2izioXRZg/view

6. The Notification Module is handled in the frontend by getting all the pending requests which are not seen by the member yet  by using routes which view requests and filtering by status: "pending"  

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

#### Log out from the system

##### Request
Functionality: log out from the system  
Route: /member/logout  
Request type: GET    

###### NOTE: LOGOUT invalidates the token in the header in auth-token field.  

##### Response    
{  
    "message": "Logged out successfully"  
}  


#### View My Profile  

##### Request  
Functionality: view my profile on the system    
Route: /member/viewMember  
Request type: GET    


##### Response    
{  
    "data": {  
        "_id": "5fe526cc4a96390450b26521",  
        "name": "Mark",  
        "email": "mark@guc.com",  
        "type": "instructor",  
        "office": {  
            "_id": "5fe5262a4a96390450b26520",  
            "name": "c6 123",  
            "type": "office",  
            "capacity": 5,  
            "__v": 0,  
            "id": "5fe5262a4a96390450b26520"  
        },  
        "department": {  
            "_id": "5fe520c563ac6d27acba1f3b",  
            "name": "dep 1",  
            "faculty": {  
                "_id": "5fe51fe963ac6d27acba1f3a",  
                "name": "fac 1",  
                "__v": 0,  
                "id": "5fe51fe963ac6d27acba1f3a"  
            },  
            "__v": 0,  
            "id": "5fe520c563ac6d27acba1f3b"  
        },  
        "birthdate": "2000-05-08T21:00:00.000Z",  
        "gender": "male",  
        "dayoff": "tuesday",  
        "salary": 10000,  
        "activated": true,  
        "customId": "ac-2",  
        "dateCreated": "2020-12-25T01:39:56.416Z",  
        "annualBalanceTaken": 0,  
        "accidentalDaysTaken": 0,  
        "__v": 0,  
        "id": "5fe526cc4a96390450b26521"  
    }  
}  
  
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

###### NOTE: The sign in and sign out functionalities use the member provided in the token  

#### Sign in

##### Request  
Functionality:signin to create attendance record  
Route: /member/signin  
Request type: GET  

##### Response
{  
    "message": "Signed In successfully"  
}  


#### Sign out

##### Request  
Functionality:signout to create attendance record  
Route: /member/signout  
Request type: GET  

##### Response  
{  
    "message": "Signed Out successfully"  
}  

#### View My Attendance Record

##### Request  
Functionality:view my attendance records in a certain month and year or through all time    
Route: /attendance/viewMyAttendance  
Request type: POST   
Request Body: 
{  
    "month":12,  
    "year":"2020"  
}  
###### NOTE: If you want to filter, both month and year are required  

##### Response    
{
    "data": [  
        {  
            "_id": "5fe554cba8cde83ba4088e1c",  
            "type": "signin",  
            "date": "2020-12-25T04:56:11.810Z",  
            "member": "5fe526cc4a96390450b26521",  
            "__v": 0  
        },  
        {  
            "_id": "5fe554cfa8cde83ba4088e1d",  
            "type": "signin",  
            "date": "2020-12-25T04:56:15.818Z",  
            "member": "5fe526cc4a96390450b26521",  
            "__v": 0  
        },  
        {  
            "_id": "5fe554d7a8cde83ba4088e1e",  
            "type": "signout",  
            "date": "2020-12-25T04:56:23.278Z",  
            "member": "5fe526cc4a96390450b26521",  
            "__v": 0  
        },  
        {  
            "_id": "5fe554daa8cde83ba4088e1f",  
            "type": "signout",  
            "date": "2020-12-25T04:56:26.761Z",  
            "member": "5fe526cc4a96390450b26521",  
            "__v": 0  
        },  
        {  
            "_id": "5fe554dba8cde83ba4088e20",  
            "type": "signout",  
            "date": "2020-12-25T04:56:27.863Z",  
            "member": "5fe526cc4a96390450b26521",  
            "__v": 0  
        }  
    ]  
}  


#### View Missing Days

##### Request  
Functionality: view missing days  
Route: /member/viewMissingDays  
Request type: GET  

##### Response  
{
    "MissingDays": 10
} 


#### View Missing or Extra Hours 

##### Request  
Functionality: view missing or extra hours 
Route: /member/viewMissingExtraHours  
Request type: GET   

##### Response  
{
    "result": {  
        "MissingHours_minutes": {  
            "hours": 2,  
            "mins": 32,  
            "secs": 0  
        }  
    }  
}  


#### View Updated Salary of a certain member (in case of HR or of myself in case no memberId provided in the request body)  

##### Request  
Functionality: get updated salary  
Route: /member/getUpdatedSalary  
Request type: POST     
Request Body: 
{  
    "memberId":"5fe58ff75bcf4b2480d87e14"  (optional)  
}  

##### Response  
{  
    "Salary": 5000,  
    "salaryDeducted": 0,  
    "result": 5000  
}  
  



### 3 HR Functionalities

#### View Missing Hours or days of a staff Member  

##### Request  
Functionality:#### View Missing Hours or days of a staff Member    
Route: /member/viewMissingDaysHoursHR      
Request type: POST     
{  
    "memberId":"5fe58ff75bcf4b2480d87e14"  
}  

##### Response  
{
    "result": {
        "MissingHours_minutes": {
            "hours": 0,
            "mins": 0,
            "secs": 0
        },
        "MissingDays": 10
    }
}



#### Add location

Functionality: add location to the system  
Route: /room/addRoom  
Request type: POST  
Request Body: {  
    "name":"c6-225",  
    "capacity":5,  
    "type":"office"  
}  
  
##### Response  
 {  
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
  
##### Response  
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

##### Response  
{  
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

##### Response  
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

##### Response  
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

##### Response  
 {  
    "message": "Department added successfully"  
}  

#### Update Department
Functionality: update Department to the system  
Route: /department/updateDepartment    
Request type: PUT  
Request Body: {  
    "id":"5fe511b3b50be6254400e78d",  
    "name":"dep 1", (optional)  
    "faculty":"5fe511b3b50be6254400e78d" (optional)  
}  

##### Response  
{  
    "message": "Department updated"  
}  

#### Delete Department
Functionality: delete Department from the system  
Route: /department/deleteDepartment  
Request type: DELETE  
Request Body:{  
    "id":"5fe512b25883fe25184a1e52"  
}  

##### Response  
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

##### Response  
 {  
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

##### Response  
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

##### Response  
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

##### Response  
 {  
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

##### Response  
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

##### Response  
{  
    "message": "Member Deleted Successfully"  
}  

###### NOTE: If you want to filter, both month and year are required  

#### View Staff Member Attendance Records
Functionality: view staff members attendance records
Route: /attendance/viewMemberAttendance  
Request type: POST    
Request Body:  {  
    "memberId":"5fe505f40c620c07989655c0",  
    "month":12,  (optional)
    "year":"2020"  (optional)
}   

##### Response  
{  
    "data": [  
        {  
            "_id": "5fe559a6a8cde83ba4088e21",  
            "type": "signin",  
            "date": "2020-12-25T05:16:54.549Z",  
            "member": "5fe505f40c620c07989655c0",  
            "__v": 0  
        },  
        {  
            "_id": "5fe559afa8cde83ba4088e22",  
            "type": "signout",  
            "date": "2020-12-25T05:17:03.284Z",  
            "member": "5fe505f40c620c07989655c0",  
            "__v": 0  
        }  
    ]  
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

##### Response   
  
{  
    "message": "Member Updated Successfully"  
}  


#### Add Missing Sign  
Functionality: add missing signin or signout  
Route: /member/addMissingSign  
Request type: POST  
Request Body:  
{  
    "memberId":"5fe526cc4a96390450b26521",  
    "date":"2020-12-24",  
    "time":"15:50",  
    "type":"signin"  
}  
  
##### Response  
{  
    "message": "Missing sign added successfully"  
}  




### 4.1 HOD Functionalities  

#### Assign Instructor To Course

##### Request
Functionality: Assign Instructor to course in his/her department  
Route: /course/assignCourseInstructor  
Request type: POST  
Request Body: {
    "courseId":"5fe520f663ac6d27acba1f3c",
    "instructorId":"5fe582d3b0c0e32214dd0c0b"
}

  
##### Response  
{
    "message": "Instuctor Assigned To Course Successfully"
}


#### Update Assign Instructor TO Course

##### Request
Functionality: Update Instructor Assignment to course in his/her department    
Route:/course/updateCourseInstructor  
Request type: PUT  
Request Body: {  
    "courseAssignmentId":"5fe584f81612f542b0c115b0",  
    "newInstructorId":"5fe582d3b0c0e32214dd0c0b"  
}  

  
##### Response  
{  
    "message": "Instuctor updated from Course Successfully"  
}  


#### Delete Instructor From Course

##### Request
Functionality: Delete Instructor Assignment from course in his/her department    
Route: /course/deleteCourseInstructor
Request type: DELETE   
Request Body:{  
    "courseAssignmentId":"5fe584f81612f542b0c115b0"  
}  

  
##### Response    
{  
    "message": "Instuctor removed from Course Successfully"  
}  


#### View All Staff Per Course

##### Request
Functionality: view staff members per course in his/her department    
Route: /course/viewMemberInCourseHOD  
Request type: POST   
Request Body: {  
    "courseId":"5fe520f663ac6d27acba1f3c"  
}  

  
##### Response    
[
    {  
        "_id": "5fe58fb85bcf4b2480d87e13",  
        "member": {  
            "_id": "5fe582d3b0c0e32214dd0c0b",  
            "name": "john",  
            "email": "instructor@guc.com",  
            "salary": 5000,  
            "office": "5fe5262a4a96390450b26520",  
            "department": "5fe520c563ac6d27acba1f3b",  
            "dayoff": "monday",  
            "type": "instructor",  
            "birthdate": "1999-05-08T21:00:00.000Z",  
            "gender": "male",  
            "password": "$2a$10$yYGPeH89hTyAbZI0boOBh.HQ8pn/S6EqmSqp0Ul8yfAEhzKFgfYL.",  
            "activated": true,  
            "customId": "ac-4",  
            "dateCreated": "2020-12-25T08:12:35.247Z",  
            "annualBalanceTaken": 0,  
            "accidentalDaysTaken": 0,  
            "__v": 0,  
            "id": "5fe582d3b0c0e32214dd0c0b"  
        }  
    },  
    {  
        "_id": "5fe5907c5bcf4b2480d87e18",  
        "member": {  
            "_id": "5fe5906a5bcf4b2480d87e17",  
            "name": "john",  
            "email": "instructor3@guc.com",  
            "salary": 5000,  
            "office": "5fe5262a4a96390450b26520",  
            "department": "5fe520c563ac6d27acba1f3b",  
            "dayoff": "monday",  
            "type": "instructor",  
            "birthdate": "1999-05-08T21:00:00.000Z",  
            "gender": "male",  
            "password": "$2a$10$eIcVt/I5vhxo2g0K6.o9tedgTM/zNBH/YlUU9Oal.sgINUxw.hyaO",  
            "activated": true,  
            "customId": "ac-9",  
            "dateCreated": "2020-12-25T09:10:34.992Z",  
            "annualBalanceTaken": 0,  
            "accidentalDaysTaken": 0,  
            "__v": 0,  
            "id": "5fe5906a5bcf4b2480d87e17"  
        }  
    }  
]  



#### View All Staff In Department  

##### Request  
Functionality: view staff members in his/her department    
Route: /department/viewMemberInDepartment   
Request type: GET  
  
##### Response    

{
    "_id": "5fe58294b0c0e32214dd0c0a",  
    "department": {  
        "_id": "5fe520c563ac6d27acba1f3b",  
        "membersPerDepartment": [  
            {  
                "_id": "5fe582d3b0c0e32214dd0c0b",  
                "name": "john",  
                "email": "instructor@guc.com",  
                "salary": 5000,  
                "office": "5fe5262a4a96390450b26520",  
                "department": "5fe520c563ac6d27acba1f3b",  
                "dayoff": "monday",  
                "type": "instructor",  
                "birthdate": "1999-05-08T21:00:00.000Z",  
                "gender": "male",  
                "password": "$2a$10$yYGPeH89hTyAbZI0boOBh.HQ8pn/S6EqmSqp0Ul8yfAEhzKFgfYL.",  
                "activated": true,  
                "customId": "ac-4",  
                "dateCreated": "2020-12-25T08:12:35.247Z",  
                "annualBalanceTaken": 0,  
                "accidentalDaysTaken": 0,  
                "__v": 0,  
                "id": "5fe582d3b0c0e32214dd0c0b"  
            },  
            {  
                "_id": "5fe5906a5bcf4b2480d87e17",  
                "name": "john",  
                "email": "instructor3@guc.com",  
                "salary": 5000,  
                "office": "5fe5262a4a96390450b26520",  
                "department": "5fe520c563ac6d27acba1f3b",  
                "dayoff": "monday",  
                "type": "instructor",  
                "birthdate": "1999-05-08T21:00:00.000Z",  
                "gender": "male",  
                "password": "$2a$10$eIcVt/I5vhxo2g0K6.o9tedgTM/zNBH/YlUU9Oal.sgINUxw.hyaO",  
                "activated": true,  
                "customId": "ac-9",  
                "dateCreated": "2020-12-25T09:10:34.992Z",  
                "annualBalanceTaken": 0,  
                "accidentalDaysTaken": 0,  
                "__v": 0,  
                "id": "5fe5906a5bcf4b2480d87e17"  
            }  
        ],  
        "id": "5fe520c563ac6d27acba1f3b"  
    },  
    "id": "5fe58294b0c0e32214dd0c0a"  
}  


#### View All Staff Dayoff In Department  

##### Request  
Functionality: view staff members dayoff in his/her department    
Route: /department/viewAllMember_dayoff_InDepartment  
Request type: GET  
  
##### Response    
[  
    {  
        "_id": "5fe582d3b0c0e32214dd0c0b",  
        "name": "john",  
        "dayoff": "monday"  
    },  
    {  
        "_id": "5fe5906a5bcf4b2480d87e17",  
        "name": "john",  
        "dayoff": "monday"  
    }  
]  



#### View Single Member Dayoff In Department  

##### Request  
Functionality: view one member dayoff in his/her department    
Route: /department/viewMember_dayoff_InDepartment  
Request type: POST    
Request body: 
{  
    "memberId":"5fe58ff75bcf4b2480d87e14"  
}  

##### Response    
{  
    "_id": "5fe58ff75bcf4b2480d87e14",  
    "name": "john",  
    "dayoff": "monday"  
}  


#### View Coverage of courses In Department  

##### Request  
Functionality: view coverage of courses in his/her department    
Route: /course/viewCourseCoverageHOD  
Request type: GET      

##### Response    
[  
    {  
        "courseName": "csen606",  
        "Id": "5fe520f663ac6d27acba1f3c",  
        "Coverage": 0.125  
    }  
] 


#### View Coverage of one course In Department  

##### Request  
Functionality: view coverage of one course in his/her department    
Route: /course/viewOneCourseCoverageHOD    
Request type: POST  
Request body: 
{  
    "courseId":"5fe596ddd845793440cc82a5"  
}  

##### Response    

0.25 



#### View Teaching Assignment of one course in Department  

##### Request  
Functionality: view teaching assignments of one course in his/her department    
Route: /course/viewMemberSlotsInCourse  
Request type: POST  
Request body: 
{  
    "courseId":"5fe596ddd845793440cc82a5"  
}  

##### Response    

[  
    {  
        "_id": "5fe606e8f7c75030509afe32",  
        "member": {  
            "_id": "5fe599d3d845793440cc82a6",  
            "schedule": [],  
            "id": "5fe599d3d845793440cc82a6"  
        }  
    },  
    {  
        "_id": "5fe60772f7c75030509afe33",  
        "member": {  
            "_id": "5fe59aaed845793440cc82a9",  
            "schedule": [  
                {  
                    "_id": "5fe5a6575374372c6c4f2467",  
                    "course": "5fe596ddd845793440cc82a5",  
                    "slot": 3,  
                    "day": "monday",  
                    "room": "5fe526244a96390450b2651f",  
                    "__v": 0,  
                    "member": "5fe59aaed845793440cc82a9",  
                    "id": "5fe5a6575374372c6c4f2467"  
                },  
                {  
                    "_id": "5fe61150d9e78af967a2757d",  
                    "course": "5fe596ddd845793440cc82a5",  
                    "slot": 2,  
                    "day": "monday",  
                    "room": "5fe526244a96390450b2651f",  
                    "__v": 0,  
                    "member": "5fe59aaed845793440cc82a9",  
                    "id": "5fe61150d9e78af967a2757d"  
                }  
            ],  
            "id": "5fe59aaed845793440cc82a9"  
        }  
    }  
]  



 #### Accept ChangeDayOff Request   

##### Request  
Functionality: Accept Change Day Off Request
Route: /request/acceptDayOff  
Request type: POST          
Request Body:  
{  
    "requestId":"5fe5bbfe6076e031402cf891"  
}    

##### Response    
{  
    "message": "Request accepted anad DayOff updated successfully"  
}  


 #### Reject ChangeDayOff Request   

##### Request  
Functionality: Reject Change Day Off Request
Route: /request/rejectDayOff    
Request type: POST          
Request Body:  
{  
    "requestId":"5fe5bbfe6076e031402cf891"  
}    

##### Response    
{
    "message": "Request rejected"
}

 #### Accept Annual Leave Request   

##### Request  
Functionality: Accept Annual Leave Request  
Route: /request/acceptAnnualLeaveRequest  
Request type: POST          
Request Body:  
{  
    "requestId":"5fe5bbfe6076e031402cf891"  (annual leave request Id from annualLeaveRequets collection)  
}     

##### Response     
{  
    "message": "Request Accepted Successfully"  
}  


 #### Reject Annual Leave Request    

##### Request  
Functionality: Reject Annual Leave Request  
Route: /request/rejectAnnualLeaveRequest  
Request type: POST          
Request Body:  
    {  
        "requestId":"5fe62a4fa79c9234fc5b3013"  
    }  
##### Response      
{  
    "message": "Request is Rejected Successfully"  
}  

 #### Accept Sick Leave Request   

##### Request  
Functionality: Accept Sick Leave Request  
Route: /request/acceptSickLeave  
Request type: POST          
Request Body:  
{  
    "requestId":"5fe5bbfe6076e031402cf891"  (sick leave request Id from sickLeaveRequests collection)  
}     

##### Response     
{
    "message": "Request accepetd"
} 


 #### Reject Sick Leave Request    

##### Request  
Functionality: Reject Sick Leave Request  
Route: /request/rejectSickLeave  
Request type: POST      
Request Body:  
      {
        "requestId":"5fe62e5c7a5f973d7c72e70d" (sick leave request Id from sickLeaveRequests collection)    
    }
##### Response        
{  
    "message": "Request rejected"  
}  


 #### Accept Maternity Leave Request   

##### Request  
Functionality: Accept Sick Leave Request   
Route: /request/acceptMaternityLeave   
Request type: POST          
Request Body:  
{  
    "requestId":"5fe5bbfe6076e031402cf891"  (maternity leave request Id from maternityLeaveRequests collection)  
}     

##### Response     
{
    "message": "Request accepetd"
} 


 #### Reject Maternity Leave Request    

##### Request  
Functionality: Reject Maternity Leave Request  
Route: /request/rejectMaternityLeave  
Request type: POST      
Request Body:  
      {
        "requestId":"5fe62e5c7a5f973d7c72e70d" (maternity leave request Id from maternityLeaveRequests collection)    
    }
##### Response        
{  
    "message": "Request rejected"  
}  


 #### Accept Compensation Leave Request   

##### Request  
Functionality: Accept Compensation Leave Request   
Route: /request/acceptCompensationLeaveRequest   
Request type: POST          
Request Body:  
{  
    "requestId":"5fe5bbfe6076e031402cf891"  (maternity leave request Id from maternityLeaveRequests collection)  
}     

##### Response     
{
    "message": "Compensation Request accepetd"
}

 #### Reject Compensation Leave Request    

##### Request  
Functionality: Reject Compensation Leave Request  
Route: /request/rejectCompensationLeaveRequest  
Request type: POST      
Request Body:  
     
    {   
        "requestId":"5fe641939b02d34fc88892cf"  (compensation id from compensationLeaverequests collection)  
    }  

##### Response        
{  
    "message": "Request rejected"  
}  


 #### Accept Accidental Leave Request   

##### Request  
Functionality: Accept Accidental Leave Request    
Route: /request/accidentalAcceptRequest     
Request type: POST          
Request Body:  
{  
    "requestId":"5fe5bbfe6076e031402cf891"  (maternity leave request Id from maternityLeaveRequests collection)  
}     

##### Response      
{  
    "message": "succefully Accept the request",  
    "accidentalLeavesYouUsed": 1,  
    "annualBalance": 1.5  
}  

 #### Reject Accidental Leave Request    

##### Request  
Functionality: Reject Accidental Leave Request  
Route: /request/accidentalRejectRequest  
Request type: POST      
Request Body:  
    {   
        "requestId":"5fe641939b02d34fc88892cf"  (accidental id from accidentalRequests collection)  
    }  
##### Response        
{  
    "message": "succefully reject the request"  
}  



#### View All Requests In Department

#### Routes to test: (ALL Routes are POST)
Route: /request/viewChangeDayOffRequestsInDep   



##### Example Request  
Functionality: view all requests 
Route: /request/viewChangeDayOffRequestsInDep  
Request type: POST   

Route: /request/viewChangeDayOffRequestsInDep  
Request type: POST   


Route: /request/viewAnnualRequestsInDep  
Request type: POST   


Route: /request/viewAccidentalRequestsInDep  
Request type: POST   


Route: /request/viewSickRequestsInDep  
Request type: POST   

Route: /request/viewMaternityRequestsInDep  
Request type: POST   



Request Body: 

{  
    "status":"accept"  
}  

##### Example Response    
{
    "data": [  
        {  
            "_id": "5fe64cad8ca860c2ec8e936a",  
            "from": "2020-12-26T00:00:00.000Z",  
            "to": "2020-12-28T00:00:00.000Z",  
            "status": "accept",  
            "dateSubmitted": "2020-12-25T18:07:11.685Z",  
            "member": {  
                "_id": "5fe585d21612f542b0c115b1",  
                "name": "john",  
                "email": "hod2@guc.com",  
                "salary": 5000,  
                "office": "5fe5262a4a96390450b26520",  
                "department": "5fe521c2118e283b186235c6",  
                "dayoff": "monday",  
                "type": "head of department",  
                "birthdate": "1999-05-08T21:00:00.000Z",  
                "gender": "male",  
                "password": "$2a$10$HoiS6yWHVEhcW/Bup1kqK.LQxFnJ8R8O8/wPeOPbFwrjEqHp6nKfu",  
                "activated": true,  
                "customId": "ac-5",  
                "dateCreated": "2020-12-25T08:25:22.242Z",  
                "annualBalanceTaken": 0,  
                "accidentalDaysTaken": 0,  
                "__v": 0,  
                "id": "5fe585d21612f542b0c115b1"  
            },  
            "__v": 0  
        }  
    ]  
}  



### 4.2 Instructor Functionalities

#### Assign Academic Member To Course

##### Request  
Functionality: add teaching assistants to courses (not to slots)
Route: /member/assignTaToCourse  
Request type: POST  
Request Body:
{
    "member":"5fe590435bcf4b2480d87e15",
    "course":"5fe520f663ac6d27acba1f3c"
}

##### Response    
{
    "message": "Course Assignment created successfully"
}


#### Update TA Assignment To Course

##### Request  
Functionality: update teaching assistants to courses (not to slots)
Route: /member/updateTaAssignment   
Request type: PUT  
Request Body:
{  
    "assignmentId": "5fe59a35d845793440cc82a8",  (From CourseAssignment Model)  
    "newMemberId":"5fe58ff75bcf4b2480d87e14"  
}  

##### Response    
{  
    "message": "Course Assignment Updated Successfully"  
}  


#### Remove TA Assignment From Course

##### Request  
Functionality: remove teaching assistants from courses (not to slots)
Route: /member/removeTaAssignment    
Request type: DELETE    
Request Body:
{
    "assignmentId": "5fe59a35d845793440cc82a8"
}

##### Response    
{
    "message": "Assignment Removed Successfully"
}

#### AssignMember to Slots  

##### Request  
Functionality: assign member to created slots    
Route: /slotAssignment/assignSlotToMember   
Request type: POST      
Request Body:  
{  
    "assignmentId":"5fe5a63a5374372c6c4f2465",  (slot assignment id from slotAssignment model)  
    "memberId":"5fe582d3b0c0e32214dd0c0b"  
}  

##### Response    
{  
    "message": "Member Assigned Successfully"  
}   
  


#### Update Members Assignments to Slots  

##### Request  
Functionality: update member to slots      
Route: /slotAssignment/updateSlotMemberAssign     
Request type: PUT      
Request Body:  
{  
    "assignmentId":"5fe5a6495374372c6c4f2466",  
    "newMemberId":"5fe582d3b0c0e32214dd0c0b"  
}  

##### Response    
{  
    "message": "Slot Assignment Updated Successfully"  
}   
 
 #### Delete Members Assignments from Slots  

##### Request  
Functionality: delete member from slots      
Route: /slotAssignment/deleteSlotMemberAssign      
Request type: DELETE        
Request Body:  
{
    "assignmentId":"5fe5a6495374372c6c4f2466"
} 

##### Response    
{
    "message": "Member removed from slot"
}


#### Assign Coordinator To Course  

##### Request  
Functionality: asign coordinator to course  
Route: /member/assignCoordinatorToCourse  
Request type: POST    
Request Body:
{  
    "member":"5fe590435bcf4b2480d87e15",  
    "course":"5fe520f663ac6d27acba1f3c"  
}  

##### Response    
{  
    "message": "Course Assignment created successfully"  
}  

#### View Course Coverage of courses

##### Request  
Functionality: view course coverage he/she is assigned to  
Route: /course/viewCourseCoverageInstructor  
Request type: GET       

##### Response    
[  
    {  
        "courseName": "csen dep 3",  
        "Id": "5fe596ddd845793440cc82a5",  
        "Coverage": 0.25  
    }  
]  


#### View ths slot assignments

##### Request  
Functionality: view slot assignments in courses he/she is assigned to   
Route: /course/viewInstructorSlotsInCourse  
Request type: POST  
Request Body:  
{  
    "courseId":"5fe596ddd845793440cc82a5"   (optional)  
}  

##### Response    
[  
    {  
        "_id": "5fe606e8f7c75030509afe32",  
        "course": {  
            "_id": "5fe596ddd845793440cc82a5",  
            "name": "csen dep 3",  
            "slotsAssignments": [  
                {  
                    "_id": "5fe5a6575374372c6c4f2467",  
                    "course": "5fe596ddd845793440cc82a5",  
                    "slot": 3,  
                    "day": "monday",  
                    "room": "5fe526244a96390450b2651f",  
                    "__v": 0,  
                    "member": "5fe59aaed845793440cc82a9",  
                    "id": "5fe5a6575374372c6c4f2467"  
                },  
                {  
                    "_id": "5fe61150d9e78af967a2757d",  
                    "course": "5fe596ddd845793440cc82a5",  
                    "slot": 2,  
                    "day": "monday",  
                    "room": "5fe526244a96390450b2651f",  
                    "__v": 0,  
                    "member": "5fe59aaed845793440cc82a9",  
                    "id": "5fe61150d9e78af967a2757d"  
                }  
            ],  
            "id": "5fe596ddd845793440cc82a5"  
        }  
    }  
]   


#### View staff in instructor department  

##### Request  
Functionality: view all staff in instructor's department  
Route: /department/viewMemberInInstructorDepartment  
Request type: GET     

##### Response    
{  
    "_id": "5fe599d3d845793440cc82a6",  
    "department": {  
        "_id": "5fe521c2118e283b186235c6",  
        "membersPerDepartment": [  
            {  
                "_id": "5fe585d21612f542b0c115b1",  
                "name": "john",  
                "email": "hod2@guc.com",  
                "salary": 5000,  
                "office": "5fe5262a4a96390450b26520",  
                "department": "5fe521c2118e283b186235c6",  
                "dayoff": "monday",  
                "type": "head of department",  
                "birthdate": "1999-05-08T21:00:00.000Z",  
                "gender": "male",  
                "password": "$2a$10$HoiS6yWHVEhcW/Bup1kqK.LQxFnJ8R8O8/wPeOPbFwrjEqHp6nKfu",  
                "activated": true,  
                "customId": "ac-5",  
                "dateCreated": "2020-12-25T08:25:22.242Z",  
                "annualBalanceTaken": 0,  
                "accidentalDaysTaken": 0,  
                "__v": 0,  
                "id": "5fe585d21612f542b0c115b1"  
            },  
            {  
                "_id": "5fe599d3d845793440cc82a6",  
                "name": "john",  
                "email": "i2@guc.com",  
                "salary": 5000,  
                "office": "5fe5262a4a96390450b26520",  
                "department": "5fe521c2118e283b186235c6",  
                "dayoff": "monday",  
                "type": "instructor",  
                "birthdate": "1999-05-08T21:00:00.000Z",  
                "gender": "male",  
                "password": "$2a$10$gLJfGBqBkqXFQaOtHtY37e2ZhxTt09oz/WjFlHmlAly1yszSvOUFW",  
                "activated": true,  
                "customId": "ac-10",  
                "dateCreated": "2020-12-25T09:50:43.128Z",  
                "annualBalanceTaken": 0,  
                "accidentalDaysTaken": 0,  
                "__v": 0,  
                "id": "5fe599d3d845793440cc82a6"  
            },  
            {  
                "_id": "5fe599ebd845793440cc82a7",  
                "name": "john",  
                "email": "t2@guc.com",  
                "salary": 5000,  
                "office": "5fe5262a4a96390450b26520",  
                "department": "5fe521c2118e283b186235c6",  
                "dayoff": "monday",  
                "type": "instructor",  
                "birthdate": "1999-05-08T21:00:00.000Z",  
                "gender": "male",  
                "password": "$2a$10$5OtprwLUPKS4h633pQXYEeo.gPpB/3hJexmppHJC4b5uZ3Ac4CKCe",  
                "activated": true,  
                "customId": "ac-10",  
                "dateCreated": "2020-12-25T09:51:07.534Z",  
                "annualBalanceTaken": 0,  
                "accidentalDaysTaken": 0,  
                "__v": 0,  
                "id": "5fe599ebd845793440cc82a7"  
            },  
            {  
                "_id": "5fe59aaed845793440cc82a9",  
                "name": "john",  
                "email": "t3@guc.com",  
                "salary": 5000,  
                "office": "5fe5262a4a96390450b26520",  
                "department": "5fe521c2118e283b186235c6",  
                "dayoff": "monday",  
                "type": "instructor",  
                "birthdate": "1999-05-08T21:00:00.000Z",  
                "gender": "male",  
                "password": "$2a$10$k6Ka46XG2NTvIGceyrhs0.LS/S0npMb4Krbti6aOhgeHJbu0kvR/q",  
                "activated": true,  
                "customId": "ac-10",  
                "dateCreated": "2020-12-25T09:54:22.251Z",  
                "annualBalanceTaken": 0,  
                "accidentalDaysTaken": 0,  
                "__v": 0,  
                "id": "5fe59aaed845793440cc82a9"  
            }  
        ],  
        "id": "5fe521c2118e283b186235c6"  
    },  
    "id": "5fe599d3d845793440cc82a6"  
}  


#### View Members on same course as instructor 
##### Request  
Functionality: view all staff members in instructor's department   per course  
Route: /course/viewMemberInCourseInstructor  
Request type: POST      
Request Body:  
{  
    "courseId":"5fe596ddd845793440cc82a5"  
}    

##### Response    
[  
    {  
        "_id": "5fe606e8f7c75030509afe32",  
        "member": {  
            "_id": "5fe599d3d845793440cc82a6",  
            "name": "john",  
            "email": "i2@guc.com",  
            "salary": 5000,  
            "office": "5fe5262a4a96390450b26520",  
            "department": "5fe521c2118e283b186235c6",  
            "dayoff": "monday",  
            "type": "instructor",  
            "birthdate": "1999-05-08T21:00:00.000Z",  
            "gender": "male",  
            "password": "$2a$10$gLJfGBqBkqXFQaOtHtY37e2ZhxTt09oz/WjFlHmlAly1yszSvOUFW",  
            "activated": true,  
            "customId": "ac-10",  
            "dateCreated": "2020-12-25T09:50:43.128Z",  
            "annualBalanceTaken": 0,  
            "accidentalDaysTaken": 0,  
            "__v": 0,  
            "id": "5fe599d3d845793440cc82a6"  
        }  
    },  
    {  
        "_id": "5fe60772f7c75030509afe33",  
        "member": {  
            "_id": "5fe59aaed845793440cc82a9",  
            "name": "john",  
            "email": "t3@guc.com",  
            "salary": 5000,  
            "office": "5fe5262a4a96390450b26520",  
            "department": "5fe521c2118e283b186235c6",  
            "dayoff": "monday",  
            "type": "instructor",  
            "birthdate": "1999-05-08T21:00:00.000Z",  
            "gender": "male",  
            "password": "$2a$10$k6Ka46XG2NTvIGceyrhs0.LS/S0npMb4Krbti6aOhgeHJbu0kvR/q",  
            "activated": true,  
            "customId": "ac-10",  
            "dateCreated": "2020-12-25T09:54:22.251Z",  
            "annualBalanceTaken": 0,  
            "accidentalDaysTaken": 0,  
            "__v": 0,  
            "id": "5fe59aaed845793440cc82a9"  
        }  
    }  
]    



### 4.3 Coordinator Functionalities

{
    "courseId":"5fe520f663ac6d27acba1f3c"
}


#### View Slot Linking Requests  

##### Request  
Functionality: view slot linking requests
Route: /request/viewSlotLinking    
Request type: POST  
Request Body:
{  
    "courseId":"5fe520f663ac6d27acba1f3c"  
}  

##### Response    
{  
    "data": [  
        {  
            "_id": "5fe5cb64f7c75030509afe30",  
            "slot": {  
                "_id": "5fe5a6495374372c6c4f2466",  
                "slot": 1,  
                "day": "sunday",  
                "id": "5fe5a6495374372c6c4f2466"  
            },  
            "member": {  
                "_id": "5fe582d3b0c0e32214dd0c0b",  
                "name": "john",  
                "email": "instructor@guc.com",  
                "type": "instructor",  
                "id": "5fe582d3b0c0e32214dd0c0b"  
            },  
            "status": "pending",  
            "__v": 0,  
            "id": "5fe5cb64f7c75030509afe30"  
        }  
    ]  
}    


#### Accept Slot Linking Requests  

##### Request  
Functionality: Accept slot linking requests
Route: /request/acceptSlotLinking  
Request type: POST  
Request Body:  
{  
    "requestId":"5fe6094df7c75030509afe35"  (slot linkning request Id from slotLinkningRequestModel)  
}  

##### Response      
{  
    "message": "Request was accepted successfully"  
}  

#### Reject Slot Linking Requests  

##### Request  
Functionality: Reject slot linking requests  
Route: /request/rejectSlotLinking  
Request type: POST  
Request Body:  
{  
    "message": "Request is rejected successfully"  
}  

##### Response      
{  
    "message": "Request was accepted successfully"  
}  

#### Add Course Slots  

##### Request  
Functionality: add course slots    
Route: /slotAssignment/addSlot  
Request type: POST  
Request Body:
{
    "room":"5fe526244a96390450b2651f",
    "slot":"1",
    "course":"5fe520f663ac6d27acba1f3c",
    "day":"saturday",
    "type":"lab"
}

##### Response    
{  
    "message": "Slot Added Successfully to Course"  
}  
  
  
  
  
#### Update Course Slots  

##### Request  
Functionality: update course slots    
Route: /slotAssignment/updateSlot    
Request type: PUT  
Request Body:
{
    "assignmentId":"5fe5a346bd77723f8003fb8c",  (slot assignment id in slotAssignment Model)  
    "room":"5fe526244a96390450b2651f",  
    "slot":"3",  
    "course":"5fe520f663ac6d27acba1f3c",  
    "day":"saturday",  
    "type":"lab"  
}  

##### Response    
{  
    "message": "Slot Updated Successfully"  
}  


#### Delete Course Slots  

##### Request  
Functionality: delete course slots    
Route: /slotAssignment/deleteSlot   
Request type: DELETE    
Request Body:  
{  
    "assignmentId":"5fe5a346bd77723f8003fb8c"  (slot assignment id from slotAssignment model)
}  

##### Response    
{  
    "message": "Assignment Deleted successfully"  
}  





### 4.4 Academic Member Functionalities

#### View My Schedule (BOth arrays will appear and arranging them in A WEEK IS left to the FRONTEND )  

##### Request   
Functionality: view my schedule and replacements     
Route: /member/ViewScadule
Request type: GET   

##### Response    
{
    "Member": {
        "_id": "5fe590435bcf4b2480d87e15",  
        "schedule": [  
            {  
                "_id": "5fe5a6575374372c6c4f2467",  
                "course": "5fe520f663ac6d27acba1f3c",  
                "slot": 3,  
                "day": "monday",  
                "room": "5fe526244a96390450b2651f",  
                "__v": 0,  
                "member": "5fe590435bcf4b2480d87e15",  
                "id": "5fe5a6575374372c6c4f2467"  
            }  
        ],  
        "id": "5fe590435bcf4b2480d87e15"  
    },  
    "ScaduleReplacment": [  
        {  
            "_id": "5fe64840238dc45024133b6d",  
            "replacementMember": "5fe58ff75bcf4b2480d87e14",  
            "slot": "5fe5a6575374372c6c4f2467",  
            "dateOfReplacement": "2020-12-28T00:00:00.000Z",  
            "member": "5fe590435bcf4b2480d87e15",  
            "status": "accept",  
            "__v": 0  
        }  
    ]  
}  
  
#### ChangeDayOff Request   

##### Request  
Functionality: Change Day Off Request  
Route: /request/changeDayOff  
Request type: POST          
Request Body:  
{  
    "newDayOff":"wednesday",  
    "reason":"reason"  (Optional)  
}  

##### Response    
{  
    "message": "Change DayOff Request sent successfully"  
}  



#### Cancel ChangeDayOff Request   

##### Request  
Functionality: Cancel Change Day Off Request  
Route: /request/cancelChangeDayOffRequest  
Request type: POST          
Request Body:  
{  
    "requestId":"5fe5bb37ccd9c22214b21717"  
}    

##### Response    
{  
    "message": "Request Cancelled"  
}  



#### Send SLotLinking    

##### Request  
Functionality: send slot linking request to certain slot  
Route: /request/sendSlotLinking  
Request type: POST          
Request Body:  
{
    "slotId":"5fe5a63a5374372c6c4f2465"  (slot Assignment Id from slot assignment model)
} 

##### Response     

{  
    "message": "Slot Linking Request Sent Successfully!"  
}  


  
#### Cancel Slot Linking Requests  

##### Request  
Functionality: Cancel slot linking requests  
Route: /request/cancelSlotLinking   
Request type: POST   
Request Body:  
{  
    "requestId":"5fe6094df7c75030509afe35"  (slot linkning request Id from slotLinkningRequestModel)  
}  

##### Response      
{  
    "message": "Slot Linking Request is cancelled successfully"  
}   

#### Send Annual Leave Request  

##### Request  
Functionality: Send annual leave request  
Route: /request/sendAnnualLeaveRequest  
Request type: POST   
Request Body:  
    {  
        "from":"2020-12-26",  
        "to":"2020-12-28"  
    }   

##### Response   
{  
    "message": "Request Created Successfully"  
}  



#### Cancel Annual Leave Request  

##### Request  
Functionality: Cancel annual leave request  
Route: /request/cancelAnnualLeaveRequest  
Request type: POST   
Request Body:    
       {  
        "requestId":"5fe62ac8a79c9234fc5b3014"  (Annual Leave Request from annualLeaveRequests collection)  
    }   

##### Response   
{  
    "message": "Request Cancelled Successfully"  
}  


#### Send Sick Leave Request  

##### Request  
Functionality: Send sick leave request  
Route: /request/sickLeave  
Request type: POST   
Request Body:    
        {  
        "from":"2020-12-27",  
        "to":"2020-12-31",  
        "document":["googledriveURL","googledriveURL"]  
    }   
    
##### Response    
{  
    "message": "Sick Leave Request sent successfully"  
}   



#### Cancel Sick Leave Request  

##### Request  
Functionality: Cancel sick leave request    
Route: /request/cancelSickLeaveRequest  
Request type: POST   
Request Body:    
       {  
        "requestId":"5fe62ac8a79c9234fc5b3014"  (Sick Leave Request from sickLeaveRequests collection)  
    }   

##### Response   
{  
    "message": "Request Cancelled Successfully"  
}  


#### Send Maternity Leave Request  

##### Request  
Functionality: Send maternity leave request  
Route: /request/maternityLeave  
Request type: POST   
Request Body:    
        {  
        "from":"2020-12-27",  
        "to":"2020-12-31",  
        "document":["googledriveURL","googledriveURL"]  
    }   
    
##### Response    
{
    "message": "Maternity Leave Request sent successfully"
}  



#### Cancel Maternity Leave Request  

##### Request  
Functionality: Cancel maternity leave request    
Route: /request/cancelMaternityLeaveRequest  
Request type: POST   
Request Body:    
       {  
        "requestId":"5fe62ac8a79c9234fc5b3014"  (Maternity Leave Request from maternityLeaveRequests collection)  
    }   

##### Response    
{  
    "message": "Request Cancelled"  
}  
    


#### Send Accidental Leave Request  

##### Request  
Functionality: Send Accidental leave request  
Route: /request/accidentalLeaveRequest  
Request type: POST   
Request Body:    
  {   
        "absentDate":"2020-12-9",   
        "reason":"qwerty"  
}     
    
##### Response    
{  
    "message": "succefully make a request"  
}  



#### Cancel Accidental Leave Request  

##### Request  
Functionality: Cancel accidental leave request    
Route: /request/accidentalCancelRequest  
Request type: POST   
Request Body:    
     {  
        "requestId":"5fe63ed2322568458c888ec9"  (request id from accidentalLeaveRequests collection)  
}    

##### Response     
{  
    "message": "succefully Cancel the request"  
}   
    

#### Send Compensation Leave Request  

##### Request  
Functionality: Send Compensation leave request  
Route: /request/compensationLeaveRequest  
Request type: POST   
Request Body:    
  {  
        "absentDate":"2020-12-13",  
        "compensationDate":"2020-12-21",  
        "reason":"qwertyui"  
}    
    
##### Response    
{  
    "message": "Compensation Leave Sent Successfuly"  
}   


#### Send Replacement Request   

##### Request  
Functionality: Send Replacement leave request  
Route: /request/sendReplacementRequest  
Request type: POST   
Request Body:    
{  
        "replacementMemberId":"5fe58ff75bcf4b2480d87e14",  
        "slotId":"5fe5a6575374372c6c4f2467",  
        "dateOfReplacement":"2020-12-28"  
}  
    
##### Response    
{  
    "message": "Request sent successfully"  
}     

 

#### View All My Requests

#### Routes to test: (ALL Routes are POST)
Route: /request/viewMyAnnualRequests   



##### Example Request  
Functionality: view all requests 

Route: /request/viewMyAnnualRequests  
Request type: POST   

Route: /request/viewMyAccidentalRequests  
Request type: POST   


Route: /request/viewMySickRequests  
Request type: POST   


Route: /request/viewMyMaternityRequests  
Request type: POST   


Route: /request/viewMyCompensationRequests    
Request type: POST   

Request Body: 

{  
    "status":"accept"  
}  

##### Example Response    
{
    "data": [  
        {  
            "_id": "5fe64cad8ca860c2ec8e936a",  
            "from": "2020-12-26T00:00:00.000Z",  
            "to": "2020-12-28T00:00:00.000Z",  
            "status": "accept",  
            "dateSubmitted": "2020-12-25T18:07:11.685Z",  
            "member": {  
                "_id": "5fe585d21612f542b0c115b1",  
                "name": "john",  
                "email": "hod2@guc.com",  
                "salary": 5000,  
                "office": "5fe5262a4a96390450b26520",  
                "department": "5fe521c2118e283b186235c6",  
                "dayoff": "monday",  
                "type": "head of department",  
                "birthdate": "1999-05-08T21:00:00.000Z",  
                "gender": "male",  
                "password": "$2a$10$HoiS6yWHVEhcW/Bup1kqK.LQxFnJ8R8O8/wPeOPbFwrjEqHp6nKfu",  
                "activated": true,  
                "customId": "ac-5",  
                "dateCreated": "2020-12-25T08:25:22.242Z",  
                "annualBalanceTaken": 0,  
                "accidentalDaysTaken": 0,  
                "__v": 0,  
                "id": "5fe585d21612f542b0c115b1"  
            },  
            "__v": 0  
        }  
    ]  
}  

