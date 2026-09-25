import { Request, Response } from 'express'
import { CommitteeMember } from '../models/CommitteeMember'
import { hashPassword, comparePassword } from '../utils/bcrypt'

export const createCommitteeMember = async (req: Request, res: Response) => {
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
    const existingMember = await CommitteeMember.findOne({
      email: email.toLowerCase(),
    })
    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create committee member
    const member = new CommitteeMember({
      fullName,
      phone,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'committee_member',
      status: 'active',
      createdBy: req.user?._id,
    })

    await member.save()

    // Convert to plain object and remove password
    const memberResponse = member.toObject()
    delete (memberResponse as any).password // Type assertion to bypass TypeScript check

    res.status(201).json({
      success: true,
      message: 'Committee member registered successfully',
      data: memberResponse,
    })
  } catch (error: any) {
    console.error('Create committee member error:', error)
    res.status(500).json({
      success: false,
      message: 'Error creating committee member',
      error: error.message,
    })
  }
}

// ============================================
// GET ALL COMMITTEE MEMBERS
// ============================================
export const getCommitteeMembers = async (req: Request, res: Response) => {
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

    const members = await CommitteeMember.find(filter)
      .populate('createdBy', 'fullName email')
      .sort({ fullName: 1 })

    // Remove passwords from response
    const membersResponse = members.map((member) => {
      const obj = member.toObject()
      delete (obj as any).password
      return obj
    })

    res.status(200).json({
      success: true,
      count: members.length,
      data: membersResponse,
    })
  } catch (error: any) {
    console.error('Get committee members error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching committee members',
      error: error.message,
    })
  }
}

// ============================================
// GET COMMITTEE MEMBER BY ID
// ============================================
export const getCommitteeMemberById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const member = await CommitteeMember.findById(id).populate(
      'createdBy',
      'fullName email'
    )

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Committee member not found',
      })
    }

    const memberResponse = member.toObject()
    delete (memberResponse as any).password

    res.status(200).json({
      success: true,
      data: memberResponse,
    })
  } catch (error: any) {
    console.error('Get committee member error:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching committee member',
      error: error.message,
    })
  }
}

// ============================================
// UPDATE COMMITTEE MEMBER
// ============================================
export const updateCommitteeMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { fullName, phone, email, status } = req.body

    const member = await CommitteeMember.findById(id)
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Committee member not found',
      })
    }

    // If email is being updated, check uniqueness
    if (email && email !== member.email) {
      const existingMember = await CommitteeMember.findOne({
        email: email.toLowerCase(),
      })
      if (existingMember) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered',
        })
      }
    }

    // Update fields
    if (fullName) member.fullName = fullName
    if (phone) member.phone = phone
    if (email) member.email = email.toLowerCase()
    if (status) member.status = status

    await member.save()

    const memberResponse = member.toObject()
    delete (memberResponse as any).password

    res.status(200).json({
      success: true,
      message: 'Committee member updated successfully',
      data: memberResponse,
    })
  } catch (error: any) {
    console.error('Update committee member error:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating committee member',
      error: error.message,
    })
  }
}

// ============================================
// TOGGLE MEMBER STATUS
// ============================================
export const toggleMemberStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const member = await CommitteeMember.findById(id)
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Committee member not found',
      })
    }

    // Toggle status
    member.status = member.status === 'active' ? 'inactive' : 'active'
    await member.save()

    const memberResponse = member.toObject()
    delete (memberResponse as any).password

    res.status(200).json({
      success: true,
      message: `Member ${
        member.status === 'active' ? 'activated' : 'deactivated'
      } successfully`,
      data: memberResponse,
    })
  } catch (error: any) {
    console.error('Toggle member status error:', error)
    res.status(500).json({
      success: false,
      message: 'Error toggling member status',
      error: error.message,
    })
  }
}

// ============================================
// DELETE COMMITTEE MEMBER
// ============================================
export const deleteCommitteeMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const member = await CommitteeMember.findById(id)
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Committee member not found',
      })
    }

    // Soft delete
    member.isActive = false
    member.status = 'inactive'
    await member.save()

    res.status(200).json({
      success: true,
      message: 'Committee member deleted successfully',
    })
  } catch (error: any) {
    console.error('Delete committee member error:', error)
    res.status(500).json({
      success: false,
      message: 'Error deleting committee member',
      error: error.message,
    })
  }
}
