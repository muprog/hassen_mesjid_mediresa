import { Request, Response } from 'express'
import { Teacher } from '../models/Teacher'

// ============================================
// CREATE TEACHER
// ============================================
export const createTeacher = async (req: Request, res: Response) => {
  try {
    const { fullName, age, phone, experience, kitabLearned, status } = req.body

    // Validate required fields
    if (!fullName || !age || !phone || experience === undefined) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided',
      })
    }

    // Create teacher
    const teacher = new Teacher({
      fullName,
      age,
      phone,
      experience,
      kitabLearned: kitabLearned || [],
      status: status || 'active',
      createdBy: req.user?._id,
    })

    await teacher.save()

    res.status(201).json({
      success: true,
      message: 'Teacher registered successfully',
      data: teacher,
    })
  } catch (error: any) {
    console.error('Create teacher error:', error)
    res.status(500).json({
      success: false,
      message: 'Error creating teacher',
      error: error.message,
    })
  }
}

// ============================================
// GET ALL TEACHERS
// ============================================
export const getTeachers = async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query

    const filter: any = { isActive: true }

    if (status) filter.status = status

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { kitabLearned: { $regex: search, $options: 'i' } },
      ]
    }

    const teachers = await Teacher.find(filter)
      .populate('createdBy', 'name email')
      .sort({ fullName: 1 })

    res.status(200).json({
      success: true,
      count: teachers.length,
      data: teachers,
    })
  } catch (error: any) {
    console.error('Get teachers error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching teachers',
      error: error.message,
    })
  }
}

// ============================================
// GET TEACHER BY ID
// ============================================
export const getTeacherById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const teacher = await Teacher.findById(id).populate(
      'createdBy',
      'name email'
    )

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found',
      })
    }

    res.status(200).json({
      success: true,
      data: teacher,
    })
  } catch (error: any) {
    console.error('Get teacher error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching teacher',
      error: error.message,
    })
  }
}

// ============================================
// UPDATE TEACHER
// ============================================
export const updateTeacher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const teacher = await Teacher.findById(id)
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found',
      })
    }

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    )

    res.status(200).json({
      success: true,
      message: 'Teacher updated successfully',
      data: updatedTeacher,
    })
  } catch (error: any) {
    console.error('Update teacher error:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating teacher',
      error: error.message,
    })
  }
}

// ============================================
// DELETE TEACHER (Soft Delete)
// ============================================
export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const teacher = await Teacher.findById(id)
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found',
      })
    }

    // Soft delete
    teacher.isActive = false
    teacher.status = 'inactive'
    await teacher.save()

    res.status(200).json({
      success: true,
      message: 'Teacher deleted successfully',
    })
  } catch (error: any) {
    console.error('Delete teacher error:', error)
    res.status(500).json({
      success: false,
      message: 'Error deleting teacher',
      error: error.message,
    })
  }
}
