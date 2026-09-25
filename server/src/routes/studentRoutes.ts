// import express from 'express'
// import {
//   createStudent,
//   getStudents,
//   getStudentById,
//   updateStudent,
//   deleteStudent,
//   getStudentsByHaleqa,
// } from '../controllers/studentController'
// import { isAuthenticated, authorize } from '../middleware/auth'

// const router = express.Router()

// // All routes require authentication
// router.use(isAuthenticated)

// // Create student (Committee Leader & Director)
// router.post(
//   '/',
//   authorize('committee_leader', 'committee_member', 'director'),
//   createStudent
// )

// // Get all students (All authenticated users)
// router.get('/', getStudents)

// // Get students by haleqa
// router.get('/haleqa/:haleqa', getStudentsByHaleqa)

// // Get student by ID
// router.get('/:id', getStudentById)

// // Update student (Committee Leader & Director)
// router.put(
//   '/:id',
//   authorize('committee_leader', 'committee_member', 'director'),
//   updateStudent
// )

// // Delete student (Committee Leader only)
// router.delete(
//   '/:id',
//   authorize('committee_leader', 'committee_member'),
//   deleteStudent
// )

// export default router

import express from 'express'
import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentsByHaleqa,
} from '../controllers/studentController'
import { isAuthenticated, authorize } from '../middleware/auth'

const router = express.Router()

router.use(isAuthenticated)

router.post(
  '/',
  authorize('committee_leader', 'committee_member', 'director'),
  createStudent
)
router.get('/', getStudents)
router.get('/haleqa/:haleqa', getStudentsByHaleqa)
router.get('/:id', getStudentById)
router.put(
  '/:id',
  authorize('committee_leader', 'committee_member', 'director'),
  updateStudent
)
router.delete(
  '/:id',
  authorize('committee_leader', 'committee_member'),
  deleteStudent
)

export default router
