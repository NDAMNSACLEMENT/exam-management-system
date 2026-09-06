const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const User = require('../models/User');
const ClassLevel = require('../models/ClassLevel');
const Course = require('../models/Course');

// Middleware to check admin role
const adminOnly = [authenticate, authorize('admin')];

// Get all users
router.get('/users', adminOnly, async (req, res) => {
  try {
    const { role, isActive } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const users = await User.find(filter)
      .populate('classLevel')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create class level
router.post('/class-levels', adminOnly, async (req, res) => {
  try {
    const { levelName, levelCode, description, academicYear } = req.body;

    const classLevel = new ClassLevel({
      levelName,
      levelCode,
      description,
      academicYear
    });

    await classLevel.save();
    res.status(201).json({ success: true, message: 'Class level created', classLevel });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all class levels
router.get('/class-levels', adminOnly, async (req, res) => {
  try {
    const classLevels = await ClassLevel.find().sort({ createdAt: -1 });
    res.json({ success: true, count: classLevels.length, classLevels });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update class level
router.put('/class-levels/:id', adminOnly, async (req, res) => {
  try {
    const classLevel = await ClassLevel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!classLevel) {
      return res.status(404).json({ message: 'Class level not found' });
    }

    res.json({ success: true, message: 'Class level updated', classLevel });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete class level
router.delete('/class-levels/:id', adminOnly, async (req, res) => {
  try {
    const classLevel = await ClassLevel.findByIdAndDelete(req.params.id);

    if (!classLevel) {
      return res.status(404).json({ message: 'Class level not found' });
    }

    res.json({ success: true, message: 'Class level deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user role
router.put('/users/:id/role', adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true, message: 'User role updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Deactivate user
router.put('/users/:id/deactivate', adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true, message: 'User deactivated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get dashboard statistics
router.get('/statistics', adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    const totalCourses = await Course.countDocuments();
    const totalClassLevels = await ClassLevel.countDocuments();

    res.json({
      success: true,
      statistics: {
        totalUsers,
        totalStudents,
        totalInstructors,
        totalCourses,
        totalClassLevels
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
