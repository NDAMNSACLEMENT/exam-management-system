const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    courseCode: {
      type: String,
      required: [true, 'Course code is required'],
      unique: true,
      uppercase: true
    },
    courseName: {
      type: String,
      required: [true, 'Course name is required']
    },
    description: String,
    credits: {
      type: Number,
      required: true,
      min: 1
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    classLevels: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClassLevel'
    }],
    department: String,
    semester: {
      type: String,
      enum: ['First', 'Second', 'Year'],
      required: true
    },
    academicYear: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    caWeight: {
      type: Number,
      default: 30,
      min: 0,
      max: 100
    },
    examWeight: {
      type: Number,
      default: 70,
      min: 0,
      max: 100
    }
  },
  { timestamps: true }
);

// Validate weights
courseSchema.pre('save', function(next) {
  if (this.caWeight + this.examWeight !== 100) {
    next(new Error('CA weight and Exam weight must sum to 100'));
  }
  next();
});

module.exports = mongoose.model('Course', courseSchema);
