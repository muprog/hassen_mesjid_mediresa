// import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// interface Director {
//   _id: string
//   fullName: string
//   phone: string
//   email: string
//   role: 'director'
//   status: 'active' | 'inactive'
//   createdBy: {
//     _id: string
//     fullName: string
//     email: string
//   }
//   lastLogin?: string
//   isActive: boolean
//   createdAt: string
//   updatedAt: string
// }

// interface DirectorState {
//   directors: Director[]
//   selectedDirector: Director | null
//   isLoading: boolean
//   error: string | null
//   filters: {
//     status?: string
//     search?: string
//   }
// }

// const initialState: DirectorState = {
//   directors: [],
//   selectedDirector: null,
//   isLoading: false,
//   error: null,
//   filters: {},
// }

// const directorSlice = createSlice({
//   name: 'directors',
//   initialState,
//   reducers: {
//     // Get all directors
//     getDirectorsStart: (state, action: PayloadAction<{ filters?: any }>) => {
//       state.isLoading = true
//       state.error = null
//       if (action.payload?.filters) {
//         state.filters = action.payload.filters
//       }
//     },
//     getDirectorsSuccess: (state, action: PayloadAction<Director[]>) => {
//       state.isLoading = false
//       state.directors = action.payload
//       state.error = null
//     },
//     getDirectorsFailure: (state, action: PayloadAction<string>) => {
//       state.isLoading = false
//       state.error = action.payload
//     },

//     // Get director by ID
//     getDirectorByIdStart: (state) => {
//       state.isLoading = true
//       state.error = null
//     },
//     getDirectorByIdSuccess: (state, action: PayloadAction<Director>) => {
//       state.isLoading = false
//       state.selectedDirector = action.payload
//       state.error = null
//     },
//     getDirectorByIdFailure: (state, action: PayloadAction<string>) => {
//       state.isLoading = false
//       state.error = action.payload
//     },

//     // Create director
//     createDirectorStart: (state, action: PayloadAction<any>) => {
//       state.isLoading = true
//       state.error = null
//     },
//     createDirectorSuccess: (state, action: PayloadAction<Director>) => {
//       state.isLoading = false
//       state.directors.unshift(action.payload)
//       state.error = null
//     },
//     createDirectorFailure: (state, action: PayloadAction<string>) => {
//       state.isLoading = false
//       state.error = action.payload
//     },

//     // Update director
//     updateDirectorStart: (
//       state,
//       action: PayloadAction<{ id: string; data: any }>
//     ) => {
//       state.isLoading = true
//       state.error = null
//     },
//     updateDirectorSuccess: (state, action: PayloadAction<Director>) => {
//       state.isLoading = false
//       const index = state.directors.findIndex(
//         (d) => d._id === action.payload._id
//       )
//       if (index !== -1) {
//         state.directors[index] = action.payload
//       }
//       state.selectedDirector = action.payload
//       state.error = null
//     },
//     updateDirectorFailure: (state, action: PayloadAction<string>) => {
//       state.isLoading = false
//       state.error = action.payload
//     },

//     // Toggle status
//     toggleDirectorStatusStart: (state, action: PayloadAction<string>) => {
//       state.isLoading = true
//       state.error = null
//     },
//     toggleDirectorStatusSuccess: (state, action: PayloadAction<Director>) => {
//       state.isLoading = false
//       const index = state.directors.findIndex(
//         (d) => d._id === action.payload._id
//       )
//       if (index !== -1) {
//         state.directors[index] = action.payload
//       }
//       state.error = null
//     },
//     toggleDirectorStatusFailure: (state, action: PayloadAction<string>) => {
//       state.isLoading = false
//       state.error = action.payload
//     },

//     // Delete director
//     deleteDirectorStart: (state, action: PayloadAction<string>) => {
//       state.isLoading = true
//       state.error = null
//     },
//     deleteDirectorSuccess: (state, action: PayloadAction<string>) => {
//       state.isLoading = false
//       state.directors = state.directors.filter((d) => d._id !== action.payload)
//       state.error = null
//     },
//     deleteDirectorFailure: (state, action: PayloadAction<string>) => {
//       state.isLoading = false
//       state.error = action.payload
//     },

//     // Clear error
//     clearDirectorError: (state) => {
//       state.error = null
//     },

//     // Clear selected director
//     clearSelectedDirector: (state) => {
//       state.selectedDirector = null
//     },

//     // Set filters
//     setDirectorFilters: (state, action: PayloadAction<any>) => {
//       state.filters = { ...state.filters, ...action.payload }
//     },

//     // Clear filters
//     clearDirectorFilters: (state) => {
//       state.filters = {}
//     },
//   },
// })

// export const {
//   getDirectorsStart,
//   getDirectorsSuccess,
//   getDirectorsFailure,
//   getDirectorByIdStart,
//   getDirectorByIdSuccess,
//   getDirectorByIdFailure,
//   createDirectorStart,
//   createDirectorSuccess,
//   createDirectorFailure,
//   updateDirectorStart,
//   updateDirectorSuccess,
//   updateDirectorFailure,
//   toggleDirectorStatusStart,
//   toggleDirectorStatusSuccess,
//   toggleDirectorStatusFailure,
//   deleteDirectorStart,
//   deleteDirectorSuccess,
//   deleteDirectorFailure,
//   clearDirectorError,
//   clearSelectedDirector,
//   setDirectorFilters,
//   clearDirectorFilters,
// } = directorSlice.actions

// export default directorSlice.reducer
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Director {
  _id: string
  fullName: string
  phone: string
  email: string
  role: 'director'
  status: 'active' | 'inactive'
  createdBy: {
    _id: string
    fullName: string
    email: string
  }
  lastLogin?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface DirectorState {
  directors: Director[]
  selectedDirector: Director | null
  isLoading: boolean
  error: string | null
  filters: {
    status?: string
    search?: string
  }
}

const initialState: DirectorState = {
  directors: [],
  selectedDirector: null,
  isLoading: false,
  error: null,
  filters: {},
}

const directorSlice = createSlice({
  name: 'directors',
  initialState,
  reducers: {
    // Get all directors
    getDirectorsStart: (state, action: PayloadAction<{ filters?: any }>) => {
      state.isLoading = true
      state.error = null
      if (action.payload?.filters) {
        state.filters = action.payload.filters
      }
    },
    getDirectorsSuccess: (state, action: PayloadAction<Director[]>) => {
      state.isLoading = false
      state.directors = action.payload
      state.error = null
    },
    getDirectorsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // Get director by ID - FIXED: Accepts string payload
    getDirectorByIdStart: (state, action: PayloadAction<string>) => {
      state.isLoading = true
      state.error = null
    },
    getDirectorByIdSuccess: (state, action: PayloadAction<Director>) => {
      state.isLoading = false
      state.selectedDirector = action.payload
      state.error = null
    },
    getDirectorByIdFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // Create director
    createDirectorStart: (state, action: PayloadAction<any>) => {
      state.isLoading = true
      state.error = null
    },
    createDirectorSuccess: (state, action: PayloadAction<Director>) => {
      state.isLoading = false
      state.directors.unshift(action.payload)
      state.error = null
    },
    createDirectorFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // Update director
    updateDirectorStart: (
      state,
      action: PayloadAction<{ id: string; data: any }>
    ) => {
      state.isLoading = true
      state.error = null
    },
    updateDirectorSuccess: (state, action: PayloadAction<Director>) => {
      state.isLoading = false
      const index = state.directors.findIndex(
        (d) => d._id === action.payload._id
      )
      if (index !== -1) {
        state.directors[index] = action.payload
      }
      state.selectedDirector = action.payload
      state.error = null
    },
    updateDirectorFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // Toggle status
    toggleDirectorStatusStart: (state, action: PayloadAction<string>) => {
      state.isLoading = true
      state.error = null
    },
    toggleDirectorStatusSuccess: (state, action: PayloadAction<Director>) => {
      state.isLoading = false
      const index = state.directors.findIndex(
        (d) => d._id === action.payload._id
      )
      if (index !== -1) {
        state.directors[index] = action.payload
      }
      state.error = null
    },
    toggleDirectorStatusFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // Delete director
    deleteDirectorStart: (state, action: PayloadAction<string>) => {
      state.isLoading = true
      state.error = null
    },
    deleteDirectorSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.directors = state.directors.filter((d) => d._id !== action.payload)
      state.error = null
    },
    deleteDirectorFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // Clear error
    clearDirectorError: (state) => {
      state.error = null
    },

    // Clear selected director
    clearSelectedDirector: (state) => {
      state.selectedDirector = null
    },

    // Set filters
    setDirectorFilters: (state, action: PayloadAction<any>) => {
      state.filters = { ...state.filters, ...action.payload }
    },

    // Clear filters
    clearDirectorFilters: (state) => {
      state.filters = {}
    },
  },
})

export const {
  getDirectorsStart,
  getDirectorsSuccess,
  getDirectorsFailure,
  getDirectorByIdStart,
  getDirectorByIdSuccess,
  getDirectorByIdFailure,
  createDirectorStart,
  createDirectorSuccess,
  createDirectorFailure,
  updateDirectorStart,
  updateDirectorSuccess,
  updateDirectorFailure,
  toggleDirectorStatusStart,
  toggleDirectorStatusSuccess,
  toggleDirectorStatusFailure,
  deleteDirectorStart,
  deleteDirectorSuccess,
  deleteDirectorFailure,
  clearDirectorError,
  clearSelectedDirector,
  setDirectorFilters,
  clearDirectorFilters,
} = directorSlice.actions

export default directorSlice.reducer
