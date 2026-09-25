import express from 'express'
import {
  createCommitteeMember,
  getCommitteeMembers,
  getCommitteeMemberById,
  updateCommitteeMember,
  toggleMemberStatus,
  deleteCommitteeMember,
} from '../controllers/committeeMemberController'
import { isAuthenticated, authorize } from '../middleware/auth'

const router = express.Router()

// All routes require authentication
router.use(isAuthenticated)

// Only Committee Leader can manage committee members
router.use(authorize('committee_leader'))

// Create committee member
router.post('/', createCommitteeMember)

// Get all committee members
router.get('/', getCommitteeMembers)

// Get committee member by ID
router.get('/:id', getCommitteeMemberById)

// Update committee member
router.put('/:id', updateCommitteeMember)

// Toggle member status (Activate/Deactivate)
router.patch('/:id/toggle-status', toggleMemberStatus)

// Delete committee member
router.delete('/:id', deleteCommitteeMember)

export default router
