const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const PDFDocument = require('pdfkit');
const ExcelJS = require('xlsx');
const ExamResult = require('../models/ExamResult');
const CAMark = require('../models/CAMark');
const User = require('../models/User');
const Course = require('../models/Course');

// Generate PDF report for a student per course
router.get('/student/:studentId/course/:courseId/pdf', authenticate, async (req, res) => {
  try {
    const student = await User.findById(req.params.studentId).populate('classLevel');
    const course = await Course.findById(req.params.courseId).populate('instructor');

    if (!student || !course) {
      return res.status(404).json({ message: 'Student or Course not found' });
    }

    const examResults = await ExamResult.find({
      student: req.params.studentId,
      course: req.params.courseId
    }).populate('exam');

    const caMark = await CAMark.findOne({
      student: req.params.studentId,
      course: req.params.courseId
    });

    // Create PDF
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${student.firstName}_${course.courseCode}.pdf"`);

    doc.pipe(res);

    // Title
    doc.fontSize(16).text('EXAM RESULT REPORT', { align: 'center' });
    doc.fontSize(10).text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown();

    // Student Information
    doc.fontSize(12).text('Student Information:', { underline: true });
    doc.fontSize(10);
    doc.text(`Name: ${student.firstName} ${student.lastName}`);
    doc.text(`Registration Number: ${student.regNumber}`);
    doc.text(`Class Level: ${student.classLevel?.levelName}`);
    doc.text(`Email: ${student.email}`);
    doc.moveDown();

    // Course Information
    doc.fontSize(12).text('Course Information:', { underline: true });
    doc.fontSize(10);
    doc.text(`Course Code: ${course.courseCode}`);
    doc.text(`Course Name: ${course.courseName}`);
    doc.text(`Instructor: ${course.instructor.firstName} ${course.instructor.lastName}`);
    doc.text(`Credits: ${course.credits}`);
    doc.moveDown();

    // CA Marks
    if (caMark) {
      doc.fontSize(12).text('Continuous Assessment (CA):', { underline: true });
      doc.fontSize(10);
      doc.text(`Assignment 1: ${caMark.assignment1}/10`);
      doc.text(`Assignment 2: ${caMark.assignment2}/10`);
      doc.text(`Quiz 1: ${caMark.quiz1}/5`);
      doc.text(`Quiz 2: ${caMark.quiz2}/5`);
      doc.text(`Class Participation: ${caMark.classParticipation}/10`);
      doc.text(`Total CA: ${caMark.totalCA}/40`);
      doc.moveDown();
    }

    // Exam Results
    if (examResults.length > 0) {
      doc.fontSize(12).text('Exam Results:', { underline: true });
      doc.fontSize(10);
      examResults.forEach((result, index) => {
        doc.text(`\n${result.exam.examType}:`);
        doc.text(`  Marks: ${result.marksObtained}/${result.totalMarks}`);
        doc.text(`  Percentage: ${result.percentage.toFixed(2)}%`);
        doc.text(`  Grade: ${result.grade}`);
        doc.text(`  Status: ${result.isPassed ? 'PASSED' : 'FAILED'}`);
      });
    }

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate Excel report for all students in a course
router.get('/course/:courseId/excel', authenticate, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const results = await ExamResult.find({ course: req.params.courseId })
      .populate('student exam')
      .sort({ student: 1 });

    // Create workbook
    const workbook = ExcelJS.utils.book_new();
    const worksheet = ExcelJS.utils.json_to_sheet(
      results.map(r => ({
        'Student Name': `${r.student.firstName} ${r.student.lastName}`,
        'Registration Number': r.student.regNumber,
        'Exam Type': r.exam.examType,
        'Marks Obtained': r.marksObtained,
        'Total Marks': r.totalMarks,
        'Percentage': r.percentage.toFixed(2),
        'Grade': r.grade,
        'Status': r.isPassed ? 'PASSED' : 'FAILED'
      }))
    );

    ExcelJS.utils.book_append_sheet(workbook, worksheet, 'Results');
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${course.courseCode}_results.xlsx"`);

    workbook.write(res);
    workbook.close();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Summary report for a course
router.get('/course/:courseId/summary', authenticate, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const results = await ExamResult.find({ course: req.params.courseId })
      .populate('student exam');

    const totalStudents = new Set(results.map(r => r.student._id)).size;
    const passedStudents = results.filter(r => r.isPassed).length;
    const failedStudents = results.filter(r => !r.isPassed).length;
    const averageMarks = (results.reduce((sum, r) => sum + r.percentage, 0) / results.length).toFixed(2);
    const highestMarks = Math.max(...results.map(r => r.percentage));
    const lowestMarks = Math.min(...results.map(r => r.percentage));

    res.json({
      success: true,
      summary: {
        totalStudents,
        passedStudents,
        failedStudents,
        passPercentage: ((passedStudents / totalStudents) * 100).toFixed(2),
        averageMarks,
        highestMarks,
        lowestMarks
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
