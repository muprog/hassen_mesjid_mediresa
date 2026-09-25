// import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// interface Teacher {
//   _id: string
//   fullName: string
//   age: number
//   phone: string
//   experience: number
//   kitabLearned: string[]
//   status: 'active' | 'inactive' | 'on_leave'
//   createdBy: {
//     _id: string
//     name: string
//     email: string
//   }
//   isActive: boolean
//   createdAt: string
//   updatedAt: string
// }

// interface TeacherState {
//   teachers: Teacher[]
//   selectedTeacher: Teacher | null
//   isLoading: boolean
//   error: string | null
//   filters: {
//     status?: string
//     search?: string
//   }
// }

// const initialState: TeacherState = {
//   teachers: [],
//   selectedTeacher: null,
//   isLoading: false,
//   error: null,
//   filters: {},
// }

// const teacherSlice = createSlice({
//   name: 'teachers',
//   initialState,
//   reducers: {
//     // Get all teachers
//     getTeachersStart: (state, action: PayloadAction<{ filters?: any }>) => {
//       state.isLoading = true
//       state.error = null
//       if (action.payload?.filters) {
//         state.filters = action.payload.filters
//       }
//     },
//     getTeachersSuccess: (state, action: PayloadAction<Teacher[]>) => {
//       state.isLoading = false
//       state.teachers = action.payload
//       state.error = null
//     },
//     getTeachersFailure: (state, action: PayloadAction<string>) => {
//       state.isLoading = false
//       state.error = action.payload
//     },

//     // Get teacher by ID
//     getTeacherByIdStart: (state) => {
//       state.isLoading = true
//       state.error = null
//     },
//     getTeacherByIdSuccess: (state, action: PayloadAction<Teacher>) => {
//       state.isLoading = false
//       state.selectedTeacher = action.payload
//       state.error = null
//     },
//     getTeacherByIdFailure: (state, action: PayloadAction<string>) => {
//       state.isLoading = false
//       state.error = action.payload
//     },

//     // Create teacher
//     createTeacherStart: (state, action: PayloadAction<any>) => {
//       state.isLoading = true
//       state.error = null
//     },
//     createTeacherSuccess: (state, action: PayloadAction<Teacher>) => {
//       state.isLoading = false
//       state.teachers.unshift(action.payload)
//       state.error = null
//     },
//     createTeacherFailure: (state, action: PayloadAction<string>) => {
//       state.isLoading = false
//       state.error = action.payload
//     },

//     // Update teacher
//     updateTeacherStart: (
//       state,
//       action: PayloadAction<{ id: string; data: any }>
//     ) => {
//       state.isLoading = true
//       state.error = null
//     },
//     updateTeacherSuccess: (state, action: PayloadAction<Teacher>) => {
//       state.isLoading = false
//       const index = state.teachers.findIndex(
//         (t) => t._id === action.payload._id
//       )
//       if (index !== -1) {
//         state.teachers[index] = action.payload
//       }
//       state.selectedTeacher = action.payload
//       state.error = null
//     },
//     updateTeacherFailure: (state, action: PayloadAction<string>) => {
//       state.isLoading = false
//       state.error = action.payload
//     },

//     // Delete teacher
//     deleteTeacherStart: (state, action: PayloadAction<string>) => {
//       state.isLoading = true
//       state.error = null
//     },
//     deleteTeacherSuccess: (state, action: PayloadAction<string>) => {
//       state.isLoading = false
//       state.teachers = state.teachers.filter((t) => t._id !== action.payload)
//       state.error = null
//     },
//     deleteTeacherFailure: (state, action: PayloadAction<string>) => {
//       state.isLoading = false
//       state.error = action.payload
//     },

//     // Clear error
//     clearTeacherError: (state) => {
//       state.error = null
//     },

//     // Clear selected teacher
//     clearSelectedTeacher: (state) => {
//       state.selectedTeacher = null
//     },

//     // Set filters
//     setTeacherFilters: (state, action: PayloadAction<any>) => {
//       state.filters = { ...state.filters, ...action.payload }
//     },

//     // Clear filters
//     clearTeacherFilters: (state) => {
//       state.filters = {}
//     },
//   },
// })

// export const {
//   getTeachersStart,
//   getTeachersSuccess,
//   getTeachersFailure,
//   getTeacherByIdStart,
//   getTeacherByIdSuccess,
//   getTeacherByIdFailure,
//   createTeacherStart,
//   createTeacherSuccess,
//   createTeacherFailure,
//   updateTeacherStart,
//   updateTeacherSuccess,
//   updateTeacherFailure,
//   deleteTeacherStart,
//   deleteTeacherSuccess,
//   deleteTeacherFailure,
//   clearTeacherError,
//   clearSelectedTeacher,
//   setTeacherFilters,
//   clearTeacherFilters,
// } = teacherSlice.actions

// export default teacherSlice.reducer

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Teacher {
  _id: string
  fullName: string
  age: number
  phone: string
  experience: number
  kitabLearned: string[]
  status: 'active' | 'inactive' | 'on_leave'
  createdBy: {
    _id: string
    name: string
    email: string
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface TeacherState {
  teachers: Teacher[]
  selectedTeacher: Teacher | null
  isLoading: boolean
  error: string | null
  filters: {
    status?: string
    search?: string
  }
}

const initialState: TeacherState = {
  teachers: [],
  selectedTeacher: null,
  isLoading: false,
  error: null,
  filters: {},
}

const teacherSlice = createSlice({
  name: 'teachers',
  initialState,
  reducers: {
    // Get all teachers
    getTeachersStart: (state, action: PayloadAction<{ filters?: any }>) => {
      state.isLoading = true
      state.error = null
      if (action.payload?.filters) {
        state.filters = action.payload.filters
      }
    },
    getTeachersSuccess: (state, action: PayloadAction<Teacher[]>) => {
      state.isLoading = false
      state.teachers = action.payload
      state.error = null
    },
    getTeachersFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // Get teacher by ID - FIXED: Accepts string payload
    getTeacherByIdStart: (state, action: PayloadAction<string>) => {
      state.isLoading = true
      state.error = null
    },
    getTeacherByIdSuccess: (state, action: PayloadAction<Teacher>) => {
      state.isLoading = false
      state.selectedTeacher = action.payload
      state.error = null
    },
    getTeacherByIdFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // Create teacher
    createTeacherStart: (state, action: PayloadAction<any>) => {
      state.isLoading = true
      state.error = null
    },
    createTeacherSuccess: (state, action: PayloadAction<Teacher>) => {
      state.isLoading = false
      state.teachers.unshift(action.payload)
      state.error = null
    },
    createTeacherFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // Update teacher
    updateTeacherStart: (
      state,
      action: PayloadAction<{ id: string; data: any }>
    ) => {
      state.isLoading = true
      state.error = null
    },
    updateTeacherSuccess: (state, action: PayloadAction<Teacher>) => {
      state.isLoading = false
      const index = state.teachers.findIndex(
        (t) => t._id === action.payload._id
      )
      if (index !== -1) {
        state.teachers[index] = action.payload
      }
      state.selectedTeacher = action.payload
      state.error = null
    },
    updateTeacherFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // Delete teacher
    deleteTeacherStart: (state, action: PayloadAction<string>) => {
      state.isLoading = true
      state.error = null
    },
    deleteTeacherSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.teachers = state.teachers.filter((t) => t._id !== action.payload)
      state.error = null
    },
    deleteTeacherFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // Clear error
    clearTeacherError: (state) => {
      state.error = null
    },

    // Clear selected teacher
    clearSelectedTeacher: (state) => {
      state.selectedTeacher = null
    },

    // Set filters
    setTeacherFilters: (state, action: PayloadAction<any>) => {
      state.filters = { ...state.filters, ...action.payload }
    },

    // Clear filters
    clearTeacherFilters: (state) => {
      state.filters = {}
    },
  },
})

export const {
  getTeachersStart,
  getTeachersSuccess,
  getTeachersFailure,
  getTeacherByIdStart,
  getTeacherByIdSuccess,
  getTeacherByIdFailure,
  createTeacherStart,
  createTeacherSuccess,
  createTeacherFailure,
  updateTeacherStart,
  updateTeacherSuccess,
  updateTeacherFailure,
  deleteTeacherStart,
  deleteTeacherSuccess,
  deleteTeacherFailure,
  clearTeacherError,
  clearSelectedTeacher,
  setTeacherFilters,
  clearTeacherFilters,
} = teacherSlice.actions

export default teacherSlice.reducer
