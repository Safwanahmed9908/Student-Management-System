const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true,
  },
  rollNumber: {
    type: String,
    required: [true, 'Roll number is required'],
    unique: true,
    trim: true,
    uppercase: true,
  },
  email: {
    type: String,
    required: [true, 'Student email is required'],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address',
    ],
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
  },
  year: {
    type: String,
    required: [true, 'Academic year is required'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Student', studentSchema);
