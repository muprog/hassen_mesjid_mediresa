import { Request, Response } from 'express'
import { Director } from '../models/Director'
import { hashPassword } from '../utils/bcrypt'

// ============================================
// CREATE DIRECTOR (Only Committee Leader)
// ============================================
export const createDirector = async (req: Request, res: Response) => {
  try {
    const { fullName, phone, email, password } = req.body

    // Validate required fields
    if (!fullName || !phone || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: fullName, phone, email, password',
      })
    }

    // Check if email already exists
    const existingDirector = await Director.findOne({
      email: email.toLowerCase(),
    })
    if (existingDirector) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create director
    const director = new Director({
      fullName,
      phone,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'director',
      status: 'active',
      createdBy: req.user?._id,
    })

    await director.save()

    // Convert to object and remove password
    const directorResponse = director.toObject()
    const { password: _, ...directorWithoutPassword } = directorResponse

    res.status(201).json({
      success: true,
      message: 'Director registered successfully',
      data: directorWithoutPassword,
    })
  } catch (error: any) {
    console.error('Create director error:', error)
    res.status(500).json({
      success: false,
      message: 'Error creating director',
      error: error.message,
    })
  }
}

// ============================================
// GET ALL DIRECTORS
// ============================================
export const getDirectors = async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query

    const filter: any = { isActive: true }

    if (status) filter.status = status

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ]
    }

    const directors = await Director.find(filter)
      .populate('createdBy', 'fullName email')
      .sort({ fullName: 1 })

    // Remove passwords from response using destructuring
    const directorsResponse = directors.map((director) => {
      const obj = director.toObject()
      const { password, ...directorWithoutPassword } = obj
      return directorWithoutPassword
    })

    res.status(200).json({
      success: true,
      count: directors.length,
      data: directorsResponse,
    })
  } catch (error: any) {
    console.error('Get directors error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching directors',
      error: error.message,
    })
  }
}

// ============================================
// GET DIRECTOR BY ID
// ============================================
export const getDirectorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const director = await Director.findById(id).populate(
      'createdBy',
      'fullName email'
    )

    if (!director) {
      return res.status(404).json({
        success: false,
        message: 'Director not found',
      })
    }

    const directorResponse = director.toObject()
    const { password, ...directorWithoutPassword } = directorResponse

    res.status(200).json({
      success: true,
      data: directorWithoutPassword,
    })
  } catch (error: any) {
    console.error('Get director error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching director',
      error: error.message,
    })
  }
}

// ============================================
// UPDATE DIRECTOR
// ============================================
export const updateDirector = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { fullName, phone, email, status } = req.body

    const director = await Director.findById(id)
    if (!director) {
      return res.status(404).json({
        success: false,
        message: 'Director not found',
      })
    }

    // If email is being updated, check uniqueness
    if (email && email !== director.email) {
      const existingDirector = await Director.findOne({
        email: email.toLowerCase(),
      })
      if (existingDirector) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered',
        })
      }
    }

    // Update fields
    if (fullName) director.fullName = fullName
    if (phone) director.phone = phone
    if (email) director.email = email.toLowerCase()
    if (status) director.status = status

    await director.save()

    const directorResponse = director.toObject()
    const { password, ...directorWithoutPassword } = directorResponse

    res.status(200).json({
      success: true,
      message: 'Director updated successfully',
      data: directorWithoutPassword,
    })
  } catch (error: any) {
    console.error('Update director error:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating director',
      error: error.message,
    })
  }
}

// ============================================
// TOGGLE DIRECTOR STATUS (Activate/Deactivate)
// ============================================
export const toggleDirectorStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const director = await Director.findById(id)
    if (!director) {
      return res.status(404).json({
        success: false,
        message: 'Director not found',
      })
    }

    // Toggle status
    director.status = director.status === 'active' ? 'inactive' : 'active'
    await director.save()

    const directorResponse = director.toObject()
    const { password, ...directorWithoutPassword } = directorResponse

    res.status(200).json({
      success: true,
      message: `Director ${
        director.status === 'active' ? 'activated' : 'deactivated'
      } successfully`,
      data: directorWithoutPassword,
    })
  } catch (error: any) {
    console.error('Toggle director status error:', error)
    res.status(500).json({
      success: false,
      message: 'Error toggling director status',
      error: error.message,
    })
  }
}

// ============================================
// DELETE DIRECTOR (Soft Delete)
// ============================================
export const deleteDirector = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const director = await Director.findById(id)
    if (!director) {
      return res.status(404).json({
        success: false,
        message: 'Director not found',
      })
    }

    // Soft delete
    director.isActive = false
    director.status = 'inactive'
    await director.save()

    res.status(200).json({
      success: true,
      message: 'Director deleted successfully',
    })
  } catch (error: any) {
    console.error('Delete director error:', error)
    res.status(500).json({
      success: false,
      message: 'Error deleting director',
      error: error.message,
    })
  }
}
