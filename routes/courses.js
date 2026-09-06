const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const Course = require('../models/Course');
const User = require('../models/User');

// Create course (admin or instructor)
router.post('/', authenticate, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const { courseCode, courseName, credits, classLevels, department, semester, academicYear, caWeight, examWeight } = req.body;

    const course = new Course({
      courseCode,
      courseName,
      credits,
      instructor: req.user.id,
      classLevels,
      department,
      semester,
      academicYear,
      caWeight: caWeight || 30,
      examWeight: examWeight || 70
    });

    await course.save();
    await course.populate('instructor classLevels');

    res.status(201).json({ success: true, message: 'Course created', course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all courses
router.get('/', authenticate, async (req, res) => {
  try {
    const { academicYear, semester } = req.query;
    const filter = { isActive: true };

    if (academicYear) filter.academicYear = academicYear;
    if (semester) filter.semester = semester;

    const courses = await Course.find(filter)
      .populate('instructor classLevels')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: courses.length, courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get course by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor classLevels');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update course
router.put('/:id', authenticate, authorize('admin', 'instructor'), async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('instructor classLevels');

    res.json({ success: true, message: 'Course updated', course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete course
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ success: true, message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get instructor's courses
router.get('/instructor/:instructorId', authenticate, async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.params.instructorId, isActive: true })
      .populate('instructor classLevels');

    res.json({ success: true, count: courses.length, courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
