const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

// All student routes are protected with JWT authentication
router.use(protect);

router.route('/')
  .get(getStudents)
  .post(createStudent);

router.route('/:id')
  .get(getStudentById)
  .put(updateStudent)
  .delete(deleteStudent);

module.exports = router;
