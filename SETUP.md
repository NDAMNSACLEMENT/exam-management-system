# Exam Management System - Installation & Setup Guide

## Quick Start Guide

### Prerequisites
- Node.js v14+
- MongoDB v4.0+
- npm/yarn

### Installation Steps

1. **Clone Repository**
   ```bash
   git clone https://github.com/NDAMNSACLEMENT/exam-management-system.git
   cd exam-management-system
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB connection string and JWT secret
   ```

4. **Seed Database** (Optional)
   ```bash
   npm run seed
   ```
   This creates sample data including:
   - Admin account (admin@exams.com / admin123)
   - 2 Instructor accounts
   - 4 Student accounts
   - 3 Class levels
   - 3 Sample courses
   - Multiple exams and results

5. **Start Server**
   ```bash
   npm run dev    # Development mode with auto-reload
   npm start      # Production mode
   ```

Server runs at `http://localhost:5000`

## API Documentation

### Base URL
`http://localhost:5000/api`

### Authentication
All protected endpoints require JWT token:
```
Authorization: Bearer <your_token>
```

### Key Endpoints

#### Authentication
- `POST /auth/register` - Register user
- `POST /auth/login` - Login & get token
- `GET /auth/me` - Get current user

#### Admin
- `GET /admin/users` - List all users
- `GET /admin/statistics` - System stats
- `POST /admin/class-levels` - Create class
- `GET /admin/class-levels` - List classes

#### Courses
- `POST /courses` - Create course
- `GET /courses` - List courses
- `GET /courses/:id` - Get course details
- `PUT /courses/:id` - Update course

#### Exams & Marks
- `POST /exams` - Create exam
- `GET /exams` - List exams
- `POST /exams/ca/record` - Record CA marks
- `GET /exams/ca/:studentId/:courseId` - Get CA marks

#### Results
- `POST /results` - Submit result
- `GET /results/student/:studentId` - Student results
- `GET /results/course/:courseId` - Course results
- `GET /results/final/:studentId/:courseId` - Final marks
- `PUT /results/:id` - Update result

#### Reports
- `GET /reports/student/:studentId/course/:courseId/pdf` - PDF report
- `GET /reports/course/:courseId/excel` - Excel report
- `GET /reports/course/:courseId/summary` - Statistics

## Features Overview

### 👥 User Management
- Create admin, instructor, student users
- JWT authentication
- Role-based access control

### 📚 Course Management  
- Create courses with course codes
- Assign to class levels
- Track by academic year & semester
- Configure CA/Exam weights

### ✏️ Exam Management
- Create multiple exam types (Quiz, CA, Midterm, Final)
- Set total and passing marks
- Schedule exams
- Publish results

### 📝 CA Management
- Record assignments (2 × 10 marks)
- Record quizzes (2 × 5 marks)  
- Record class participation (10 marks)
- Auto-calculate totals

### 📊 Results & Grading
- Submit exam marks
- Auto-calculate percentages
- Auto-assign grades (A-F)
- Combine CA + Exam with weights

### 📄 Reports
- PDF reports per student per course
- Excel exports of all results
- Course statistics
- Pass/fail analysis

## Testing

### Sample Login Credentials (after seeding)

**Admin:**
```
Email: admin@exams.com
Password: admin123
```

**Instructor:**
```
Email: john.smith@exams.com
Password: instructor123
```

**Student:**
```
Email: michael@student.com
Password: student123
```

### Test with Postman

1. Import endpoints from this API documentation
2. Use sample credentials to login
3. Copy token from login response
4. Add to Authorization header: `Bearer <token>`
5. Test endpoints

## Database Models

### User
- firstName, lastName, email, password
- role: admin | instructor | student
- classLevel (for students)
- regNumber, phone, department
- lastLogin, isActive

### Course  
- courseCode (unique)
- courseName, description, credits
- instructor, classLevels
- semester, academicYear
- caWeight (default 30), examWeight (default 70)
- isActive

### Exam
- examName, course, examType
- totalMarks, passingMarks, examDate
- description, instructions
- isPublished, resultsReleased

### ExamResult
- student, exam, course
- marksObtained, totalMarks
- percentage, grade (A-F)
- isPassed, remarks
- status: pending | graded | submitted

### CAMark
- student, course
- assignment1, assignment2 (0-10)
- quiz1, quiz2 (0-5)
- classParticipation (0-10)
- totalCA (auto-calculated)

### ClassLevel
- levelName, levelCode
- description, academicYear
- totalStudents, isActive

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Default: `mongodb://localhost:27017/exam-management`

### Port Already in Use
- Change PORT in .env (default: 5000)
- Or kill process using the port

### JWT Errors
- Generate new JWT_SECRET in .env
- Tokens expire after JWT_EXPIRE period (default: 7d)
- Re-login to get new token

### CORS Issues
- Ensure requests have proper Content-Type headers
- Include Authorization header for protected routes

## Project Structure

```
├── models/           # Database schemas
├── routes/           # API endpoints
├── middleware/       # Auth & error handling  
├── scripts/          # Database seeding
├── public/           # Frontend files
├── server.js         # Main server file
├── package.json      # Dependencies
├── .env.example      # Environment template
└── README.md         # Documentation
```

## Next Steps

1. **Customize** environment variables
2. **Run seed script** for sample data
3. **Test API** with provided credentials
4. **Build frontend** using React/Vue (optional)
5. **Deploy** to production server

## Support & Feedback

For issues or suggestions, create an issue on GitHub:
https://github.com/NDAMNSACLEMENT/exam-management-system/issues
