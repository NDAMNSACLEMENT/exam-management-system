const mongoose = require('mongoose');

const caMarkSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    assignment1: {
      type: Number,
      default: 0,
      min: 0,
      max: 10
    },
    assignment2: {
      type: Number,
      default: 0,
      min: 0,
      max: 10
    },
    quiz1: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    quiz2: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    classParticipation: {
      type: Number,
      default: 0,
      min: 0,
      max: 10
    },
    totalCA: {
      type: Number,
      default: 0
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    recordedAt: Date
  },
  { timestamps: true }
);

// Calculate total CA before saving
caMarkSchema.pre('save', function(next) {
  this.totalCA = this.assignment1 + this.assignment2 + this.quiz1 + this.quiz2 + this.classParticipation;
  this.recordedAt = new Date();
  next();
});

// Create composite index
caMarkSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('CAMark', caMarkSchema);
