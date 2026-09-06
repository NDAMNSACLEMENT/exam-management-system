const mongoose = require('mongoose');

const examSchema = new mongoose.Schema(
  {
    examName: {
      type: String,
      required: [true, 'Exam name is required']
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    examType: {
      type: String,
      enum: ['CA', 'Midterm', 'Final', 'Quiz'],
      required: true
    },
    totalMarks: {
      type: Number,
      required: [true, 'Total marks is required'],
      min: 1
    },
    passingMarks: {
      type: Number,
      required: true
    },
    examDate: {
      type: Date,
      required: true
    },
    description: String,
    instructions: String,
    isPublished: {
      type: Boolean,
      default: false
    },
    resultsReleased: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Exam', examSchema);
