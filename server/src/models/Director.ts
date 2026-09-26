import mongoose, { Schema, Document } from 'mongoose'

export interface IDirector extends Document {
  fullName: string
  phone: string
  email: string
  password: string
  role: 'director'
  status: 'active' | 'inactive'
  createdBy: mongoose.Types.ObjectId
  isActive: boolean
  lastLogin?: Date
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

const DirectorSchema = new Schema<IDirector>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      default: 'director',
      enum: ['director'],
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
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
    lastLogin: {
      type: Date,
      default: null,
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

// Indexes
DirectorSchema.index({ email: 1 }, { unique: true })
DirectorSchema.index({ status: 1 })
DirectorSchema.index({ fullName: 1 })

export const Director = mongoose.model<IDirector>('Director', DirectorSchema)
