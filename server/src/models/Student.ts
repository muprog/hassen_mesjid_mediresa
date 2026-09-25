// import mongoose, { Schema, Document } from 'mongoose'

// export interface IStudent extends Document {
//   // Personal Information
//   fullName: string
//   age: number
//   gender: 'male' | 'female'

//   // Academic Information
//   haleqa: string
//   section: 'A' | 'B' | 'C' | 'D'

//   // Status
//   status: 'active' | 'inactive' | 'graduated' | 'transferred'

//   // System fields
//   createdBy: mongoose.Types.ObjectId
//   isActive: boolean
//   createdAt: Date
//   updatedAt: Date
// }

// const StudentSchema = new Schema<IStudent>(
//   {
//     fullName: {
//       type: String,
//       required: [true, 'Full name is required'],
//       trim: true,
//     },
//     age: {
//       type: Number,
//       required: [true, 'Age is required'],
//       min: 4,
//       max: 100,
//     },
//     gender: {
//       type: String,
//       enum: ['male', 'female'],
//       required: [true, 'Gender is required'],
//     },
//     haleqa: {
//       type: String,
//       required: [true, 'Haleqa is required'],
//       trim: true,
//     },
//     section: {
//       type: String,
//       enum: ['A', 'B', 'C', 'D'],
//       required: [true, 'Section is required'],
//     },
//     status: {
//       type: String,
//       enum: ['active', 'inactive', 'graduated', 'transferred'],
//       default: 'active',
//     },
//     createdBy: {
//       type: Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// )

// // Indexes for faster queries
// StudentSchema.index({ haleqa: 1, section: 1 })
// StudentSchema.index({ fullName: 1 })
// StudentSchema.index({ status: 1 })

// export const Student = mongoose.model<IStudent>('Student', StudentSchema)
import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IStudent extends Document {
  // Personal Information
  code: string
  fullName: string
  age: number
  gender: 'male' | 'female'
  fatherPhone?: string
  motherPhone?: string

  // Academic Information
  haleqa: string
  section: 'A' | 'B' | 'C' | 'D'
  quranLevel?: string // free-text description

  // Payment
  hasPayment: boolean
  paymentType?: Types.ObjectId // ref PaymentType (required if hasPayment=true)
  defaultAmount?: number // saved after first payment

  // Status
  status: 'active' | 'inactive' | 'graduated' | 'transferred'

  // System fields
  createdBy: Types.ObjectId
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const StudentSchema = new Schema<IStudent>(
  {
    code: {
      type: String,
      required: [true, 'Student code is required'],
      unique: true, // <- this alone creates an index
      trim: true,
      uppercase: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: 4,
      max: 100,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: [true, 'Gender is required'],
    },
    fatherPhone: {
      type: String,
      trim: true,
      default: '',
    },
    motherPhone: {
      type: String,
      trim: true,
      default: '',
    },
    haleqa: {
      type: String,
      required: [true, 'Haleqa is required'],
      trim: true,
    },
    section: {
      type: String,
      enum: ['A', 'B', 'C', 'D'],
      required: [true, 'Section is required'],
    },
    quranLevel: {
      type: String,
      trim: true,
      default: '',
    },
    hasPayment: {
      type: Boolean,
      default: true,
    },
    paymentType: {
      type: Schema.Types.ObjectId,
      ref: 'PaymentType',
      default: null,
    },
    defaultAmount: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'graduated', 'transferred'],
      default: 'active',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

StudentSchema.index({ haleqa: 1, section: 1 })
StudentSchema.index({ fullName: 1 })
StudentSchema.index({ status: 1 })
StudentSchema.index({ hasPayment: 1 })

export const Student = mongoose.model<IStudent>('Student', StudentSchema)
