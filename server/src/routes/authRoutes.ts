import express from 'express'
import {
  registerCommitteeLeader,
  login,
  logout,
  getCurrentUser,
  checkRegistrationStatus,
  checkAuthStatus,
  forgotPassword,
  verifyOtp,
  resetPassword,
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

router.post('/forgot-password', forgotPassword)
router.post('/verify-otp', verifyOtp)
router.post('/reset-password', resetPassword)

export default router
