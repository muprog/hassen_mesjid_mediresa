import { Request, Response } from 'express'
import { User, IUser } from '../models/User'
import { Director, IDirector } from '../models/Director'
import { CommitteeMember, ICommitteeMember } from '../models/CommitteeMember'
import { Teacher, ITeacher } from '../models/Teacher'
import { hashPassword, comparePassword } from '../utils/bcrypt'
import { setAuthCookie, clearAuthCookie, verifyCookie } from '../utils/cookie'
import crypto from 'crypto'
import { sendOtpEmail } from '../utils/email'

// Unified user type used for login and cookies
type LoginUser = IUser | IDirector | ICommitteeMember | ITeacher

interface FoundUser {
  user: LoginUser
  role: 'committee_leader' | 'committee_member' | 'director' | 'teacher'
}

// Look up an email across all auth-enabled collections
async function findUserByEmail(email: string): Promise<FoundUser | null> {
  const normalized = email.toLowerCase()

  // 1. Committee Leader (User collection)
  const leader = await User.findOne({ email: normalized })
  if (leader) return { user: leader, role: 'committee_leader' }

  // 2. Directors
  const director = await Director.findOne({ email: normalized })
  if (director) return { user: director, role: 'director' }

  // 3. Committee Members
  const member = await CommitteeMember.findOne({ email: normalized })
  if (member) return { user: member, role: 'committee_member' }

  // 4. Teachers
  const teacher = await Teacher.findOne({ email: normalized })
  if (teacher) return { user: teacher, role: 'teacher' }

  return null
}

// Look up by id + role (used by checkAuth / getCurrentUser)
async function findUserByIdAndRole(
  id: string,
  role: string
): Promise<LoginUser | null> {
  switch (role) {
    case 'committee_leader':
      return User.findById(id)
    case 'director':
      return Director.findById(id)
    case 'committee_member':
      return CommitteeMember.findById(id)
    case 'teacher':
      return Teacher.findById(id)
    default:
      return null
  }
}

// Shape a user into the response object the frontend expects
function toUserResponse(user: LoginUser, role: string) {
  const base = user as unknown as {
    _id: unknown
    email: string
    phone?: string
    isActive: boolean
    createdAt?: Date
    updatedAt?: Date
    lastLogin?: Date
  }

  // `name` exists on User, `fullName` exists on others
  const anyUser = user as unknown as { name?: string; fullName?: string }

  return {
    _id: String(base._id),
    email: base.email,
    name: anyUser.name ?? anyUser.fullName ?? '',
    role,
    phone: base.phone ?? '',
    gender: (user as unknown as { gender?: string }).gender ?? '',
    age: (user as unknown as { age?: number }).age ?? 0,
    isActive: base.isActive,
    createdAt: base.createdAt,
    updatedAt: base.updatedAt,
    lastLogin: base.lastLogin,
  }
}

// ============================================
// REGISTER COMMITTEE LEADER (unchanged)
// ============================================
export const registerCommitteeLeader = async (req: Request, res: Response) => {
  try {
    const { email, password, name, phone, gender, age } = req.body

    if (!email || !password || !name || !phone || !gender || !age) {
      return res.status(400).json({
        success: false,
        message:
          'All fields are required: email, password, name, phone, gender, age',
      })
    }

    const committeeLeaderExists = await User.findOne({
      role: 'committee_leader',
    })
    if (committeeLeaderExists) {
      return res.status(403).json({
        success: false,
        message: 'Registration is disabled. Committee Leader already exists.',
        isRegistrationDisabled: true,
      })
    }

    const emailExists = await User.findOne({ email: email.toLowerCase() })
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered. Please use a different email.',
      })
    }

    const hashedPassword = await hashPassword(password)

    const user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'committee_leader',
      name,
      phone,
      gender,
      age: parseInt(age),
      isActive: true,
      createdBy: null,
    })

    await user.save()
    setAuthCookie(res, user)
    user.lastLogin = new Date()
    await user.save()

    return res.status(201).json({
      success: true,
      message: 'Committee Leader registered successfully!',
      user: toUserResponse(user, 'committee_leader'),
    })
  } catch (error) {
    console.error('Registration error:', error)
    return res.status(500).json({
      success: false,
      message: 'Error registering Committee Leader. Please try again.',
    })
  }
}

// ============================================
// LOGIN (checks ALL collections)
// ============================================
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      })
    }

    const found = await findUserByEmail(email)
    if (!found) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      })
    }

    const { user, role } = found

    if (!user.isActive || ('status' in user && user.status === 'inactive')) {
      return res.status(403).json({
        success: false,
        message: 'Account is disabled. Please contact administrator.',
      })
    }

    const isPasswordValid = await comparePassword(password, user?.password)
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      })
    }

    setAuthCookie(res, user)
    user.lastLogin = new Date()
    await user.save()

    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      user: toUserResponse(user, role),
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({
      success: false,
      message: 'Error logging in. Please try again.',
    })
  }
}

// ============================================
// LOGOUT
// ============================================
export const logout = async (_req: Request, res: Response) => {
  try {
    clearAuthCookie(res)
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully!',
    })
  } catch (error) {
    console.error('Logout error:', error)
    return res.status(500).json({
      success: false,
      message: 'Error logging out.',
    })
  }
}

// ============================================
// GET CURRENT USER
// ============================================
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      })
    }

    return res.status(200).json({
      success: true,
      user: toUserResponse(req.user, req.user.role),
    })
  } catch (error) {
    console.error('Get current user error:', error)
    return res.status(500).json({
      success: false,
      message: 'Error fetching user data.',
    })
  }
}

// ============================================
// CHECK REGISTRATION STATUS
// ============================================
export const checkRegistrationStatus = async (_req: Request, res: Response) => {
  try {
    const committeeLeaderExists = await User.findOne({
      role: 'committee_leader',
    })

    return res.status(200).json({
      success: true,
      isRegistrationDisabled: !!committeeLeaderExists,
      hasCommitteeLeader: !!committeeLeaderExists,
    })
  } catch (error) {
    console.error('Check registration status error:', error)
    return res.status(500).json({
      success: false,
      message: 'Error checking registration status.',
    })
  }
}

// ============================================
// CHECK AUTH STATUS
// ============================================
export const checkAuthStatus = async (req: Request, res: Response) => {
  try {
    const authToken = req.cookies.auth_token

    if (!authToken) {
      return res.status(200).json({ success: true, isAuthenticated: false })
    }

    const cookieData = verifyCookie(authToken)
    if (!cookieData) {
      res.clearCookie('auth_token')
      return res.status(200).json({ success: true, isAuthenticated: false })
    }

    // cookieData should include userId and role
    const { userId, role } = cookieData as { userId: string; role: string }

    const user = await findUserByIdAndRole(userId, role)
    if (!user || !user.isActive) {
      res.clearCookie('auth_token')
      return res.status(200).json({ success: true, isAuthenticated: false })
    }

    return res.status(200).json({
      success: true,
      isAuthenticated: true,
      user: toUserResponse(user, role),
    })
  } catch (error) {
    console.error('Check auth status error:', error)
    return res.status(500).json({
      success: false,
      message: 'Error checking authentication status.',
    })
  }
}

const forgotAttempts = new Map<string, number[]>()
const RATE_WINDOW_MS = 15 * 60 * 1000
const RATE_MAX = 3

function rateLimited(email: string): boolean {
  const now = Date.now()
  const arr = forgotAttempts.get(email) ?? []
  const recent = arr.filter((t) => now - t < RATE_WINDOW_MS)
  if (recent.length >= RATE_MAX) return true
  recent.push(now)
  forgotAttempts.set(email, recent)
  return false
}

function generateOtp(): string {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, '0')
}

function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex')
}
// ============================================
// FORGOT PASSWORD — send OTP
// ============================================
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body as { email?: string }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      })
    }

    const normalized = email.toLowerCase().trim()

    if (rateLimited(normalized)) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Try again in 15 minutes.',
      })
    }

    const found = await findUserByEmail(normalized)

    if (!found) {
      return res.status(200).json({
        success: true,
        message: 'If that email exists, an OTP has been sent.',
      })
    }

    const { user, role } = found
    // const name =
    //   (user.name ?? (user as unknown as { fullName?: string }).fullName) || ''
    const nameSource = user as unknown as {
      name?: string
      fullName?: string
    }
    const name = nameSource.name ?? nameSource.fullName ?? ''
    const otp = generateOtp()
    const otpHash = await hashPassword(otp)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

    const target = user as unknown as {
      resetOtpHash?: string | null
      resetOtpExpiresAt?: Date | null
      resetOtpAttempts?: number
      resetOtpVerified?: boolean
      resetToken?: string | null
      resetTokenExpiresAt?: Date | null
      save?: () => Promise<unknown>
    }

    target.resetOtpHash = otpHash
    target.resetOtpExpiresAt = expiresAt
    target.resetOtpAttempts = 0
    target.resetOtpVerified = false
    target.resetToken = null
    target.resetTokenExpiresAt = null

    if (typeof target.save === 'function') {
      await target.save()
    }

    try {
      await sendOtpEmail({
        to: normalized,
        name,
        otp,
        expiresInMinutes: 15,
      })
    } catch (mailErr) {
      console.error('Failed to send OTP email:', mailErr)
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP. Please try again.',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'If that email exists, an OTP has been sent.',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return res.status(500).json({
      success: false,
      message: 'Error processing request.',
    })
  }
}

// ============================================
// VERIFY OTP
// ============================================
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body as { email?: string; otp?: string }

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required',
      })
    }

    const normalized = email.toLowerCase().trim()
    const found = await findUserByEmail(normalized)

    if (!found) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP.',
      })
    }

    const { user } = found

    const target = user as unknown as {
      resetOtpHash?: string | null
      resetOtpExpiresAt?: Date | null
      resetOtpAttempts?: number
      resetOtpVerified?: boolean
      resetToken?: string | null
      resetTokenExpiresAt?: Date | null
      save?: () => Promise<unknown>
    }

    if (!target.resetOtpHash || !target.resetOtpExpiresAt) {
      return res.status(400).json({
        success: false,
        message: 'No active OTP. Please request a new one.',
      })
    }

    if (target.resetOtpExpiresAt.getTime() < Date.now()) {
      target.resetOtpHash = null
      target.resetOtpExpiresAt = null
      target.resetOtpAttempts = 0
      target.resetOtpVerified = false
      if (typeof target.save === 'function') await target.save()
      return res.status(400).json({
        success: false,
        message: 'OTP expired. Please request a new one.',
      })
    }

    if ((target.resetOtpAttempts ?? 0) >= 5) {
      target.resetOtpHash = null
      target.resetOtpExpiresAt = null
      target.resetOtpAttempts = 0
      target.resetOtpVerified = false
      if (typeof target.save === 'function') await target.save()
      return res.status(429).json({
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.',
      })
    }

    const valid = await comparePassword(otp, target.resetOtpHash)
    if (!valid) {
      target.resetOtpAttempts = (target.resetOtpAttempts ?? 0) + 1
      if (typeof target.save === 'function') await target.save()
      const remaining = 5 - target.resetOtpAttempts
      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${remaining} attempts remaining.`,
      })
    }

    const resetToken = generateResetToken()
    target.resetOtpVerified = true
    target.resetToken = resetToken
    target.resetTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000)
    if (typeof target.save === 'function') await target.save()

    return res.status(200).json({
      success: true,
      message: 'OTP verified',
      resetToken,
    })
  } catch (error) {
    console.error('Verify OTP error:', error)
    return res.status(500).json({
      success: false,
      message: 'Error verifying OTP.',
    })
  }
}

// ============================================
// RESET PASSWORD
// ============================================
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { resetToken, newPassword } = req.body as {
      resetToken?: string
      newPassword?: string
    }

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Reset token and new password are required',
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      })
    }
    async function findUserByResetToken(
      resetToken: string
    ): Promise<FoundUser | null> {
      const now = new Date()

      const leader = await User.findOne({
        resetToken,
        resetTokenExpiresAt: { $gt: now },
        resetOtpVerified: true,
      })
      if (leader) return { user: leader, role: 'committee_leader' }

      const director = await Director.findOne({
        resetToken,
        resetTokenExpiresAt: { $gt: now },
        resetOtpVerified: true,
      })
      if (director) return { user: director, role: 'director' }

      const member = await CommitteeMember.findOne({
        resetToken,
        resetTokenExpiresAt: { $gt: now },
        resetOtpVerified: true,
      })
      if (member) return { user: member, role: 'committee_member' }

      const teacher = await Teacher.findOne({
        resetToken,
        resetTokenExpiresAt: { $gt: now },
        resetOtpVerified: true,
      })
      if (teacher) return { user: teacher, role: 'teacher' }

      return null
    }

    const found = await findUserByResetToken(resetToken)
    if (!found) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token. Please start over.',
      })
    }

    const { user } = found
    const target = user as unknown as {
      password: string
      resetToken?: string | null
      resetTokenExpiresAt?: Date | null
      resetOtpHash?: string | null
      resetOtpExpiresAt?: Date | null
      resetOtpAttempts?: number
      resetOtpVerified?: boolean
      save?: () => Promise<unknown>
    }

    const hashed = await hashPassword(newPassword)
    target.password = hashed

    // Clear all reset fields
    target.resetToken = null
    target.resetTokenExpiresAt = null
    target.resetOtpHash = null
    target.resetOtpExpiresAt = null
    target.resetOtpAttempts = 0
    target.resetOtpVerified = false

    if (typeof target.save === 'function') {
      await target.save()
    }

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully. Please log in.',
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return res.status(500).json({
      success: false,
      message: 'Error resetting password.',
    })
  }
}
