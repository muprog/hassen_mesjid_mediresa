import { Request, Response } from 'express'
import { PaymentType, PaymentPeriod } from '../models/PaymentType'

interface CreatePaymentTypeBody {
  name: string
  defaultAmount: number | string
  period?: PaymentPeriod
}

interface UpdatePaymentTypeBody {
  name?: string
  defaultAmount?: number | string
  period?: PaymentPeriod
  isActive?: boolean
}

interface PaymentTypeFilter {
  isActive?: boolean
  $or?: Array<Record<string, { $regex: string; $options: string }>>
}

const getErrorMessage = (err: unknown): string =>
  err instanceof Error ? err.message : 'Unknown error'

// CREATE
export const createPaymentType = async (
  req: Request<{}, {}, CreatePaymentTypeBody>,
  res: Response
): Promise<Response> => {
  try {
    const { name, defaultAmount, period } = req.body

    if (!name || defaultAmount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'name and defaultAmount are required',
      })
    }

    const existing = await PaymentType.findOne({ name: name.trim() })
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Payment type with this name already exists',
      })
    }

    const paymentType = new PaymentType({
      name: name.trim(),
      defaultAmount: Number(defaultAmount),
      period: period ?? 'monthly',
      isActive: true,
      createdBy: req.user?._id,
    })

    await paymentType.save()

    return res.status(201).json({
      success: true,
      message: 'Payment type created successfully',
      data: paymentType,
    })
  } catch (err) {
    console.error('Create payment type error:', getErrorMessage(err))
    return res.status(500).json({
      success: false,
      message: 'Error creating payment type',
    })
  }
}

// GET ALL
export const getPaymentTypes = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { search, activeOnly } = req.query

    const filter: PaymentTypeFilter = {}
    if (activeOnly === 'true') filter.isActive = true

    if (typeof search === 'string') {
      filter.$or = [{ name: { $regex: search, $options: 'i' } }]
    }

    const types = await PaymentType.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      count: types.length,
      data: types,
    })
  } catch (err) {
    console.error('Get payment types error:', getErrorMessage(err))
    return res.status(500).json({
      success: false,
      message: 'Error fetching payment types',
    })
  }
}

// GET BY ID
export const getPaymentTypeById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<Response> => {
  try {
    const type = await PaymentType.findById(req.params.id).populate(
      'createdBy',
      'name email'
    )

    if (!type) {
      return res.status(404).json({
        success: false,
        message: 'Payment type not found',
      })
    }

    return res.status(200).json({ success: true, data: type })
  } catch (err) {
    console.error('Get payment type error:', getErrorMessage(err))
    return res.status(500).json({
      success: false,
      message: 'Error fetching payment type',
    })
  }
}

// UPDATE
export const updatePaymentType = async (
  req: Request<{ id: string }, {}, UpdatePaymentTypeBody>,
  res: Response
): Promise<Response> => {
  try {
    const type = await PaymentType.findById(req.params.id)
    if (!type) {
      return res.status(404).json({
        success: false,
        message: 'Payment type not found',
      })
    }

    const { name, defaultAmount, period, isActive } = req.body

    if (name && name.trim() !== type.name) {
      const existing = await PaymentType.findOne({ name: name.trim() })
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Payment type with this name already exists',
        })
      }
      type.name = name.trim()
    }

    if (defaultAmount !== undefined) type.defaultAmount = Number(defaultAmount)
    if (period !== undefined) type.period = period
    if (isActive !== undefined) type.isActive = isActive

    await type.save()

    return res.status(200).json({
      success: true,
      message: 'Payment type updated successfully',
      data: type,
    })
  } catch (err) {
    console.error('Update payment type error:', getErrorMessage(err))
    return res.status(500).json({
      success: false,
      message: 'Error updating payment type',
    })
  }
}

// TOGGLE ACTIVE
export const togglePaymentTypeStatus = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<Response> => {
  try {
    const type = await PaymentType.findById(req.params.id)
    if (!type) {
      return res.status(404).json({
        success: false,
        message: 'Payment type not found',
      })
    }

    type.isActive = !type.isActive
    await type.save()

    return res.status(200).json({
      success: true,
      message: `Payment type ${type.isActive ? 'activated' : 'deactivated'}`,
      data: type,
    })
  } catch (err) {
    console.error('Toggle payment type error:', getErrorMessage(err))
    return res.status(500).json({
      success: false,
      message: 'Error toggling payment type',
    })
  }
}

// DELETE (hard — payment types don't hold historical data; payments do)
export const deletePaymentType = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<Response> => {
  try {
    const type = await PaymentType.findById(req.params.id)
    if (!type) {
      return res.status(404).json({
        success: false,
        message: 'Payment type not found',
      })
    }

    await type.deleteOne()

    return res.status(200).json({
      success: true,
      message: 'Payment type deleted successfully',
    })
  } catch (err) {
    console.error('Delete payment type error:', getErrorMessage(err))
    return res.status(500).json({
      success: false,
      message: 'Error deleting payment type',
    })
  }
}
