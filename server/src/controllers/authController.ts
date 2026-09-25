// import { Request, Response } from 'express'
// import { User } from '../models/User'
// import { hashPassword, comparePassword } from '../utils/bcrypt'
// import { setAuthCookie, clearAuthCookie, verifyCookie } from '../utils/cookie'

// export const registerCommitteeLeader = async (req: Request, res: Response) => {
//   try {
//     const { email, password, name, phone, gender, age } = req.body

//     if (!email || !password || !name || !phone || !gender || !age) {
//       return res.status(400).json({
//         success: false,
//         message:
//           'All fields are required: email, password, name, phone, gender, age',
//       })
//     }

//     const committeeLeaderExists = await User.findOne({
//       role: 'committee_leader',
//     })
//     if (committeeLeaderExists) {
//       return res.status(403).json({
//         success: false,
//         message: 'Registration is disabled. Committee Leader already exists.',
//         isRegistrationDisabled: true,
//       })
//     }

//     const emailExists = await User.findOne({ email: email.toLowerCase() })
//     if (emailExists) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email already registered. Please use a different email.',
//       })
//     }

//     const hashedPassword = await hashPassword(password)

//     const user = new User({
//       email: email.toLowerCase(),
//       password: hashedPassword,
//       role: 'committee_leader',
//       name,
//       phone,
//       gender,
//       age: parseInt(age),
//       isActive: true,
//       createdBy: null,
//     })

//     await user.save()

//     setAuthCookie(res, user)

//     user.lastLogin = new Date()
//     await user.save()

//     const userResponse = {
//       _id: user._id,
//       email: user.email,
//       name: user.name,
//       role: user.role,
//       phone: user.phone,
//       gender: user.gender,
//       age: user.age,
//       isActive: user.isActive,
//       createdAt: user.createdAt,
//       updatedAt: user.updatedAt,
//     }

//     res.status(201).json({
//       success: true,
//       message: 'Committee Leader registered successfully!',
//       user: userResponse,
//     })
//   } catch (error) {
//     console.error('Registration error:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Error registering Committee Leader. Please try again.',
//     })
//   }
// }

// export const login = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body

//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email and password are required.',
//       })
//     }

//     const user = await User.findOne({ email: email.toLowerCase() })
//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid email or password.',
//       })
//     }

//     if (!user.isActive) {
//       return res.status(403).json({
//         success: false,
//         message: 'Account is disabled. Please contact administrator.',
//       })
//     }

//     const isPasswordValid = await comparePassword(password, user.password)
//     if (!isPasswordValid) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid email or password.',
//       })
//     }

//     setAuthCookie(res, user)

//     user.lastLogin = new Date()
//     await user.save()

//     const userResponse = {
//       _id: user._id,
//       email: user.email,
//       name: user.name,
//       role: user.role,
//       phone: user.phone,
//       gender: user.gender,
//       age: user.age,
//       isActive: user.isActive,
//       createdAt: user.createdAt,
//       updatedAt: user.updatedAt,
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Login successful!',
//       user: userResponse,
//     })
//   } catch (error) {
//     console.error('Login error:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Error logging in. Please try again.',
//     })
//   }
// }

// export const logout = async (req: Request, res: Response) => {
//   try {
//     clearAuthCookie(res)

//     res.status(200).json({
//       success: true,
//       message: 'Logged out successfully!',
//     })
//   } catch (error) {
//     console.error('Logout error:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Error logging out.',
//     })
//   }
// }

// export const getCurrentUser = async (req: Request, res: Response) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({
//         success: false,
//         message: 'Authentication required.',
//       })
//     }

//     const userResponse = {
//       _id: req.user._id,
//       email: req.user.email,
//       name: req.user.name,
//       role: req.user.role,
//       phone: req.user.phone,
//       gender: req.user.gender,
//       age: req.user.age,
//       isActive: req.user.isActive,
//       createdAt: req.user.createdAt,
//       updatedAt: req.user.updatedAt,
//     }

//     res.status(200).json({
//       success: true,
//       user: userResponse,
//     })
//   } catch (error) {
//     console.error('Get current user error:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching user data.',
//     })
//   }
// }

// export const checkRegistrationStatus = async (req: Request, res: Response) => {
//   try {
//     const committeeLeaderExists = await User.findOne({
//       role: 'committee_leader',
//     })

//     res.status(200).json({
//       success: true,
//       isRegistrationDisabled: !!committeeLeaderExists,
//       hasCommitteeLeader: !!committeeLeaderExists,
//     })
//   } catch (error) {
//     console.error('Check registration status error:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Error checking registration status.',
//     })
//   }
// }

// export const checkAuthStatus = async (req: Request, res: Response) => {
//   try {
//     const authToken = req.cookies.auth_token

//     if (!authToken) {
//       return res.status(200).json({
//         success: true,
//         isAuthenticated: false,
//       })
//     }

//     const cookieData = verifyCookie(authToken)
//     if (!cookieData) {
//       res.clearCookie('auth_token')
//       return res.status(200).json({
//         success: true,
//         isAuthenticated: false,
//       })
//     }

//     const user = await User.findById(cookieData.userId).select('-password')
//     if (!user || !user.isActive) {
//       res.clearCookie('auth_token')
//       return res.status(200).json({
//         success: true,
//         isAuthenticated: false,
//       })
//     }

//     const userResponse = {
//       _id: user._id,
//       email: user.email,
//       name: user.name,
//       role: user.role,
//       phone: user.phone,
//       gender: user.gender,
//       age: user.age,
//       isActive: user.isActive,
//       createdAt: user.createdAt,
//       updatedAt: user.updatedAt,
//     }

//     res.status(200).json({
//       success: true,
//       isAuthenticated: true,
//       user: userResponse,
//     })
//   } catch (error) {
//     console.error('Check auth status error:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Error checking authentication status.',
//     })
//   }
// }

import { Request, Response } from 'express'
import { User, IUser } from '../models/User'
import { Director, IDirector } from '../models/Director'
import { CommitteeMember, ICommitteeMember } from '../models/CommitteeMember'
import { Teacher, ITeacher } from '../models/Teacher'
import { hashPassword, comparePassword } from '../utils/bcrypt'
import { setAuthCookie, clearAuthCookie, verifyCookie } from '../utils/cookie'

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
