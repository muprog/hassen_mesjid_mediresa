// import { Request, Response } from 'express'
// import { Student } from '../models/Student'

// // ============================================
// // CREATE STUDENT
// // ============================================
// export const createStudent = async (req: Request, res: Response) => {
//   try {
//     const { fullName, age, gender, haleqa, section, status } = req.body

//     // Validate required fields
//     if (!fullName || !age || !gender || !haleqa || !section) {
//       return res.status(400).json({
//         success: false,
//         message: 'All required fields must be provided',
//       })
//     }

//     // Create student
//     const student = new Student({
//       fullName,
//       age,
//       gender,
//       haleqa,
//       section,
//       status: status || 'active',
//       createdBy: req.user?._id,
//     })

//     await student.save()

//     res.status(201).json({
//       success: true,
//       message: 'Student registered successfully',
//       data: student,
//     })
//   } catch (error: any) {
//     console.error('Create student error:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Error creating student',
//       error: error.message,
//     })
//   }
// }

// // ============================================
// // GET ALL STUDENTS
// // ============================================
// export const getStudents = async (req: Request, res: Response) => {
//   try {
//     const { haleqa, section, status, search } = req.query

//     const filter: any = { isActive: true }

//     if (haleqa) filter.haleqa = haleqa
//     if (section) filter.section = section
//     if (status) filter.status = status

//     if (search) {
//       filter.$or = [
//         { fullName: { $regex: search, $options: 'i' } },
//         { haleqa: { $regex: search, $options: 'i' } },
//       ]
//     }

//     const students = await Student.find(filter)
//       .populate('createdBy', 'name email')
//       .sort({ haleqa: 1, section: 1, fullName: 1 })

//     res.status(200).json({
//       success: true,
//       count: students.length,
//       data: students,
//     })
//   } catch (error: any) {
//     console.error('Get students error:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching students',
//       error: error.message,
//     })
//   }
// }

// // ============================================
// // GET STUDENT BY ID
// // ============================================
// export const getStudentById = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params

//     const student = await Student.findById(id).populate(
//       'createdBy',
//       'name email'
//     )

//     if (!student) {
//       return res.status(404).json({
//         success: false,
//         message: 'Student not found',
//       })
//     }

//     res.status(200).json({
//       success: true,
//       data: student,
//     })
//   } catch (error: any) {
//     console.error('Get student error:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching student',
//       error: error.message,
//     })
//   }
// }

// // ============================================
// // UPDATE STUDENT
// // ============================================
// export const updateStudent = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params
//     const updateData = req.body

//     const student = await Student.findById(id)
//     if (!student) {
//       return res.status(404).json({
//         success: false,
//         message: 'Student not found',
//       })
//     }

//     const updatedStudent = await Student.findByIdAndUpdate(
//       id,
//       { ...updateData, updatedAt: new Date() },
//       { new: true, runValidators: true }
//     )

//     res.status(200).json({
//       success: true,
//       message: 'Student updated successfully',
//       data: updatedStudent,
//     })
//   } catch (error: any) {
//     console.error('Update student error:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Error updating student',
//       error: error.message,
//     })
//   }
// }

// // ============================================
// // DELETE STUDENT (Soft Delete)
// // ============================================
// export const deleteStudent = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params

//     const student = await Student.findById(id)
//     if (!student) {
//       return res.status(404).json({
//         success: false,
//         message: 'Student not found',
//       })
//     }

//     // Soft delete
//     student.isActive = false
//     student.status = 'inactive'
//     await student.save()

//     res.status(200).json({
//       success: true,
//       message: 'Student deleted successfully',
//     })
//   } catch (error: any) {
//     console.error('Delete student error:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Error deleting student',
//       error: error.message,
//     })
//   }
// }

// // ============================================
// // GET STUDENTS BY HALEGA
// // ============================================
// export const getStudentsByHaleqa = async (req: Request, res: Response) => {
//   try {
//     const { haleqa } = req.params

//     const students = await Student.find({
//       haleqa,
//       isActive: true,
//       status: 'active',
//     }).sort({ section: 1, fullName: 1 })

//     res.status(200).json({
//       success: true,
//       count: students.length,
//       data: students,
//     })
//   } catch (error: any) {
//     console.error('Get students by haleqa error:', error)
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching students',
//       error: error.message,
//     })
//   }
// }

import { Request, Response } from 'express'
import { QueryFilter, Types } from 'mongoose'
import { Student, IStudent } from '../models/Student'

type StudentStatus = 'active' | 'inactive' | 'graduated' | 'transferred'

interface CreateStudentBody {
  code: string
  fullName: string
  age: number | string
  gender: 'male' | 'female'
  haleqa: string
  section: 'A' | 'B' | 'C' | 'D'
  status?: StudentStatus
  fatherPhone?: string
  motherPhone?: string
  quranLevel?: string
  hasPayment?: boolean
  paymentType?: string
}

type UpdateStudentBody = Partial<CreateStudentBody>

const getErrorMessage = (err: unknown): string =>
  err instanceof Error ? err.message : 'Unknown error'

// ============================================
// CREATE STUDENT
// ============================================
// export const createStudent = async (
//   req: Request<{}, {}, CreateStudentBody>,
//   res: Response
// ): Promise<Response> => {
//   try {
//     const {
//       fullName,
//       age,
//       gender,
//       haleqa,
//       section,
//       status,
//       fatherPhone,
//       motherPhone,
//       quranLevel,
//       hasPayment,
//       paymentType,
//     } = req.body

//     if (!fullName || !age || !gender || !haleqa || !section) {
//       return res.status(400).json({
//         success: false,
//         message: 'fullName, age, gender, haleqa, section are required',
//       })
//     }

//     const payEnabled = hasPayment !== false

//     const student = new Student({
//       fullName,
//       age: Number(age),
//       gender,
//       haleqa,
//       section,
//       status: status ?? 'active',
//       fatherPhone: fatherPhone ?? '',
//       motherPhone: motherPhone ?? '',
//       quranLevel: quranLevel ?? '',
//       hasPayment: payEnabled,
//       paymentType:
//         payEnabled && paymentType ? new Types.ObjectId(paymentType) : null,
//       createdBy: req.user?._id,
//     })

//     await student.save()

//     return res.status(201).json({
//       success: true,
//       message: 'Student registered successfully',
//       data: student,
//     })
//   } catch (err) {
//     console.error('Create student error:', getErrorMessage(err))
//     return res.status(500).json({
//       success: false,
//       message: 'Error creating student',
//     })
//   }
// }

export const createStudent = async (
  req: Request<{}, {}, CreateStudentBody>,
  res: Response
): Promise<Response> => {
  try {
    const {
      code, // <- NEW
      fullName,
      age,
      gender,
      haleqa,
      section,
      status,
      fatherPhone,
      motherPhone,
      quranLevel,
      hasPayment,
      paymentType,
    } = req.body

    if (!code || !fullName || !age || !gender || !haleqa || !section) {
      return res.status(400).json({
        success: false,
        message: 'code, fullName, age, gender, haleqa, section are required',
      })
    }

    const normalizedCode = code.trim().toUpperCase()

    // Check for uniqueness
    const existing = await Student.findOne({ code: normalizedCode })
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A student with this code already exists',
      })
    }

    const student = new Student({
      code: normalizedCode,
      fullName,
      age: Number(age),
      gender,
      haleqa,
      section,
      status: status ?? 'active',
      fatherPhone: fatherPhone ?? '',
      motherPhone: motherPhone ?? '',
      quranLevel: quranLevel ?? '',
      hasPayment: hasPayment !== false,
      paymentType:
        hasPayment !== false && paymentType
          ? new Types.ObjectId(paymentType)
          : null,
      createdBy: req.user?._id,
    })

    await student.save()

    return res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: student,
    })
  } catch (err) {
    console.error('Create student error:', getErrorMessage(err))
    return res.status(500).json({
      success: false,
      message: 'Error creating student',
    })
  }
}

// ============================================
// GET ALL STUDENTS
// ============================================
export const getStudents = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { haleqa, section, status, search, hasPayment } = req.query

    const filter: QueryFilter<IStudent> = { isActive: true }

    if (typeof haleqa === 'string' && haleqa) filter.haleqa = haleqa

    if (typeof section === 'string' && ['A', 'B', 'C', 'D'].includes(section)) {
      filter.section = section as 'A' | 'B' | 'C' | 'D'
    }

    if (typeof status === 'string' && status)
      filter.status = status as StudentStatus

    if (hasPayment === 'true') filter.hasPayment = true
    if (hasPayment === 'false') filter.hasPayment = false

    if (typeof search === 'string' && search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { haleqa: { $regex: search, $options: 'i' } },
        { fatherPhone: { $regex: search, $options: 'i' } },
        { motherPhone: { $regex: search, $options: 'i' } },
      ]
    }

    const students = await Student.find(filter)
      .populate('paymentType', 'name defaultAmount period')
      .populate('createdBy', 'name email')
      .sort({ haleqa: 1, section: 1, fullName: 1 })

    return res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    })
  } catch (err) {
    console.error('Get students error:', getErrorMessage(err))
    return res.status(500).json({
      success: false,
      message: 'Error fetching students',
    })
  }
}

// ============================================
// GET STUDENT BY ID
// ============================================
export const getStudentById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<Response> => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('paymentType', 'name defaultAmount period')
      .populate('createdBy', 'name email')

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      })
    }

    return res.status(200).json({ success: true, data: student })
  } catch (err) {
    console.error('Get student error:', getErrorMessage(err))
    return res.status(500).json({
      success: false,
      message: 'Error fetching student',
    })
  }
}

// ============================================
// UPDATE STUDENT
// ============================================
// export const updateStudent = async (
//   req: Request<{ id: string }, {}, UpdateStudentBody>,
//   res: Response
// ): Promise<Response> => {
//   try {
//     const student = await Student.findById(req.params.id)
//     if (!student) {
//       return res.status(404).json({
//         success: false,
//         message: 'Student not found',
//       })
//     }

//     const {
//       fullName,
//       age,
//       gender,
//       haleqa,
//       section,
//       status,
//       fatherPhone,
//       motherPhone,
//       quranLevel,
//       hasPayment,
//       paymentType,
//     } = req.body

//     if (fullName !== undefined) student.fullName = fullName
//     if (age !== undefined) student.age = Number(age)
//     if (gender !== undefined) student.gender = gender
//     if (haleqa !== undefined) student.haleqa = haleqa
//     if (section !== undefined) student.section = section
//     if (status !== undefined) student.status = status
//     if (fatherPhone !== undefined) student.fatherPhone = fatherPhone
//     if (motherPhone !== undefined) student.motherPhone = motherPhone
//     if (quranLevel !== undefined) student.quranLevel = quranLevel

//     if (hasPayment !== undefined) {
//       student.hasPayment = hasPayment
//       if (!hasPayment) {
//         student.paymentType = undefined
//         student.defaultAmount = undefined
//       }
//     }

//     if (paymentType !== undefined && student.hasPayment) {
//       student.paymentType = paymentType
//         ? new Types.ObjectId(paymentType)
//         : undefined
//     }

//     await student.save()

//     const populated = await Student.findById(student._id)
//       .populate('paymentType', 'name defaultAmount period')
//       .populate('createdBy', 'name email')

//     return res.status(200).json({
//       success: true,
//       message: 'Student updated successfully',
//       data: populated,
//     })
//   } catch (err) {
//     console.error('Update student error:', getErrorMessage(err))
//     return res.status(500).json({
//       success: false,
//       message: 'Error updating student',
//     })
//   }
// }

export const updateStudent = async (
  req: Request<{ id: string }, {}, UpdateStudentBody>,
  res: Response
): Promise<Response> => {
  try {
    const student = await Student.findById(req.params.id)
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      })
    }

    const {
      code, // <- NEW
      fullName,
      age,
      gender,
      haleqa,
      section,
      status,
      fatherPhone,
      motherPhone,
      quranLevel,
      hasPayment,
      paymentType,
    } = req.body

    // Handle code change with uniqueness check
    if (code !== undefined) {
      const normalizedCode = code.trim().toUpperCase()
      if (normalizedCode !== student.code) {
        const existing = await Student.findOne({ code: normalizedCode })
        if (existing) {
          return res.status(400).json({
            success: false,
            message: 'A student with this code already exists',
          })
        }
        student.code = normalizedCode
      }
    }

    if (fullName !== undefined) student.fullName = fullName
    if (age !== undefined) student.age = Number(age)
    if (gender !== undefined) student.gender = gender
    if (haleqa !== undefined) student.haleqa = haleqa
    if (section !== undefined) student.section = section
    if (status !== undefined) student.status = status
    if (fatherPhone !== undefined) student.fatherPhone = fatherPhone
    if (motherPhone !== undefined) student.motherPhone = motherPhone
    if (quranLevel !== undefined) student.quranLevel = quranLevel

    if (hasPayment !== undefined) {
      student.hasPayment = hasPayment
      if (!hasPayment) {
        student.paymentType = undefined
        student.defaultAmount = undefined
      }
    }

    if (paymentType !== undefined && student.hasPayment) {
      student.paymentType = paymentType
        ? new Types.ObjectId(paymentType)
        : undefined
    }

    await student.save()

    const populated = await Student.findById(student._id)
      .populate('paymentType', 'name defaultAmount period')
      .populate('createdBy', 'name email')

    return res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: populated,
    })
  } catch (err) {
    console.error('Update student error:', getErrorMessage(err))
    return res.status(500).json({
      success: false,
      message: 'Error updating student',
    })
  }
}

// ============================================
// DELETE STUDENT (Soft Delete)
// ============================================
export const deleteStudent = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<Response> => {
  try {
    const student = await Student.findById(req.params.id)
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      })
    }

    student.isActive = false
    student.status = 'inactive'
    await student.save()

    return res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
    })
  } catch (err) {
    console.error('Delete student error:', getErrorMessage(err))
    return res.status(500).json({
      success: false,
      message: 'Error deleting student',
    })
  }
}

// ============================================
// GET STUDENTS BY HALEGA
// ============================================
export const getStudentsByHaleqa = async (
  req: Request<{ haleqa: string }>,
  res: Response
): Promise<Response> => {
  try {
    const students = await Student.find({
      haleqa: req.params.haleqa,
      isActive: true,
      status: 'active',
    }).sort({ section: 1, fullName: 1 })

    return res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    })
  } catch (err) {
    console.error('Get students by haleqa error:', getErrorMessage(err))
    return res.status(500).json({
      success: false,
      message: 'Error fetching students',
    })
  }
}
