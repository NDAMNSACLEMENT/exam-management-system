const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const ClassLevel = require('../models/ClassLevel');
const Course = require('../models/Course');
const Exam = require('../models/Exam');
const ExamResult = require('../models/ExamResult');
const CAMark = require('../models/CAMark');

require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/exam-management');
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      ClassLevel.deleteMany({}),
      Course.deleteMany({}),
      Exam.deleteMany({}),
      ExamResult.deleteMany({}),
      CAMark.deleteMany({})
    ]);
    console.log('Cleared existing data...');

    // Create class levels
    const classLevels = await ClassLevel.insertMany([
      {
        levelName: 'First Year',
        levelCode: 'Y1',
        description: 'First Year Students',
        academicYear: '2024/2025'
      },
      {
        levelName: 'Second Year',
        levelCode: 'Y2',
        description: 'Second Year Students',
        academicYear: '2024/2025'
      },
      {
        levelName: 'Third Year',
        levelCode: 'Y3',
        description: 'Third Year Students',
        academicYear: '2024/2025'
      }
    ]);
    console.log('Class levels created...');

    // Create admin user
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@exams.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('Admin user created...');

    // Create instructor users
    const instructors = await User.insertMany([
      {
        firstName: 'Dr. John',
        lastName: 'Smith',
        email: 'john.smith@exams.com',
        password: 'instructor123',
        role: 'instructor',
        department: 'Computer Science'
      },
      {
        firstName: 'Prof. Jane',
        lastName: 'Doe',
        email: 'jane.doe@exams.com',
        password: 'instructor123',
        role: 'instructor',
        department: 'Mathematics'
      }
    ]);
    console.log('Instructor users created...');

    // Create student users
    const students = await User.insertMany([
      {
        firstName: 'Michael',
        lastName: 'Johnson',
        email: 'michael@student.com',
        password: 'student123',
        role: 'student',
        regNumber: 'STU001',
        classLevel: classLevels[0]._id
      },
      {
        firstName: 'Sarah',
        lastName: 'Williams',
        email: 'sarah@student.com',
        password: 'student123',
        role: 'student',
        regNumber: 'STU002',
        classLevel: classLevels[0]._id
      },
      {
        firstName: 'David',
        lastName: 'Brown',
        email: 'david@student.com',
        password: 'student123',
        role: 'student',
        regNumber: 'STU003',
        classLevel: classLevels[1]._id
      },
      {
        firstName: 'Emma',
        lastName: 'Davis',
        email: 'emma@student.com',
        password: 'student123',
        role: 'student',
        regNumber: 'STU004',
        classLevel: classLevels[1]._id
      }
    ]);
    console.log('Student users created...');

    // Create courses
    const courses = await Course.insertMany([
      {
        courseCode: 'CS101',
        courseName: 'Introduction to Programming',
        description: 'Learn the basics of programming',
        credits: 3,
        instructor: instructors[0]._id,
        classLevels: [classLevels[0]._id],
        department: 'Computer Science',
        semester: 'First',
        academicYear: '2024/2025',
        caWeight: 30,
        examWeight: 70
      },
      {
        courseCode: 'MATH101',
        courseName: 'Calculus I',
        description: 'Introduction to Calculus',
        credits: 4,
        instructor: instructors[1]._id,
        classLevels: [classLevels[0]._id],
        department: 'Mathematics',
        semester: 'First',
        academicYear: '2024/2025',
        caWeight: 30,
        examWeight: 70
      },
      {
        courseCode: 'CS201',
        courseName: 'Data Structures',
        description: 'Advanced programming concepts',
        credits: 3,
        instructor: instructors[0]._id,
        classLevels: [classLevels[1]._id],
        department: 'Computer Science',
        semester: 'Second',
        academicYear: '2024/2025',
        caWeight: 30,
        examWeight: 70
      }
    ]);
    console.log('Courses created...');

    // Create exams
    const exams = await Exam.insertMany([
      {
        examName: 'Programming Quiz 1',
        course: courses[0]._id,
        examType: 'Quiz',
        totalMarks: 20,
        passingMarks: 10,
        examDate: new Date('2024-10-15'),
        description: 'First quiz on programming basics',
        createdBy: instructors[0]._id
      },
      {
        examName: 'Midterm Exam',
        course: courses[0]._id,
        examType: 'Midterm',
        totalMarks: 50,
        passingMarks: 25,
        examDate: new Date('2024-11-10'),
        description: 'Midterm examination',
        createdBy: instructors[0]._id
      },
      {
        examName: 'Final Exam',
        course: courses[0]._id,
        examType: 'Final',
        totalMarks: 100,
        passingMarks: 50,
        examDate: new Date('2024-12-20'),
        description: 'Final semester examination',
        createdBy: instructors[0]._id
      }
    ]);
    console.log('Exams created...');

    // Create exam results
    await ExamResult.insertMany([
      {
        student: students[0]._id,
        exam: exams[0]._id,
        course: courses[0]._id,
        marksObtained: 18,
        totalMarks: 20
      },
      {
        student: students[1]._id,
        exam: exams[0]._id,
        course: courses[0]._id,
        marksObtained: 15,
        totalMarks: 20
      },
      {
        student: students[0]._id,
        exam: exams[1]._id,
        course: courses[0]._id,
        marksObtained: 45,
        totalMarks: 50
      }
    ]);
    console.log('Exam results created...');

    // Create CA marks
    await CAMark.insertMany([
      {
        student: students[0]._id,
        course: courses[0]._id,
        assignment1: 9,
        assignment2: 8,
        quiz1: 5,
        quiz2: 4,
        classParticipation: 9,
        recordedBy: instructors[0]._id
      },
      {
        student: students[1]._id,
        course: courses[0]._id,
        assignment1: 8,
        assignment2: 7,
        quiz1: 4,
        quiz2: 3,
        classParticipation: 8,
        recordedBy: instructors[0]._id
      }
    ]);
    console.log('CA marks created...');

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
