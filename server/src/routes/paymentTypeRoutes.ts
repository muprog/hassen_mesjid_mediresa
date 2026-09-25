import express from 'express'
import {
  createPaymentType,
  getPaymentTypes,
  getPaymentTypeById,
  updatePaymentType,
  togglePaymentTypeStatus,
  deletePaymentType,
} from '../controllers/paymentTypeController'
import { isAuthenticated, authorize } from '../middleware/auth'

const router = express.Router()

router.use(isAuthenticated)

// Only Committee Leader can mutate payment types
router.post('/', authorize('committee_leader'), createPaymentType)
router.put('/:id', authorize('committee_leader'), updatePaymentType)
router.patch(
  '/:id/toggle-status',
  authorize('committee_leader'),
  togglePaymentTypeStatus
)
router.delete('/:id', authorize('committee_leader'), deletePaymentType)

// Everyone authenticated can read them
router.get('/', getPaymentTypes)
router.get('/:id', getPaymentTypeById)

export default router
