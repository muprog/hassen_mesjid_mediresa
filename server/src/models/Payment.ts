// import mongoose, { Schema, Document, Types } from 'mongoose'

// export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'waived'
// export type PaymentMethod = 'cash' | 'bank' | 'mobile_money' | 'other'

// export interface IPayment extends Document {
//   student: Types.ObjectId
//   paymentType?: Types.ObjectId | null
//   typeName?: string // snapshot
//   typeAmount?: number // snapshot
//   periodYear: number
//   periodMonth: number // 1-12
//   periodLabel: string // "September 2026"
//   amountDue: number
//   amountPaid: number
//   status: PaymentStatus
//   paidDate?: Date | null
//   method?: PaymentMethod | null
//   receivedBy?: Types.ObjectId | null
//   note?: string
//   createdBy: Types.ObjectId
//   isActive: boolean
//   createdAt: Date
//   updatedAt: Date
// }

// const PaymentSchema = new Schema<IPayment>(
//   {
//     student: {
//       type: Schema.Types.ObjectId,
//       ref: 'Student',
//       required: true,
//     },
//     paymentType: {
//       type: Schema.Types.ObjectId,
//       ref: 'PaymentType',
//       default: null,
//     },
//     typeName: { type: String, trim: true, default: '' },
//     typeAmount: { type: Number, default: 0 },
//     periodYear: { type: Number, required: true },
//     periodMonth: { type: Number, required: true, min: 1, max: 12 },
//     periodLabel: { type: String, required: true, trim: true },
//     amountDue: { type: Number, default: 0, min: 0 },
//     amountPaid: { type: Number, default: 0, min: 0 },
//     status: {
//       type: String,
//       enum: ['pending', 'partial', 'paid', 'waived'],
//       default: 'pending',
//     },
//     paidDate: { type: Date, default: null },
//     method: {
//       type: String,
//       enum: ['cash', 'bank', 'mobile_money', 'other', null],
//       default: null,
//     },
//     receivedBy: {
//       type: Schema.Types.ObjectId,
//       ref: 'User',
//       default: null,
//     },
//     note: { type: String, trim: true, default: '' },
//     createdBy: {
//       type: Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     isActive: { type: Boolean, default: true },
//   },
//   { timestamps: true }
// )

// // one record per student per month/year
// PaymentSchema.index(
//   { student: 1, periodYear: 1, periodMonth: 1 },
//   { unique: true }
// )
// PaymentSchema.index({ periodYear: 1, periodMonth: 1 })
// PaymentSchema.index({ status: 1 })
// PaymentSchema.index({ student: 1 })

// export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema)

import mongoose, { Schema, Document, Types } from 'mongoose'

export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'waived'
export type PaymentMethod = 'cash' | 'bank' | 'mobile_money' | 'other'

export interface IPayment extends Document {
  student: Types.ObjectId
  paymentType?: Types.ObjectId | null
  typeName?: string
  typeAmount?: number
  periodYear: number
  periodMonth: number
  periodLabel: string
  amountDue: number
  amountPaid: number
  status: PaymentStatus
  paidDate?: Date | null
  method?: PaymentMethod | null
  receivedBy?: Types.ObjectId | null
  note?: string
  createdBy: Types.ObjectId
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const PaymentSchema = new Schema<IPayment>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    paymentType: {
      type: Schema.Types.ObjectId,
      ref: 'PaymentType',
      default: null,
    },
    typeName: { type: String, trim: true, default: '' },
    typeAmount: { type: Number, default: 0 },
    periodYear: { type: Number, required: true },
    periodMonth: { type: Number, required: true, min: 1, max: 12 },
    periodLabel: { type: String, required: true, trim: true },
    amountDue: { type: Number, default: 0, min: 0 },
    amountPaid: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'partial', 'paid', 'waived'],
      default: 'pending',
    },
    paidDate: { type: Date, default: null },
    method: {
      type: String,
      enum: ['cash', 'bank', 'mobile_money', 'other', null],
      default: null,
    },
    receivedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    note: { type: String, trim: true, default: '' },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

PaymentSchema.index(
  { student: 1, periodYear: 1, periodMonth: 1 },
  { unique: true }
)
PaymentSchema.index({ periodYear: 1, periodMonth: 1 })
PaymentSchema.index({ status: 1 })
PaymentSchema.index({ student: 1 })

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema)
