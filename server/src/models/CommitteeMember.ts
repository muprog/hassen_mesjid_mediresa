import mongoose, { Schema, Document } from 'mongoose'

export interface ICommitteeMember extends Document {
  fullName: string
  phone: string
  email: string
  password: string
  role: 'committee_member'
  status: 'active' | 'inactive'
  createdBy: mongoose.Types.ObjectId
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

const CommitteeMemberSchema = new Schema<ICommitteeMember>(
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
      default: 'committee_member',
      enum: ['committee_member'],
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
  },
  {
    timestamps: true,
  }
)

// Indexes
CommitteeMemberSchema.index({ email: 1 }, { unique: true })
CommitteeMemberSchema.index({ status: 1 })
CommitteeMemberSchema.index({ fullName: 1 })

export const CommitteeMember = mongoose.model<ICommitteeMember>(
  'CommitteeMember',
  CommitteeMemberSchema
)
