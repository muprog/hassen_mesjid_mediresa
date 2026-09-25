import express from 'express'
import {
  registerCommitteeLeader,
  login,
  logout,
  getCurrentUser,
  checkRegistrationStatus,
  checkAuthStatus,
} from '../controllers/authController'
import {
  isAuthenticated,
  checkRegistrationStatus as checkRegistration,
} from '../middleware/auth'

const router = express.Router()

router.get('/registration-status', checkRegistrationStatus)
router.get('/check-auth', checkAuthStatus)
router.post('/register', checkRegistration, registerCommitteeLeader)
router.post('/login', login)
router.post('/logout', isAuthenticated, logout)
router.get('/me', isAuthenticated, getCurrentUser)

export default router
