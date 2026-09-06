# API Documentation - Exam Management System

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

Register a new user (student, instructor, or admin)

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student",
  "regNumber": "STU001",
  "classLevel": "<class_level_id>"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

### 2. Login
**POST** `/auth/login`

Login and receive JWT token

**Request Body:**
```json
{
  "email": "admin@exams.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@exams.com",
    "role": "admin"
  }
}
```

### 3. Get Current User
**GET** `/auth/me`

Get authenticated user information

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "student",
    "classLevel": {
      "_id": "507f1f77bcf86cd799439012",
      "levelName": "First Year",
      "levelCode": "Y1"
    }
  }
}
```

### 4. Logout
**POST** `/auth/logout`

Logout current user

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## 👨‍💼 Admin Endpoints

All admin endpoints require **admin role**

### 1. Get All Users
**GET** `/admin/users`

Retrieve all users with optional filtering

**Query Parameters:**
- `role` - Filter by role (admin, instructor, student)
- `isActive` - Filter by active status (true/false)

**Example:**
```
GET /admin/users?role=student&isActive=true
```

**Response:**
```json
{
  "success": true,
  "count": 4,
  "users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "Michael",
      "lastName": "Johnson",
      "email": "michael@student.com",
      "role": "student",
      "regNumber": "STU001",
      "isActive": true
    }
  ]
}
```

### 2. Create Class Level
**POST** `/admin/class-levels`

**Request Body:**
```json
{
  "levelName": "Fourth Year",
  "levelCode": "Y4",
  "description": "Fourth Year Students",
  "academicYear": "2024/2025"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Class level created",
  "classLevel": {
    "_id": "507f1f77bcf86cd799439013",
    "levelName": "Fourth Year",
    "levelCode": "Y4",
    "description": "Fourth Year Students",
    "academicYear": "2024/2025",
    "totalStudents": 0,
    "isActive": true
  }
}
```

### 3. Get All Class Levels
**GET** `/admin/class-levels`

**Response:**
```json
{
  "success": true,
  "count": 3,
  "classLevels": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "levelName": "First Year",
      "levelCode": "Y1",
      "academicYear": "2024/2025",
      "totalStudents": 45
    }
  ]
}
```

### 4. Update Class Level
**PUT** `/admin/class-levels/:id`

**Request Body:**
```json
{
  "totalStudents": 50,
  "isActive": true
}
```

### 5. Delete Class Level
**DELETE** `/admin/class-levels/:id`

### 6. Update User Role
**PUT** `/admin/users/:id/role`

**Request Body:**
```json
{
  "role": "instructor"
}
```

### 7. Deactivate User
**PUT** `/admin/users/:id/deactivate`

### 8. Get System Statistics
**GET** `/admin/statistics`

**Response:**
```json
{
  "success": true,
  "statistics": {
    "totalUsers": 10,
    "totalStudents": 6,
    "totalInstructors": 2,
    "totalCourses": 5,
    "totalClassLevels": 3
  }
}
```

---

## 📚 Course Endpoints

### 1. Create Course
**POST** `/courses`

Requires: **admin or instructor role**

**Request Body:**
```json
{
  "courseCode": "CS102",
  "courseName": "Database Management",
  "description": "Learn database design and SQL",
  "credits": 4,
  "classLevels": ["<class_level_id>"],
  "department": "Computer Science",
  "semester": "First",
  "academicYear": "2024/2025",
  "caWeight": 30,
  "examWeight": 70
}
```

**Response:**
```json
{
  "success": true,
  "message": "Course created",
  "course": {
    "_id": "507f1f77bcf86cd799439014",
    "courseCode": "CS102",
    "courseName": "Database Management",
    "credits": 4,
    "instructor": { "_id": "...", "firstName": "Dr. John" },
    "caWeight": 30,
    "examWeight": 70
  }
}
```

### 2. Get All Courses
**GET** `/courses`

**Query Parameters:**
- `academicYear` - Filter by academic year
- `semester` - Filter by semester

**Example:**
```
GET /courses?academicYear=2024/2025&semester=First
```

### 3. Get Course by ID
**GET** `/courses/:id`

### 4. Update Course
**PUT** `/courses/:id`

Requires: **admin or course instructor**

**Request Body:**
```json
{
  "courseName": "Advanced Database Management",
  "credits": 5
}
```

### 5. Delete Course
**DELETE** `/courses/:id`

Requires: **admin role**

### 6. Get Instructor's Courses
**GET** `/courses/instructor/:instructorId`

---

## 📝 Exam Endpoints

### 1. Create Exam
**POST** `/exams`

Requires: **admin or instructor role**

**Request Body:**
```json
{
  "examName": "Final Exam",
  "course": "<course_id>",
  "examType": "Final",
  "totalMarks": 100,
  "passingMarks": 50,
  "examDate": "2024-12-20T10:00:00Z",
  "description": "Final semester examination",
  "instructions": "Answer all questions"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Exam created",
  "exam": {
    "_id": "507f1f77bcf86cd799439015",
    "examName": "Final Exam",
    "course": { "_id": "...", "courseName": "CS102" },
    "examType": "Final",
    "totalMarks": 100,
    "passingMarks": 50
  }
}
```

### 2. Get All Exams
**GET** `/exams`

**Query Parameters:**
- `course` - Filter by course ID
- `examType` - Filter by exam type (CA, Quiz, Midterm, Final)

### 3. Get Exam by ID
**GET** `/exams/:id`

### 4. Update Exam
**PUT** `/exams/:id`

### 5. Publish Exam Results
**PUT** `/exams/:id/publish`

Makes results visible to students

**Response:**
```json
{
  "success": true,
  "message": "Exam results published",
  "exam": { ... }
}
```

### 6. Record CA Marks
**POST** `/exams/ca/record`

Requires: **admin or instructor role**

**Request Body:**
```json
{
  "student": "<student_id>",
  "course": "<course_id>",
  "assignment1": 9,
  "assignment2": 8,
  "quiz1": 5,
  "quiz2": 4,
  "classParticipation": 9
}
```

**Response:**
```json
{
  "success": true,
  "message": "CA marks recorded",
  "caMark": {
    "_id": "507f1f77bcf86cd799439016",
    "student": { "_id": "...", "firstName": "Michael" },
    "course": { "_id": "...", "courseCode": "CS102" },
    "assignment1": 9,
    "assignment2": 8,
    "quiz1": 5,
    "quiz2": 4,
    "classParticipation": 9,
    "totalCA": 35
  }
}
```

### 7. Get CA Marks
**GET** `/exams/ca/:studentId/:courseId`

---

## 📊 Results Endpoints

### 1. Submit Exam Result
**POST** `/results`

Requires: **admin or instructor role**

**Request Body:**
```json
{
  "student": "<student_id>",
  "exam": "<exam_id>",
  "course": "<course_id>",
  "marksObtained": 85,
  "totalMarks": 100
}
```

**Response:**
```json
{
  "success": true,
  "message": "Result submitted",
  "result": {
    "_id": "507f1f77bcf86cd799439017",
    "student": { "_id": "...", "firstName": "Michael" },
    "exam": { "_id": "...", "examName": "Final Exam" },
    "marksObtained": 85,
    "totalMarks": 100,
    "percentage": 85,
    "grade": "B",
    "isPassed": true,
    "status": "graded"
  }
}
```

### 2. Get Student Results
**GET** `/results/student/:studentId`

**Response:**
```json
{
  "success": true,
  "count": 3,
  "results": [ ... ]
}
```

### 3. Get Course Results
**GET** `/results/course/:courseId`

Requires: **admin or instructor role**

Gets all results for a specific course

### 4. Get Exam Results
**GET** `/results/exam/:examId`

Requires: **admin or instructor role**

Gets all results for a specific exam (sorted by marks)

### 5. Calculate Final Marks
**GET** `/results/final/:studentId/:courseId`

Calculates combined CA + Exam mark based on course weights

**Response:**
```json
{
  "success": true,
  "finalMark": "82.50",
  "caMarks": {
    "_id": "...",
    "totalCA": 35,
    "assignment1": 9,
    "assignment2": 8,
    "quiz1": 5,
    "quiz2": 4,
    "classParticipation": 9
  },
  "examResults": [ ... ]
}
```

### 6. Update Result
**PUT** `/results/:id`

Requires: **admin or instructor role**

**Request Body:**
```json
{
  "marksObtained": 88,
  "remarks": "Well done!"
}
```

---

## 📄 Report Endpoints

### 1. Generate Student Report (PDF)
**GET** `/reports/student/:studentId/course/:courseId/pdf`

Requires: **authentication**

Generates a downloadable PDF report containing:
- Student information
- Course details
- CA marks breakdown
- Exam results
- Final grades

**Example:**
```
GET /reports/student/507f1f77bcf86cd799439011/course/507f1f77bcf86cd799439014/pdf
Authorization: Bearer <token>
```

**Response:** PDF file download

### 2. Generate Course Results (Excel)
**GET** `/reports/course/:courseId/excel`

Requires: **admin or instructor role**

Generates an Excel spreadsheet with all student results for a course:
- Student names and registration numbers
- Marks obtained vs total
- Percentages and grades
- Pass/fail status

**Example:**
```
GET /reports/course/507f1f77bcf86cd799439014/excel
```

**Response:** Excel file download

### 3. Get Course Summary Statistics
**GET** `/reports/course/:courseId/summary`

Requires: **admin or instructor role**

**Response:**
```json
{
  "success": true,
  "summary": {
    "totalStudents": 45,
    "passedStudents": 38,
    "failedStudents": 7,
    "passPercentage": "84.44",
    "averageMarks": "76.50",
    "highestMarks": 98,
    "lowestMarks": 42
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Invalid input data"
}
```

### 401 Unauthorized
```json
{
  "message": "No token provided" or "Invalid token"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "status": 500,
  "message": "Internal Server Error"
}
```

---

## Rate Limiting & Best Practices

1. **Token Expiration**: Tokens expire after 7 days by default
2. **Re-authentication**: Get a new token by logging in again
3. **Concurrent Requests**: No hard limit, but recommended max 100/sec
4. **Data Validation**: All inputs are validated server-side
5. **CORS**: Enabled for all origins in development

---

## Common Use Cases

### Create a Complete Course Setup
1. Create class level (`POST /admin/class-levels`)
2. Create course (`POST /courses`)
3. Create exam (`POST /exams`)
4. Record CA marks (`POST /exams/ca/record`)
5. Submit exam results (`POST /results`)
6. Generate report (`GET /reports/student/.../pdf`)

### Student Workflow
1. Login (`POST /auth/login`)
2. View own results (`GET /results/student/{id}`)
3. Check final marks (`GET /results/final/{id}/{courseId}`)
4. Download report (`GET /reports/student/.../pdf`)

### Instructor Workflow
1. Login (`POST /auth/login`)
2. View courses (`GET /courses/instructor/{id}`)
3. Record CA marks (`POST /exams/ca/record`)
4. Submit exam results (`POST /results`)
5. Export course results (`GET /reports/course/.../excel`)
6. View statistics (`GET /reports/course/.../summary`)

### Admin Workflow
1. Login (`POST /auth/login`)
2. View all users (`GET /admin/users`)
3. Create class levels (`POST /admin/class-levels`)
4. Manage users (`PUT /admin/users/{id}/role`)
5. View statistics (`GET /admin/statistics`)

