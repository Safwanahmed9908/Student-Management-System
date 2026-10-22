const Student = require('../models/Student');

// @desc    Get all students (with optional search filter)
// @route   GET /api/students
// @access  Private
const getStudents = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query = {
        $or: [
          { name: searchRegex },
          { rollNumber: searchRegex },
          { department: searchRegex },
          { email: searchRegex },
        ],
      };
    }

    const students = await Student.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching students',
    });
  }
};

// @desc    Get single student by ID
// @route   GET /api/students/:id
// @access  Private
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student record not found',
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Invalid Student ID format',
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching student',
    });
  }
};

// @desc    Create new student
// @route   POST /api/students
// @access  Private
const createStudent = async (req, res) => {
  try {
    const { name, rollNumber, email, department, year } = req.body;

    // Validate required fields
    if (!name || !rollNumber || !email || !department || !year) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, rollNumber, email, department, year',
      });
    }

    // Check if rollNumber already exists
    const existingStudent = await Student.findOne({ rollNumber: rollNumber.trim().toUpperCase() });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: `Student with roll number ${rollNumber} already exists`,
      });
    }

    const student = await Student.create({
      name: name.trim(),
      rollNumber: rollNumber.trim().toUpperCase(),
      email: email.trim().toLowerCase(),
      department: department.trim(),
      year: year.trim(),
    });

    res.status(201).json({
      success: true,
      data: student,
      message: 'Student record created successfully',
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate value entered for a unique field',
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating student record',
    });
  }
};

// @desc    Update student by ID
// @route   PUT /api/students/:id
// @access  Private
const updateStudent = async (req, res) => {
  try {
    const { name, rollNumber, email, department, year } = req.body;

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student record not found',
      });
    }

    // Check if updated rollNumber conflicts with another student
    if (rollNumber && rollNumber.trim().toUpperCase() !== student.rollNumber) {
      const duplicate = await Student.findOne({
        rollNumber: rollNumber.trim().toUpperCase(),
        _id: { $ne: req.params.id },
      });
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: `Another student already has roll number ${rollNumber}`,
        });
      }
    }

    const updatedData = {
      ...(name && { name: name.trim() }),
      ...(rollNumber && { rollNumber: rollNumber.trim().toUpperCase() }),
      ...(email && { email: email.trim().toLowerCase() }),
      ...(department && { department: department.trim() }),
      ...(year && { year: year.trim() }),
    };

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedStudent,
      message: 'Student record updated successfully',
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Invalid Student ID format',
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating student',
    });
  }
};

// @desc    Delete student by ID
// @route   DELETE /api/students/:id
// @access  Private
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student record not found',
      });
    }

    await Student.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
      message: 'Student record deleted successfully',
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Invalid Student ID format',
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting student',
    });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
