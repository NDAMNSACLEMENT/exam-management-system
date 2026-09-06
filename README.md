# Exam Management System

A comprehensive, full-featured exam management system designed to simplify examination processes, manage student results, and generate detailed reports. Built with Node.js, Express, MongoDB, and modern web technologies.

## 🎯 Features

### User Management
- **Role-Based Access Control**: Admin, Instructor, and Student roles
- **User Registration & Authentication**: Secure JWT-based authentication
- **User Profile Management**: Update user information and preferences
- **User Deactivation**: Admins can deactivate users

### Course Management
- **Create & Manage Courses**: Add courses with course codes and descriptions
- **Class Level Management**: Create and manage different class levels (Year 1, Year 2, etc.)
- **Academic Year & Semester Tracking**: Organize courses by academic year and semester
- **CA & Exam Weight Configuration**: Set custom weights for CA (Continuous Assessment) and exams
- **Instructor Assignment**: Assign instructors to courses

### Exam Management
- **Create Multiple Exam Types**: Quiz, CA, Midterm, Final exams
- **Flexible Marking System**: Set total marks and passing marks per exam
- **Exam Scheduling**: Set exam dates and publish information
- **Result Publishing**: Release results to students when ready

### Continuous Assessment (CA) Management
- **Track Multiple CA Components**:
  - Assignment 1 & 2 (10 marks each)
  - Quiz 1 & 2 (5 marks each)
  - Class Participation (10 marks)
- **Automatic Total Calculation**: System automatically calculates total CA
- **Bulk CA Mark Recording**: Record marks for multiple students

### Exam Results & Grading
- **Automated Grade Calculation**:
  - A: 90-100%
  - B: 80-89%
  - C: 70-79%
  - D: 60-69%
  - E: 50-59%
  - F: Below 50%
- **Composite Scoring**: Combines CA marks and exam results with configured weights
- **Pass/Fail Determination**: Automatic calculation based on passing marks
- **Result Submission & Updates**: Record and update exam results

### Report Generation
- **Individual Student Reports**: PDF reports per student per course
  - Student information
  - Course details
  - CA breakdown
  - Exam results
  - Final grades
- **Course Summary Reports**: Excel files with all student results
  - Student names and registration numbers
  - Marks obtained vs total
  - Percentages and grades
  - Pass/fail status
- **Statistics & Analytics**:
  - Pass/fail rates
  - Average marks
  - Highest/lowest scores
  - Overall course performance

### Admin Dashboard
- **System Statistics**: Total users, courses, exams, etc.
- **User Management**: Create, update, deactivate users
- **Course Oversight**: View and manage all courses
- **Exam Monitoring**: Track exam status and results
- **Class Level Administration**: Create and manage class levels

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.0 or higher)
- npm or yarn
- Postman (optional, for API testing)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/NDAMNSACLEMENT/exam-management-system.git
cd exam-management-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` with your settings:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/exam-management
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
```

### 4. Seed the Database (Optional)
Populate with sample data:
```bash
npm run seed
```

### 5. Start the Server
```bash
# Development with hot reload
npm run dev

# Production
npm start
```

Server will run on `http://localhost:5000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)
- `POST /api/auth/logout` - Logout user

### Admin Operations
- `GET /api/admin/users` - Get all users
- `POST /api/admin/class-levels` - Create class level
- `GET /api/admin/class-levels` - Get all class levels
- `PUT /api/admin/class-levels/:id` - Update class level
- `DELETE /api/admin/class-levels/:id` - Delete class level
- `PUT /api/admin/users/:id/role` - Update user role
- `PUT /api/admin/users/:id/deactivate` - Deactivate user
- `GET /api/admin/statistics` - Get system statistics

### Courses
- `POST /api/courses` - Create course
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course
- `GET /api/courses/instructor/:instructorId` - Get instructor's courses

### Exams
- `POST /api/exams` - Create exam
- `GET /api/exams` - Get all exams
- `GET /api/exams/:id` - Get exam by ID
- `PUT /api/exams/:id` - Update exam
- `PUT /api/exams/:id/publish` - Publish exam results
- `POST /api/exams/ca/record` - Record CA marks
- `GET /api/exams/ca/:studentId/:courseId` - Get CA marks

### Results
- `POST /api/results` - Submit exam result
- `GET /api/results/student/:studentId` - Get student results
- `GET /api/results/course/:courseId` - Get course results
- `GET /api/results/exam/:examId` - Get exam results
- `GET /api/results/final/:studentId/:courseId` - Calculate final marks
- `PUT /api/results/:id` - Update result

### Reports
- `GET /api/reports/student/:studentId/course/:courseId/pdf` - Download student report (PDF)
- `GET /api/reports/course/:courseId/excel` - Download course results (Excel)
- `GET /api/reports/course/:courseId/summary` - Get course summary statistics

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📊 Data Models

### User
- firstName, lastName, email, password
- role (admin, instructor, student)
- classLevel (for students)
- regNumber, phone, department
- lastLogin, isActive

### Course
- courseCode, courseName, credits
- instructor, classLevels
- semester, academicYear
- caWeight, examWeight

### Exam
- examName, course, examType
- totalMarks, passingMarks, examDate
- isPublished, resultsReleased

### ExamResult
- student, exam, course
- marksObtained, totalMarks, percentage
- grade, isPassed

### CAMark
- student, course
- assignment1, assignment2
- quiz1, quiz2, classParticipation
- totalCA

## 🧪 Testing with Sample Data

### Login Credentials (after seeding)

**Admin:**
- Email: admin@exams.com
- Password: admin123

**Instructor:**
- Email: john.smith@exams.com
- Password: instructor123

**Student:**
- Email: michael@student.com
- Password: student123

## 📖 Example API Usage

### Register a Student
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@student.com",
    "password": "password123",
    "role": "student",
    "regNumber": "STU005",
    "classLevel": "<class_level_id>"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@exams.com",
    "password": "admin123"
  }'
```

### Create a Course
```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "courseCode": "CS102",
    "courseName": "Database Management",
    "credits": 3,
    "classLevels": ["<class_level_id>"],
    "department": "Computer Science",
    "semester": "First",
    "academicYear": "2024/2025"
  }'
```

### Record CA Marks
```bash
curl -X POST http://localhost:5000/api/exams/ca/record \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "student": "<student_id>",
    "course": "<course_id>",
    "assignment1": 8,
    "assignment2": 9,
    "quiz1": 5,
    "quiz2": 4,
    "classParticipation": 9
  }'
```

### Submit Exam Result
```bash
curl -X POST http://localhost:5000/api/results \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "student": "<student_id>",
    "exam": "<exam_id>",
    "course": "<course_id>",
    "marksObtained": 75,
    "totalMarks": 100
  }'
```

### Generate Student Report (PDF)
```bash
curl -X GET http://localhost:5000/api/reports/student/<student_id>/course/<course_id>/pdf \
  -H "Authorization: Bearer <token>" \
  --output student_report.pdf
```

## 🏗️ Project Structure

```
exam-management-system/
├── models/
│   ├── User.js
│   ├── Course.js
│   ├── ClassLevel.js
│   ├── Exam.js
│   ├── ExamResult.js
│   └── CAMark.js
├── routes/
│   ├── auth.js
│   ├── admin.js
│   ├── courses.js
│   ├── exams.js
│   ├── results.js
│   └── reports.js
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
├── scripts/
│   └── seed.js
├── public/
│   └── index.html
├── server.js
├── package.json
├── .env.example
└── README.md
```

## 🎨 Frontend Integration

The system comes with a basic HTML interface at `http://localhost:5000/`. For a full-featured frontend, consider integrating:

- React.js or Vue.js for the UI
- Dashboard with charts for analytics
- Student portal for checking results
- Instructor panel for managing courses and marks
- Admin panel for user and system management

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control (RBAC)
- Input validation and sanitization
- CORS protection
- Environment variable protection

## 📈 Future Enhancements

- Email notifications for exam schedules and results
- SMS alerts
- Mobile application
- Advanced analytics and reporting
- Exam paper management
- Assignment submission system
- Student transcript generation
- Bulk user import from CSV
- Online exam system
- GPA calculation

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@examsystem.com or open an issue on GitHub.

## 👨‍💻 Author

**NDAMNSA CLEMENT**
- GitHub: [@NDAMNSACLEMENT](https://github.com/NDAMNSACLEMENT)

---

**Built with ❤️ for educational institutions**
