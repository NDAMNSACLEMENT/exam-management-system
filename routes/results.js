const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const ExamResult = require('../models/ExamResult');
const CAMark = require('../models/CAMark');
const Exam = require('../models/Exam');
const Course = require('../models/Course');

// Submit exam result
router.post('/', authenticate, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const { student, exam, course, marksObtained, totalMarks } = req.body;

    const result = new ExamResult({
      student,
      exam,
      course,
      marksObtained,
      totalMarks,
      gradedBy: req.user.id,
      gradedAt: new Date()
    });

    await result.save();
    await result.populate('student exam course gradedBy');

    res.status(201).json({ success: true, message: 'Result submitted', result });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Result already exists for this student and exam' });
    }
    res.status(500).json({ message: error.message });
  }
});

// Get results for a student
router.get('/student/:studentId', authenticate, async (req, res) => {
  try {
    const results = await ExamResult.find({ student: req.params.studentId })
      .populate('exam course student')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: results.length, results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get results for a course
router.get('/course/:courseId', authenticate, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const results = await ExamResult.find({ course: req.params.courseId })
      .populate('exam course student')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: results.length, results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get results for an exam
router.get('/exam/:examId', authenticate, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const results = await ExamResult.find({ exam: req.examId })
      .populate('exam course student')
      .sort({ marksObtained: -1 });

    res.json({ success: true, count: results.length, results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Calculate final marks (CA + Exam)
router.get('/final/:studentId/:courseId', authenticate, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const caMark = await CAMark.findOne({
      student: req.params.studentId,
      course: req.params.courseId
    });

    const examResults = await ExamResult.find({
      student: req.params.studentId,
      course: req.params.courseId
    }).populate('exam');

    // Calculate weighted final mark
    let finalMark = 0;
    if (caMark && caMark.totalCA) {
      const caPercentage = (caMark.totalCA / 40) * 100; // Assuming CA is out of 40
      finalMark += (caPercentage * course.caWeight) / 100;
    }

    if (examResults.length > 0) {
      const latestResult = examResults[0];
      finalMark += (latestResult.percentage * course.examWeight) / 100;
    }

    res.json({
      success: true,
      finalMark: finalMark.toFixed(2),
      caMarks: caMark,
      examResults
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update result
router.put('/:id', authenticate, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const result = await ExamResult.findByIdAndUpdate(
      req.params.id,
      { ...req.body, gradedBy: req.user.id, gradedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('student exam course gradedBy');

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    res.json({ success: true, message: 'Result updated', result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
