# Testing Guide - Exam Management System

## 🧪 Testing the System

This guide provides step-by-step instructions to test all features of the Exam Management System.

## Prerequisites

- Postman or similar API testing tool
- System running (`npm run dev`)
- Sample data seeded (`npm run seed`)

## 1. Authentication Testing

### Test Login with Admin Account

**Endpoint:** `POST http://localhost:5000/api/auth/login`

**Request Body:**
```json
{
  "email": "admin@exams.com",
  "password": "admin123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "firstName": "Admin",
    "role": "admin"
  }
}
```

**Save the token** for subsequent requests.

### Test Get Current User

**Endpoint:** `GET http://localhost:5000/api/auth/me`

**Headers:**
```
Authorization: Bearer <your_token_here>
```

**Expected Response:** 200 OK with user details

## 2. Admin Operations Testing

### Test Get All Users

**Endpoint:** `GET http://localhost:5000/api/admin/users`

**Expected Response:**
```json
{
  "success": true,
  "count": 10,
  "users": [...]
}
```

### Test Get Statistics

**Endpoint:** `GET http://localhost:5000/api/admin/statistics`

**Expected Response:**
```json
{
  "success": true,
  "statistics": {
    "totalUsers": 10,
    "totalStudents": 6,
    "totalInstructors": 2,
    "totalCourses": 3,
    "totalClassLevels": 3
  }
}
```

### Test Create Class Level

**Endpoint:** `POST http://localhost:5000/api/admin/class-levels`

**Request Body:**
```json
{
  "levelName": "Final Year",
  "levelCode": "Y4",
  "description": "Final Year Students",
  "academicYear": "2024/2025"
}
```

**Expected Response:** 201 Created

## 3. Course Management Testing

### Test Create Course

**Endpoint:** `POST http://localhost:5000/api/courses`

**Request Body:**
```json
{
  "courseCode": "PHYS101",
  "courseName": "Physics Fundamentals",
  "description": "Introduction to Physics",
  "credits": 4,
  "classLevels": ["<class_level_id>"],
  "department": "Physics",
  "semester": "First",
  "academicYear": "2024/2025",
  "caWeight": 30,
  "examWeight": 70
}
```

**Note:** Replace `<class_level_id>` with actual ID from Get All Class Levels

**Expected Response:** 201 Created

### Test Get All Courses

**Endpoint:** `GET http://localhost:5000/api/courses`

**Expected Response:** List of all courses

### Test Get Course by ID

**Endpoint:** `GET http://localhost:5000/api/courses/<course_id>`

**Expected Response:** 200 OK with course details

## 4. Exam Management Testing

### Test Create Exam

**Endpoint:** `POST http://localhost:5000/api/exams`

**Request Body:**
```json
{
  "examName": "Midterm Physics",
  "course": "<course_id>",
  "examType": "Midterm",
  "totalMarks": 50,
  "passingMarks": 25,
  "examDate": "2024-11-15T10:00:00Z",
  "description": "Midterm examination for Physics",
  "instructions": "Answer all questions. Duration: 2 hours"
}
```

**Expected Response:** 201 Created

### Test Get All Exams

**Endpoint:** `GET http://localhost:5000/api/exams`

**Expected Response:** List of all exams

### Test Record CA Marks

**Endpoint:** `POST http://localhost:5000/api/exams/ca/record`

**Request Body:**
```json
{
  "student": "<student_id>",
  "course": "<course_id>",
  "assignment1": 8,
  "assignment2": 9,
  "quiz1": 5,
  "quiz2": 4,
  "classParticipation": 8
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "CA marks recorded",
  "caMark": {
    "totalCA": 34,
    ...
  }
}
```

### Test Get CA Marks

**Endpoint:** `GET http://localhost:5000/api/exams/ca/<student_id>/<course_id>`

**Expected Response:** 200 OK with CA marks

## 5. Results Management Testing

### Test Submit Exam Result

**Endpoint:** `POST http://localhost:5000/api/results`

**Request Body:**
```json
{
  "student": "<student_id>",
  "exam": "<exam_id>",
  "course": "<course_id>",
  "marksObtained": 42,
  "totalMarks": 50
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Result submitted",
  "result": {
    "percentage": 84,
    "grade": "B",
    "isPassed": true
  }
}
```

### Test Get Student Results

**Endpoint:** `GET http://localhost:5000/api/results/student/<student_id>`

**Expected Response:** List of student's results

### Test Calculate Final Marks

**Endpoint:** `GET http://localhost:5000/api/results/final/<student_id>/<course_id>`

**Expected Response:**
```json
{
  "success": true,
  "finalMark": "82.50",
  "caMarks": {...},
  "examResults": [...]
}
```

## 6. Report Generation Testing

### Test Generate Student PDF Report

**Endpoint:** `GET http://localhost:5000/api/reports/student/<student_id>/course/<course_id>/pdf`

**Expected Response:** PDF file download

**Verification:**
- File downloads successfully
- Open PDF and verify:
  - Student name and registration number
  - Course code and name
  - CA marks breakdown
  - Exam results
  - Final grade

### Test Generate Course Excel Report

**Endpoint:** `GET http://localhost:5000/api/reports/course/<course_id>/excel`

**Expected Response:** Excel file download

**Verification:**
- File downloads successfully
- Open in Excel and verify:
  - Student names and registration numbers
  - Marks obtained vs total
  - Percentages and grades
  - Pass/fail status

### Test Get Course Summary

**Endpoint:** `GET http://localhost:5000/api/reports/course/<course_id>/summary`

**Expected Response:**
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

## 7. Complete Workflow Test

Follow this sequence to test a complete workflow:

### Step 1: Create Class Level
```
POST /admin/class-levels
```

### Step 2: Create Course
```
POST /courses
(Use class level ID from step 1)
```

### Step 3: Create Exam
```
POST /exams
(Use course ID from step 2)
```

### Step 4: Record CA Marks
```
POST /exams/ca/record
(Use student ID and course ID)
```

### Step 5: Submit Exam Result
```
POST /results
(Use student ID, exam ID, course ID)
```

### Step 6: Get Final Marks
```
GET /results/final/{studentId}/{courseId}
```

### Step 7: Generate Report
```
GET /reports/student/{studentId}/course/{courseId}/pdf
```

## 8. Error Handling Tests

### Test Invalid Credentials

**Request:**
```json
{
  "email": "admin@exams.com",
  "password": "wrongpassword"
}
```

**Expected:** 401 Unauthorized

### Test Missing Token

**Request:** GET /api/admin/statistics (without Authorization header)

**Expected:** 401 No token provided

### Test Invalid Token

**Request:** GET /api/admin/statistics with invalid token

**Expected:** 401 Invalid token

### Test Non-Admin Access

**Request:** GET /admin/statistics with student token

**Expected:** 403 Access denied

### Test Duplicate Result

**Request:** Submit result for same student/exam twice

**Expected:** 400 Result already exists

## 9. Performance Testing

### Test Large Data Volume

1. Create 100+ students in a class level
2. Assign them to 5+ courses
3. Record CA marks for all
4. Submit results for all
5. Generate Excel report

**Expected:** All operations complete without timeout

### Load Testing

```bash
# Using Apache Bench
ab -n 1000 -c 50 http://localhost:5000/api/health
```

**Expected:** Minimal response time, no errors

## 10. Data Validation Tests

### Test Invalid Email Format
```json
{
  "email": "invalid-email",
  "password": "password123"
}
```
**Expected:** Validation error

### Test Negative Marks
```json
{
  "marksObtained": -10,
  "totalMarks": 50
}
```
**Expected:** Validation error (min: 0)

### Test Marks Exceeding Total
```json
{
  "marksObtained": 150,
  "totalMarks": 100
}
```
**Expected:** System handles correctly (percentage > 100%)

## Test Checklist

- [ ] User Registration
- [ ] User Login
- [ ] Get Current User
- [ ] Get All Users (Admin)
- [ ] Create Class Level (Admin)
- [ ] Create Course
- [ ] Get All Courses
- [ ] Create Exam
- [ ] Record CA Marks
- [ ] Submit Exam Result
- [ ] Get Student Results
- [ ] Calculate Final Marks
- [ ] Generate PDF Report
- [ ] Generate Excel Report
- [ ] Get Course Summary
- [ ] Update Result
- [ ] Publish Exam Results
- [ ] Error Handling
- [ ] Role-Based Access
- [ ] Data Validation

