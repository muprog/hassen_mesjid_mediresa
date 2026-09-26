import mongoose, { Schema, Document } from 'mongoose'

export interface ITeacher extends Document {
  // Personal Information
  role: 'teacher'
  fullName: string
  age: number
  phone: string

  // Professional Information
  experience: number // years of experience
  kitabLearned: string[] // Array of books they've learned/teach
  password: string // <- required for login
  lastLogin?: Date
  // Status
  status: 'active' | 'inactive' | 'on_leave'

  // System fields
  createdBy: mongoose.Types.ObjectId
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  // interface additions
  resetOtpHash?: string | null
  resetOtpExpiresAt?: Date | null
  resetOtpAttempts: number
  resetOtpVerified: boolean
  resetToken?: string | null
  resetTokenExpiresAt?: Date | null
}

const TeacherSchema = new Schema<ITeacher>(
  {
    role: {
      type: String,
      default: 'teacher',
      enum: ['teacher'],
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: 18,
      max: 100,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    experience: {
      type: Number,
      required: [true, 'Experience is required'],
      min: 0,
      default: 0,
    },
    kitabLearned: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'on_leave'],
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
    // schema additions
    resetOtpHash: { type: String, default: null },
    resetOtpExpiresAt: { type: Date, default: null },
    resetOtpAttempts: { type: Number, default: 0 },
    resetOtpVerified: { type: Boolean, default: false },
    resetToken: { type: String, default: null },
    resetTokenExpiresAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
)

// Indexes for faster queries
TeacherSchema.index({ fullName: 1 })
TeacherSchema.index({ phone: 1 })
TeacherSchema.index({ status: 1 })

export const Teacher = mongoose.model<ITeacher>('Teacher', TeacherSchema)
