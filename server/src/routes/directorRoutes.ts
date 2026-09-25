import express from 'express'
import {
  createDirector,
  getDirectors,
  getDirectorById,
  updateDirector,
  toggleDirectorStatus,
  deleteDirector,
} from '../controllers/directorController'
import { isAuthenticated, authorize } from '../middleware/auth'

const router = express.Router()

// All routes require authentication
router.use(isAuthenticated)

// Only Committee Leader can manage directors
router.use(authorize('committee_leader'))

// Create director
router.post('/', createDirector)

// Get all directors
router.get('/', getDirectors)

// Get director by ID
router.get('/:id', getDirectorById)

// Update director
router.put('/:id', updateDirector)

// Toggle director status (Activate/Deactivate)
router.patch('/:id/toggle-status', toggleDirectorStatus)

// Delete director
router.delete('/:id', deleteDirector)

export default router
