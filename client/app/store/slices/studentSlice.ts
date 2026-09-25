// import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// interface Student {
//   _id: string
//   fullName: string
//   age: number
//   gender: 'male' | 'female'
//   haleqa: string
//   section: 'A' | 'B' | 'C' | 'D'
//   status: 'active' | 'inactive' | 'graduated' | 'transferred'
//   createdBy: {
//     _id: string
//     name: string
//     email: string
//   }
//   isActive: boolean
//   createdAt: string
//   updatedAt: string
// }

// interface StudentState {
//   students: Student[]
//   selectedStudent: Student | null
//   isLoading: boolean
//   error: string | null
//   filters: {
//     haleqa?: string
//     section?: string
//     status?: string
//     search?: string
//   }
//   pagination: {
//     total: number
//     page: number
//     limit: number
//   }
// }

// const initialState: StudentState = {
//   students: [],
//   selectedStudent: null,
//   isLoading: false,
//   error: null,
//   filters: {},
//   pagination: {
//     total: 0,
//     page: 1,
//     limit: 10,
//   },
// }

// const studentSlice = createSlice({
//   name: 'students',
//   initialState,
//   reducers: {
//     // Get all students
//     getStudentsStart: (
//       state,
//       action: PayloadAction<{ filters?: any; page?: number }>
//     ) => {
//       state.isLoading = true
//       state.error = null
//       if (action.payload?.filters) {
//         state.filters = action.payload.filters
//       }
//     },
//     getStudentsSuccess: (
//       state,
//       action: PayloadAction<{ students: Student[]; total: number }>
//     ) => {
//       state.isLoading = false
//       state.students = action.payload.students
//       state.pagination.total = action.payload.total
//       state.error = null
//     },
//     getStudentsFailure: (state, action: PayloadAction<string>) => {
//       state.isLoading = false
//       state.error = action.payload
//     },

//     // Get student by ID
//     getStudentByIdStart: (state) => {
//       state.isLoading = true
//       state.error = null
//     },
//     getStudentByIdSuccess: (state, action: PayloadAction<Student>) => {
//       state.isLoading = false
//       state.selectedStudent = action.payload
//       state.error = null
//     },
//     getStudentByIdFailure: (state, action: PayloadAction<string>) => {
//       state.isLoading = false
//       state.error = action.payload
//     },

//     // Create student
//     createStudentStart: (state, action: PayloadAction<any>) => {
//       state.isLoading = true
//       state.error = null
//     },
//     createStudentSuccess: (state, action: PayloadAction<Student>) => {
//       state.isLoading = false
//       state.students.unshift(action.payload)
//       state.error = null
//     },
//     createStudentFailure: (state, action: PayloadAction<string>) => {
//       state.isLoading = false
//       state.error = action.payload
//     },

//     // Update student
//     updateStudentStart: (
//       state,
//       action: PayloadAction<{ id: string; data: any }>
//     ) => {
//       state.isLoading = true
//       state.error = null
//     },
//     updateStudentSuccess: (state, action: PayloadAction<Student>) => {
//       state.isLoading = false
//       const index = state.students.findIndex(
//         (s) => s._id === action.payload._id
//       )
//       if (index !== -1) {
//         state.students[index] = action.payload
//       }
//       state.selectedStudent = action.payload
//       state.error = null
//     },
//     updateStudentFailure: (state, action: PayloadAction<string>) => {
//       state.isLoading = false
//       state.error = action.payload
//     },

//     // Delete student
//     deleteStudentStart: (state, action: PayloadAction<string>) => {
//       state.isLoading = true
//       state.error = null
//     },
//     deleteStudentSuccess: (state, action: PayloadAction<string>) => {
//       state.isLoading = false
//       state.students = state.students.filter((s) => s._id !== action.payload)
//       state.error = null
//     },
//     deleteStudentFailure: (state, action: PayloadAction<string>) => {
//       state.isLoading = false
//       state.error = action.payload
//     },

//     // Clear error
//     clearStudentError: (state) => {
//       state.error = null
//     },

//     // Clear selected student
//     clearSelectedStudent: (state) => {
//       state.selectedStudent = null
//     },

//     // Set filters
//     setFilters: (state, action: PayloadAction<any>) => {
//       state.filters = { ...state.filters, ...action.payload }
//     },

//     // Clear filters
//     clearFilters: (state) => {
//       state.filters = {}
//     },
//   },
// })

// export const {
//   getStudentsStart,
//   getStudentsSuccess,
//   getStudentsFailure,
//   getStudentByIdStart,
//   getStudentByIdSuccess,
//   getStudentByIdFailure,
//   createStudentStart,
//   createStudentSuccess,
//   createStudentFailure,
//   updateStudentStart,
//   updateStudentSuccess,
//   updateStudentFailure,
//   deleteStudentStart,
//   deleteStudentSuccess,
//   deleteStudentFailure,
//   clearStudentError,
//   clearSelectedStudent,
//   setFilters,
//   clearFilters,
// } = studentSlice.actions

// export default studentSlice.reducer

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// interface Student {
//   _id: string
//   fullName: string
//   age: number
//   gender: 'male' | 'female'
//   haleqa: string
//   section: 'A' | 'B' | 'C' | 'D'
//   status: 'active' | 'inactive' | 'graduated' | 'transferred'
//   createdBy: {
//     _id: string
//     name: string
//     email: string
//   }
//   isActive: boolean
//   createdAt: string
//   updatedAt: string
// }
export interface Student {
  _id: string
  code: string
  fullName: string
  age: number
  gender: 'male' | 'female'
  fatherPhone?: string
  motherPhone?: string
  haleqa: string
  section: 'A' | 'B' | 'C' | 'D'
  quranLevel?: string
  hasPayment: boolean
  paymentType?:
    | string
    | { _id: string; name: string; defaultAmount: number; period: string }
  defaultAmount?: number
  status: 'active' | 'inactive' | 'graduated' | 'transferred'
  createdBy: { _id: string; name: string; email: string }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface StudentState {
  students: Student[]
  selectedStudent: Student | null
  isLoading: boolean
  error: string | null
  successMessage: string | null
  filters: {
    haleqa?: string
    section?: string
    status?: string
    search?: string
    hasPayment?: string
  }
  pagination: {
    total: number
    page: number
    limit: number
  }
}

const initialState: StudentState = {
  students: [],
  selectedStudent: null,
  isLoading: false,
  error: null,
  successMessage: null,
  filters: {},
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
  },
}

const studentSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    // Get all students
    getStudentsStart: (
      state,
      action: PayloadAction<{ filters?: any; page?: number }>
    ) => {
      state.isLoading = true
      state.error = null
      if (action.payload?.filters) {
        state.filters = action.payload.filters
      }
    },
    getStudentsSuccess: (
      state,
      action: PayloadAction<{ students: Student[]; total: number }>
    ) => {
      state.isLoading = false
      state.students = action.payload.students
      state.pagination.total = action.payload.total
      state.error = null
    },
    getStudentsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // Get student by ID - FIXED: Accepts string payload
    getStudentByIdStart: (state, action: PayloadAction<string>) => {
      state.isLoading = true
      state.error = null
    },
    getStudentByIdSuccess: (state, action: PayloadAction<Student>) => {
      state.isLoading = false
      state.selectedStudent = action.payload
      state.error = null
    },
    getStudentByIdFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // Create student
    createStudentStart: (state, action: PayloadAction<any>) => {
      state.isLoading = true
      state.error = null
      state.successMessage = null
    },
    createStudentSuccess: (state, action: PayloadAction<Student>) => {
      state.isLoading = false
      state.students.unshift(action.payload)
      state.error = null
      state.successMessage = 'Student registered successfully'
    },
    createStudentFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
      state.successMessage = null
    },

    // Update student
    updateStudentStart: (
      state,
      action: PayloadAction<{ id: string; data: any }>
    ) => {
      state.isLoading = true
      state.error = null
      state.successMessage = null
    },
    updateStudentSuccess: (state, action: PayloadAction<Student>) => {
      state.isLoading = false
      const index = state.students.findIndex(
        (s) => s._id === action.payload._id
      )
      if (index !== -1) {
        state.students[index] = action.payload
      }
      state.selectedStudent = action.payload
      state.error = null
      state.successMessage = 'Student updated successfully'
    },
    updateStudentFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
      state.successMessage = null
    },

    // Delete student
    deleteStudentStart: (state, action: PayloadAction<string>) => {
      state.isLoading = true
      state.error = null
    },
    deleteStudentSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.students = state.students.filter((s) => s._id !== action.payload)
      state.error = null
    },
    deleteStudentFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // Clear error
    clearStudentError: (state) => {
      state.error = null
    },

    // Clear selected student
    clearSelectedStudent: (state) => {
      state.selectedStudent = null
    },

    // Set filters
    setFilters: (state, action: PayloadAction<any>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearStudentSuccess: (state) => {
      state.successMessage = null
    },
    // Clear filters
    clearFilters: (state) => {
      state.filters = {}
    },
  },
})

export const {
  getStudentsStart,
  getStudentsSuccess,
  getStudentsFailure,
  getStudentByIdStart,
  getStudentByIdSuccess,
  getStudentByIdFailure,
  createStudentStart,
  createStudentSuccess,
  createStudentFailure,
  clearStudentSuccess,
  updateStudentStart,
  updateStudentSuccess,
  updateStudentFailure,
  deleteStudentStart,
  deleteStudentSuccess,
  deleteStudentFailure,
  clearStudentError,
  clearSelectedStudent,
  setFilters,
  clearFilters,
} = studentSlice.actions

export default studentSlice.reducer
