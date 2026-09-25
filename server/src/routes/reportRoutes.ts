import express from 'express'
import {
  getPaymentReport,
  getUnpaidReport,
} from '../controllers/reportController'
import { isAuthenticated, authorize } from '../middleware/auth'

const router = express.Router()

router.use(isAuthenticated)

router.get(
  '/payments',
  authorize('committee_leader', 'committee_member', 'director'),
  getPaymentReport
)
router.get(
  '/unpaid',
  authorize('committee_leader', 'committee_member', 'director'),
  getUnpaidReport
)

export default router
