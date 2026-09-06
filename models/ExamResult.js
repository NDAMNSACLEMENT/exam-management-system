const mongoose = require('mongoose');

const examResultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      required: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    marksObtained: {
      type: Number,
      required: true,
      min: 0
    },
    totalMarks: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100
    },
    grade: {
      type: String,
      enum: ['A', 'B', 'C', 'D', 'E', 'F'],
      default: null
    },
    isPassed: Boolean,
    remarks: String,
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    gradedAt: Date,
    status: {
      type: String,
      enum: ['pending', 'graded', 'submitted'],
      default: 'submitted'
    }
  },
  { timestamps: true }
);

// Calculate percentage and grade before saving
examResultSchema.pre('save', function(next) {
  if (this.totalMarks > 0) {
    this.percentage = (this.marksObtained / this.totalMarks) * 100;
    
    // Grade calculation
    if (this.percentage >= 90) this.grade = 'A';
    else if (this.percentage >= 80) this.grade = 'B';
    else if (this.percentage >= 70) this.grade = 'C';
    else if (this.percentage >= 60) this.grade = 'D';
    else if (this.percentage >= 50) this.grade = 'E';
    else this.grade = 'F';
  }
  next();
});

// Create composite index to prevent duplicate submissions
examResultSchema.index({ student: 1, exam: 1 }, { unique: true });

module.exports = mongoose.model('ExamResult', examResultSchema);
