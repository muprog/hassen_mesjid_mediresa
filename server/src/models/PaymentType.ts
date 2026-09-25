import mongoose, { Schema, Document, Types } from 'mongoose'

export type PaymentPeriod = 'monthly' | 'one-time' | 'yearly'

export interface IPaymentType extends Document {
  name: string
  defaultAmount: number
  period: PaymentPeriod
  isActive: boolean
  createdBy: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const PaymentTypeSchema = new Schema<IPaymentType>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      unique: true,
    },
    defaultAmount: {
      type: Number,
      required: [true, 'Default amount is required'],
      min: 0,
    },
    period: {
      type: String,
      enum: ['monthly', 'one-time', 'yearly'],
      default: 'monthly',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

PaymentTypeSchema.index({ name: 1 }, { unique: true })
PaymentTypeSchema.index({ isActive: 1 })

export const PaymentType = mongoose.model<IPaymentType>(
  'PaymentType',
  PaymentTypeSchema
)
