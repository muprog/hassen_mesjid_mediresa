import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  email: string
  password: string
  role:
    | 'committee_leader'
    | 'committee_member'
    | 'director'
    | 'teacher'
    | 'student'
  name: string
  phone: string
  gender: 'male' | 'female'
  age: number
  isActive: boolean
  createdBy: mongoose.Types.ObjectId | null
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

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true, // <-- This already creates an index
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [
        'committee_leader',
        'committee_member',
        'director',
        'teacher',
        'student',
      ],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
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

// Remove these duplicate index definitions
// UserSchema.index({ email: 1 }); // <-- REMOVE THIS
// UserSchema.index({ role: 1 });   // Keep this if you need role index

// Only keep the role index if needed
UserSchema.index({ role: 1 })

export const User = mongoose.model<IUser>('User', UserSchema)
