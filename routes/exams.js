const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const Exam = require('../models/Exam');
const ExamResult = require('../models/ExamResult');
const CAMark = require('../models/CAMark');
const Course = require('../models/Course');

// Create exam (instructor or admin)
router.post('/', authenticate, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const { examName, course, examType, totalMarks, passingMarks, examDate, description, instructions } = req.body;

    const exam = new Exam({
      examName,
      course,
      examType,
      totalMarks,
      passingMarks,
      examDate,
      description,
      instructions,
      createdBy: req.user.id
    });

    await exam.save();
    await exam.populate('course createdBy');

    res.status(201).json({ success: true, message: 'Exam created', exam });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all exams
router.get('/', authenticate, async (req, res) => {
  try {
    const { course, examType } = req.query;
    const filter = {};

    if (course) filter.course = course;
    if (examType) filter.examType = examType;

    const exams = await Exam.find(filter)
      .populate('course createdBy')
      .sort({ examDate: -1 });

    res.json({ success: true, count: exams.length, exams });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get exam by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate('course createdBy');

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    res.json({ success: true, exam });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update exam
router.put('/:id', authenticate, authorize('admin', 'instructor'), async (req, res) => {
  try {
    let exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    exam = await Exam.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('course createdBy');

    res.json({ success: true, message: 'Exam updated', exam });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Publish exam results
router.put('/:id/publish', authenticate, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      { resultsReleased: true },
      { new: true }
    ).populate('course createdBy');

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    res.json({ success: true, message: 'Exam results published', exam });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Record CA marks
router.post('/ca/record', authenticate, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const { student, course, assignment1, assignment2, quiz1, quiz2, classParticipation } = req.body;

    let caMark = await CAMark.findOne({ student, course });

    if (caMark) {
      caMark.assignment1 = assignment1 || caMark.assignment1;
      caMark.assignment2 = assignment2 || caMark.assignment2;
      caMark.quiz1 = quiz1 || caMark.quiz1;
      caMark.quiz2 = quiz2 || caMark.quiz2;
      caMark.classParticipation = classParticipation || caMark.classParticipation;
    } else {
      caMark = new CAMark({
        student,
        course,
        assignment1,
        assignment2,
        quiz1,
        quiz2,
        classParticipation
      });
    }

    caMark.recordedBy = req.user.id;
    await caMark.save();
    await caMark.populate('student course recordedBy');

    res.json({ success: true, message: 'CA marks recorded', caMark });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get CA marks for a student and course
router.get('/ca/:studentId/:courseId', authenticate, async (req, res) => {
  try {
    const caMark = await CAMark.findOne({
      student: req.params.studentId,
      course: req.params.courseId
    }).populate('student course recordedBy');

    if (!caMark) {
      return res.status(404).json({ message: 'CA marks not found' });
    }

    res.json({ success: true, caMark });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
