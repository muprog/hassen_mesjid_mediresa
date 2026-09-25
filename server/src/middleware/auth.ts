// import { Request, Response, NextFunction } from 'express'
// import { User, IUser } from '../models/User'
// import { verifyCookie } from '../utils/cookie'

// declare global {
//   namespace Express {
//     interface Request {
//       user?: IUser
//     }
//   }
// }

// export const isAuthenticated = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const authToken = req.cookies.auth_token

//     if (!authToken) {
//       return res.status(401).json({
//         success: false,
//         message: 'Authentication required. Please login.',
//       })
//     }

//     const cookieData = verifyCookie(authToken)
//     if (!cookieData) {
//       res.clearCookie('auth_token')
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid authentication. Please login again.',
//       })
//     }

//     const user = await User.findById(cookieData.userId).select('-password')
//     if (!user) {
//       res.clearCookie('auth_token')
//       return res.status(401).json({
//         success: false,
//         message: 'User not found. Please login again.',
//       })
//     }

//     if (!user.isActive) {
//       return res.status(403).json({
//         success: false,
//         message: 'Account is disabled. Please contact administrator.',
//       })
//     }

//     req.user = user
//     next()
//   } catch (error) {
//     console.error('Authentication error:', error)
//     return res.status(500).json({
//       success: false,
//       message: 'Authentication error occurred.',
//     })
//   }
// }

// export const authorize = (...roles: string[]) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     if (!req.user) {
//       return res.status(401).json({
//         success: false,
//         message: 'Authentication required.',
//       })
//     }

//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({
//         success: false,
//         message: `Access denied. Required roles: ${roles.join(', ')}`,
//       })
//     }

//     next()
//   }
// }

// export const checkRegistrationStatus = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
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

//     next()
//   } catch (error) {
//     console.error('Error checking registration status:', error)
//     return res.status(500).json({
//       success: false,
//       message: 'Error checking registration status.',
//     })
//   }
// }

import { Request, Response, NextFunction } from 'express'
import { User, IUser } from '../models/User'
import { Director, IDirector } from '../models/Director'
import { CommitteeMember, ICommitteeMember } from '../models/CommitteeMember'
import { Teacher, ITeacher } from '../models/Teacher'
import { verifyCookie } from '../utils/cookie'

export type AuthUser = IUser | IDirector | ICommitteeMember | ITeacher

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser
    }
  }
}

async function findUserByIdAndRole(
  id: string,
  role: string
): Promise<AuthUser | null> {
  switch (role) {
    case 'committee_leader':
      return User.findById(id).select('-password')
    case 'director':
      return Director.findById(id).select('-password')
    case 'committee_member':
      return CommitteeMember.findById(id).select('-password')
    case 'teacher':
      return Teacher.findById(id).select('-password')
    default:
      return null
  }
}

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authToken = req.cookies.auth_token

    if (!authToken) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please login.',
      })
    }

    const cookieData = verifyCookie(authToken)
    if (!cookieData) {
      res.clearCookie('auth_token')
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication. Please login again.',
      })
    }

    const { userId, role } = cookieData as { userId: string; role: string }

    const user = await findUserByIdAndRole(userId, role)
    if (!user) {
      res.clearCookie('auth_token')
      return res.status(401).json({
        success: false,
        message: 'User not found. Please login again.',
      })
    }

    if (!user.isActive || (user as { status?: string }).status === 'inactive') {
      return res.status(403).json({
        success: false,
        message: 'Account is disabled. Please contact administrator.',
      })
    }

    req.user = user
    next()
  } catch (error) {
    console.error('Authentication error:', error)
    return res.status(500).json({
      success: false,
      message: 'Authentication error occurred.',
    })
  }
}

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${roles.join(', ')}`,
      })
    }

    next()
  }
}

export const checkRegistrationStatus = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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

    next()
  } catch (error) {
    console.error('Error checking registration status:', error)
    return res.status(500).json({
      success: false,
      message: 'Error checking registration status.',
    })
  }
}
