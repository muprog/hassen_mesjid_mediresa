// import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// interface CommitteeMember {
//   _id: string
//   fullName: string
//   phone: string
//   email: string
//   role: 'committee_member'
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

// interface CommitteeMemberState {
//   members: CommitteeMember[]
//   selectedMember: CommitteeMember | null
//   isLoading: boolean
//   error: string | null
//   filters: {
//     status?: string
//     search?: string
//   }
// }

// const initialState: CommitteeMemberState = {
//   members: [],
//   selectedMember: null,
//   isLoading: false,
//   error: null,
//   filters: {},
// }

// const committeeMemberSlice = createSlice({
//   name: 'committeeMembers',
//   initialState,
//   reducers: {
//     // Get all members
//     getMembersStart: (state, action: PayloadAction<{ filters?: any }>) => {
//       state.isLoading = true
//       state.error = null
//       if (action.payload?.filters) {
//         state.filters = action.payload.filters
//       }
//     },
//     getMembersSuccess: (state, action: PayloadAction<CommitteeMember[]>) => {
//       state.isLoading = false
//       state.members = action.payload
//       state.error = null
//     },
//     getMembersFailure: (state, action: PayloadAction<string>) => {
//       state.isLoading = false
//       state.error = action.payload
//     },

//     // Get member by ID
//     getMemberByIdStart: (state) => {
//       state.isLoading = true
//       state.error = null
//     },
//     getMemberByIdSuccess: (state, action: PayloadAction<CommitteeMember>) => {
//       state.isLoading = false
//       state.selectedMember = action.payload
//       state.error = null
//     },
//     getMemberByIdFailure: (state, action: PayloadAction<string>) => {
//       state.isLoading = false
//       state.error = action.payload
//     },

//     // Create member
//     createMemberStart: (state, action: PayloadAction<any>) => {
//       state.isLoading = true
//       state.error = null
//     },
//     createMemberSuccess: (state, action: PayloadAction<CommitteeMember>) => {
//       state.isLoading = false
//       state.members.unshift(action.payload)
//       state.error = null
//     },
//     createMemberFailure: (state, action: PayloadAction<string>) => {
//       state.isLoading = false
//       state.error = action.payload
//     },

//     // Update member
//     updateMemberStart: (
//       state,
//       action: PayloadAction<{ id: string; data: any }>
//     ) => {
//       state.isLoading = true
//       state.error = null
//     },
//     updateMemberSuccess: (state, action: PayloadAction<CommitteeMember>) => {
//       state.isLoading = false
//       const index = state.members.findIndex((m) => m._id === action.payload._id)
//       if (index !== -1) {
//         state.members[index] = action.payload
//       }
//       state.selectedMember = action.payload
//       state.error = null
//     },
//     updateMemberFailure: (state, action: PayloadAction<string>) => {
//       state.isLoading = false
//       state.error = action.payload
//     },

//     // Toggle status
//     toggleMemberStatusStart: (state, action: PayloadAction<string>) => {
//       state.isLoading = true
//       state.error = null
//     },
//     toggleMemberStatusSuccess: (
//       state,
//       action: PayloadAction<CommitteeMember>
//     ) => {
//       state.isLoading = false
//       const index = state.members.findIndex((m) => m._id === action.payload._id)
//       if (index !== -1) {
//         state.members[index] = action.payload
//       }
//       state.error = null
//     },
//     toggleMemberStatusFailure: (state, action: PayloadAction<string>) => {
//       state.isLoading = false
//       state.error = action.payload
//     },

//     // Delete member
//     deleteMemberStart: (state, action: PayloadAction<string>) => {
//       state.isLoading = true
//       state.error = null
//     },
//     deleteMemberSuccess: (state, action: PayloadAction<string>) => {
//       state.isLoading = false
//       state.members = state.members.filter((m) => m._id !== action.payload)
//       state.error = null
//     },
//     deleteMemberFailure: (state, action: PayloadAction<string>) => {
//       state.isLoading = false
//       state.error = action.payload
//     },

//     // Clear error
//     clearMemberError: (state) => {
//       state.error = null
//     },

//     // Clear selected member
//     clearSelectedMember: (state) => {
//       state.selectedMember = null
//     },

//     // Set filters
//     setMemberFilters: (state, action: PayloadAction<any>) => {
//       state.filters = { ...state.filters, ...action.payload }
//     },

//     // Clear filters
//     clearMemberFilters: (state) => {
//       state.filters = {}
//     },
//   },
// })

// export const {
//   getMembersStart,
//   getMembersSuccess,
//   getMembersFailure,
//   getMemberByIdStart,
//   getMemberByIdSuccess,
//   getMemberByIdFailure,
//   createMemberStart,
//   createMemberSuccess,
//   createMemberFailure,
//   updateMemberStart,
//   updateMemberSuccess,
//   updateMemberFailure,
//   toggleMemberStatusStart,
//   toggleMemberStatusSuccess,
//   toggleMemberStatusFailure,
//   deleteMemberStart,
//   deleteMemberSuccess,
//   deleteMemberFailure,
//   clearMemberError,
//   clearSelectedMember,
//   setMemberFilters,
//   clearMemberFilters,
// } = committeeMemberSlice.actions

// export default committeeMemberSlice.reducer

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CommitteeMember {
  _id: string
  fullName: string
  phone: string
  email: string
  role: 'committee_member'
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

interface CommitteeMemberState {
  members: CommitteeMember[]
  selectedMember: CommitteeMember | null
  isLoading: boolean
  error: string | null
  filters: {
    status?: string
    search?: string
  }
}

const initialState: CommitteeMemberState = {
  members: [],
  selectedMember: null,
  isLoading: false,
  error: null,
  filters: {},
}

const committeeMemberSlice = createSlice({
  name: 'committeeMembers',
  initialState,
  reducers: {
    // Get all members
    getMembersStart: (state, action: PayloadAction<{ filters?: any }>) => {
      state.isLoading = true
      state.error = null
      if (action.payload?.filters) {
        state.filters = action.payload.filters
      }
    },
    getMembersSuccess: (state, action: PayloadAction<CommitteeMember[]>) => {
      state.isLoading = false
      state.members = action.payload
      state.error = null
    },
    getMembersFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // Get member by ID - FIXED: Accepts string payload
    getMemberByIdStart: (state, action: PayloadAction<string>) => {
      state.isLoading = true
      state.error = null
    },
    getMemberByIdSuccess: (state, action: PayloadAction<CommitteeMember>) => {
      state.isLoading = false
      state.selectedMember = action.payload
      state.error = null
    },
    getMemberByIdFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // Create member
    createMemberStart: (state, action: PayloadAction<any>) => {
      state.isLoading = true
      state.error = null
    },
    createMemberSuccess: (state, action: PayloadAction<CommitteeMember>) => {
      state.isLoading = false
      state.members.unshift(action.payload)
      state.error = null
    },
    createMemberFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // Update member
    updateMemberStart: (
      state,
      action: PayloadAction<{ id: string; data: any }>
    ) => {
      state.isLoading = true
      state.error = null
    },
    updateMemberSuccess: (state, action: PayloadAction<CommitteeMember>) => {
      state.isLoading = false
      const index = state.members.findIndex((m) => m._id === action.payload._id)
      if (index !== -1) {
        state.members[index] = action.payload
      }
      state.selectedMember = action.payload
      state.error = null
    },
    updateMemberFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // Toggle status
    toggleMemberStatusStart: (state, action: PayloadAction<string>) => {
      state.isLoading = true
      state.error = null
    },
    toggleMemberStatusSuccess: (
      state,
      action: PayloadAction<CommitteeMember>
    ) => {
      state.isLoading = false
      const index = state.members.findIndex((m) => m._id === action.payload._id)
      if (index !== -1) {
        state.members[index] = action.payload
      }
      state.error = null
    },
    toggleMemberStatusFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // Delete member
    deleteMemberStart: (state, action: PayloadAction<string>) => {
      state.isLoading = true
      state.error = null
    },
    deleteMemberSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.members = state.members.filter((m) => m._id !== action.payload)
      state.error = null
    },
    deleteMemberFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    // Clear error
    clearMemberError: (state) => {
      state.error = null
    },

    // Clear selected member
    clearSelectedMember: (state) => {
      state.selectedMember = null
    },

    // Set filters
    setMemberFilters: (state, action: PayloadAction<any>) => {
      state.filters = { ...state.filters, ...action.payload }
    },

    // Clear filters
    clearMemberFilters: (state) => {
      state.filters = {}
    },
  },
})

export const {
  getMembersStart,
  getMembersSuccess,
  getMembersFailure,
  getMemberByIdStart,
  getMemberByIdSuccess,
  getMemberByIdFailure,
  createMemberStart,
  createMemberSuccess,
  createMemberFailure,
  updateMemberStart,
  updateMemberSuccess,
  updateMemberFailure,
  toggleMemberStatusStart,
  toggleMemberStatusSuccess,
  toggleMemberStatusFailure,
  deleteMemberStart,
  deleteMemberSuccess,
  deleteMemberFailure,
  clearMemberError,
  clearSelectedMember,
  setMemberFilters,
  clearMemberFilters,
} = committeeMemberSlice.actions

export default committeeMemberSlice.reducer
