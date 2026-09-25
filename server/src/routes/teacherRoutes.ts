// import express from 'express'
// import {
//   createTeacher,
//   getTeachers,
//   getTeacherById,
//   updateTeacher,
//   deleteTeacher,
//   assignStudent,
//   removeStudent,
// } from '../controllers/teacherController'
// import { isAuthenticated, authorize } from '../middleware/auth'

// const router = express.Router()

// // All routes require authentication
// router.use(isAuthenticated)

// // Create teacher (Committee Leader & Director)
// router.post(
//   '/',
//   authorize('committee_leader', 'committee_member', 'director'),
//   createTeacher
// )

// // Get all teachers (All authenticated users)
// router.get('/', getTeachers)

// // Get teacher by ID
// router.get('/:id', getTeacherById)

// // Update teacher (Committee Leader & Director)
// router.put(
//   '/:id',
//   authorize('committee_leader', 'committee_member', 'director'),
//   updateTeacher
// )

// // Delete teacher (Committee Leader only)
// router.delete(
//   '/:id',
//   authorize('committee_leader', 'committee_member'),
//   deleteTeacher
// )

// // Assign/Remove student (Committee Leader & Director)
// router.post(
//   '/:teacherId/assign/:studentId',
//   authorize('committee_leader', 'committee_member', 'director'),
//   assignStudent
// )
// router.delete(
//   '/:teacherId/remove/:studentId',
//   authorize('committee_leader', 'committee_member', 'director'),
//   removeStudent
// )

// export default router

import express from 'express'
import {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
} from '../controllers/teacherController'
import { isAuthenticated, authorize } from '../middleware/auth'

const router = express.Router()

// All routes require authentication
router.use(isAuthenticated)

// Create teacher (Committee Leader & Director)
router.post(
  '/',
  authorize('committee_leader', 'committee_member', 'director'),
  createTeacher
)

// Get all teachers (All authenticated users)
router.get('/', getTeachers)

// Get teacher by ID
router.get('/:id', getTeacherById)

// Update teacher (Committee Leader & Director)
router.put(
  '/:id',
  authorize('committee_leader', 'committee_member', 'director'),
  updateTeacher
)

// Delete teacher (Committee Leader only)
router.delete(
  '/:id',
  authorize('committee_leader', 'committee_member'),
  deleteTeacher
)

export default router
