const mongoose = require('mongoose');

const classLevelSchema = new mongoose.Schema(
  {
    levelName: {
      type: String,
      required: [true, 'Class level name is required'],
      unique: true
    },
    levelCode: {
      type: String,
      required: true,
      unique: true
    },
    description: String,
    academicYear: {
      type: String,
      required: true
    },
    totalStudents: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ClassLevel', classLevelSchema);
