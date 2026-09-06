# Advanced Features Guide

## 🚀 Advanced Features

This guide covers advanced usage and features of the Exam Management System.

## 1. Grade Calculation System

### Automatic Grade Assignment
Grades are automatically calculated based on percentage:

```
A: 90-100%
B: 80-89%
C: 70-79%
D: 60-69%
E: 50-59%
F: Below 50%
```

### Custom Grade Boundaries
To modify grade boundaries, update the `ExamResult` model (line ~56 in `models/ExamResult.js`):

```javascript
if (this.percentage >= 90) this.grade = 'A';
else if (this.percentage >= 80) this.grade = 'B';
// ... modify thresholds as needed
```

## 2. Weighted Scoring System

### How It Works

Final Mark = (CA Marks × CA Weight %) + (Exam Marks × Exam Weight %)

Default weights:
- CA Weight: 30%
- Exam Weight: 70%

### Example Calculation

```
Student Score:
- CA Total: 35/40 = 87.5%
- Exam Score: 80/100 = 80%

Final Mark = (87.5 × 0.30) + (80 × 0.70)
Final Mark = 26.25 + 56 = 82.25%
Grade: B
```

### Customize Weights

Set custom weights when creating a course:

```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "courseCode": "CS101",
    "courseName": "Programming",
    "credits": 3,
    "caWeight": 40,
    "examWeight": 60,
    ...other fields
  }'
```

## 3. Multiple Exam Types

Supported exam types:

- **Quiz**: Short assessments (5-20 marks typical)
- **CA**: Continuous Assessment (component of overall mark)
- **Midterm**: Mid-semester examination (30-50 marks)
- **Final**: End-of-semester examination (50-100 marks)

### Recording Different Exam Types

```bash
# Record a Quiz
curl -X POST http://localhost:5000/api/exams \
  -H "Authorization: Bearer <token>" \
  -d '{
    "examName": "Quiz 1",
    "course": "<course_id>",
    "examType": "Quiz",
    "totalMarks": 20,
    "passingMarks": 10
  }'
```

## 4. CA (Continuous Assessment) Components

### Components Tracked

1. **Assignments** (20 marks total)
   - Assignment 1: 10 marks
   - Assignment 2: 10 marks

2. **Quizzes** (10 marks total)
   - Quiz 1: 5 marks
   - Quiz 2: 5 marks

3. **Class Participation** (10 marks)
   - Includes attendance, class discussions, etc.

**Total CA: 40 marks**

### Recording CA Marks

```bash
curl -X POST http://localhost:5000/api/exams/ca/record \
  -H "Authorization: Bearer <token>" \
  -d '{
    "student": "<student_id>",
    "course": "<course_id>",
    "assignment1": 9,
    "assignment2": 8,
    "quiz1": 5,
    "quiz2": 4,
    "classParticipation": 9
  }'
```

### Modify CA Components

To change CA components, edit `models/CAMark.js`:

```javascript
const caMarkSchema = new mongoose.Schema({
  // Add/remove fields as needed
  assignment1: { type: Number, min: 0, max: 10 },
  // ...
});
```

## 5. Bulk Operations

### Bulk Record CA Marks

Script to record CA for multiple students:

```javascript
// scripts/bulkCAMarks.js
const CAMark = require('../models/CAMark');

const studentsData = [
  { student: 'id1', marks: { assignment1: 9, assignment2: 8, ... } },
  { student: 'id2', marks: { assignment1: 8, assignment2: 7, ... } },
];

for (const data of studentsData) {
  await CAMark.findOneAndUpdate(
    { student: data.student, course: courseId },
    data.marks,
    { upsert: true, new: true }
  );
}
```

### Bulk Result Submission

```bash
# records.json
[
  { "student": "id1", "exam": "exam_id", "course": "course_id", "marksObtained": 85, "totalMarks": 100 },
  { "student": "id2", "exam": "exam_id", "course": "course_id", "marksObtained": 78, "totalMarks": 100 }
]
```

## 6. Report Generation Features

### Individual Student Report (PDF)

Contains:
- Student personal information
- Course details
- CA marks breakdown by component
- Individual exam results
- Final calculated grade
- Passing/failing status

**File naming**: `{StudentName}_{CourseCode}.pdf`

### Course Results Report (Excel)

Contains:
- All student names and registration numbers
- Marks obtained vs maximum for each exam
- Calculated percentages
- Assigned grades
- Pass/fail status for each student
- Sortable and filterable in Excel

**File naming**: `{CourseCode}_results.xlsx`

### Course Statistics Report

Provides:
- Total students in course
- Number who passed/failed
- Pass rate percentage
- Class average marks
- Highest score
- Lowest score

Use for:
- Course performance analysis
- Identifying at-risk students
- Curriculum effectiveness review

## 7. User Role Management

### Role-Based Access Control

**Admin**:
- Create/manage all users
- Create class levels
- View system statistics
- Access all courses and results

**Instructor**:
- Create courses
- Record CA marks
- Submit exam results
- Generate reports for their courses
- View their course statistics

**Student**:
- View own results
- Download own report
- View CA marks
- Calculate final marks

### Changing User Roles

```bash
curl -X PUT http://localhost:5000/api/admin/users/user_id/role \
  -H "Authorization: Bearer <admin_token>" \
  -d '{"role": "instructor"}'
```

## 8. Course & Class Management

### Class Level Hierarchy

```
Class Levels (e.g., Year 1, Year 2)
    ↓
Courses (CS101, MATH101)
    ↓
Students (assigned to class levels)
    ↓
Exams & Results
```

### Managing Academic Years

Set academic year when creating:
- Class levels: `"academicYear": "2024/2025"`
- Courses: `"academicYear": "2024/2025"`

Filter by academic year:
```bash
GET /api/courses?academicYear=2024/2025
```

### Course Configuration

```json
{
  "courseCode": "CS101",
  "courseName": "Programming 101",
  "credits": 3,
  "semester": "First",
  "academicYear": "2024/2025",
  "caWeight": 30,
  "examWeight": 70,
  "classLevels": ["level_id1", "level_id2"]
}
```

## 9. Authentication & Security

### JWT Token Management

- Default expiration: 7 days
- Stored in `.env` as `JWT_EXPIRE`

Change expiration:
```bash
JWT_EXPIRE=30d  # 30 days
JWT_EXPIRE=24h  # 24 hours
```

### Password Security

- Passwords hashed with bcrypt (10 salt rounds)
- Never stored in plain text
- Compared securely on login

### API Key (Future Enhancement)

To add API key authentication:

```javascript
// middleware/apiKey.js
const validateApiKey = (req, res, next) => {
  const key = req.headers['x-api-key'];
  if (key === process.env.API_KEY) {
    next();
  } else {
    res.status(401).json({ message: 'Invalid API key' });
  }
};
```

## 10. Database Optimization

### Indexes

Already implemented:
- User email (unique)
- ExamResult (student + exam, unique)
- CAMark (student + course, unique)

Add more for large datasets:
```javascript
// In model schema
userSchema.index({ email: 1 });
examResultSchema.index({ course: 1, student: 1 });
courseSch Schema.index({ academicYear: 1, semester: 1 });
```

### Query Optimization

Use `.populate()` to fetch related data:
```javascript
const exam = await Exam.findById(id)
  .populate('course')
  .populate('createdBy');
```

## 11. Error Handling

### Custom Error Messages

```javascript
throw new Error('Specific error message');
// Caught by errorHandler middleware and returned to client
```

### Validation Errors

Implement input validation:
```bash
npm install express-validator
```

```javascript
const { body, validationResult } = require('express-validator');

router.post('/exams', [
  body('examName').notEmpty().withMessage('Exam name required'),
  body('totalMarks').isInt({ min: 1 }).withMessage('Marks must be positive')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // ... proceed
});
```

## 12. Logging & Monitoring

### Basic Logging

```javascript
// Log important events
console.log(`Exam result submitted: ${studentId} - ${examId}`);
console.error(`Error processing result: ${error.message}`);
```

### Add Winston Logger (optional)

```bash
npm install winston
```

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## 13. Backup & Data Recovery

### MongoDB Backup

```bash
# Backup
mongodump --uri="mongodb://localhost:27017/exam-management" --out=./backup

# Restore
mongorestore --uri="mongodb://localhost:27017/exam-management" ./backup
```

## 14. Future Enhancement Ideas

- [ ] Email notifications for exams and results
- [ ] SMS alerts for critical information
- [ ] Student transcript generation
- [ ] GPA calculation and tracking
- [ ] Online exam system with proctoring
- [ ] Mobile application
- [ ] Machine learning for grade prediction
- [ ] Plagiarism detection for assignments
- [ ] Two-factor authentication (2FA)
- [ ] Audit logs for all operations
- [ ] Advanced analytics dashboard
- [ ] Student performance analytics

