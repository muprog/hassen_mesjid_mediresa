import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface PaymentType {
  _id: string
  name: string
  defaultAmount: number
  period: 'monthly' | 'one-time' | 'yearly'
  isActive: boolean
  createdBy: { _id: string; name: string; email: string }
  createdAt: string
  updatedAt: string
}

interface PaymentTypeState {
  paymentTypes: PaymentType[]
  selectedPaymentType: PaymentType | null
  isLoading: boolean
  error: string | null
  filters: {
    search?: string
    activeOnly?: string
  }
}

const initialState: PaymentTypeState = {
  paymentTypes: [],
  selectedPaymentType: null,
  isLoading: false,
  error: null,
  filters: {},
}

const paymentTypeSlice = createSlice({
  name: 'paymentTypes',
  initialState,
  reducers: {
    getPaymentTypesStart: (
      state,
      action: PayloadAction<{ filters?: PaymentTypeState['filters'] }>
    ) => {
      state.isLoading = true
      state.error = null
      if (action.payload?.filters) state.filters = action.payload.filters
    },
    getPaymentTypesSuccess: (state, action: PayloadAction<PaymentType[]>) => {
      state.isLoading = false
      state.paymentTypes = action.payload
      state.error = null
    },
    getPaymentTypesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    getPaymentTypeByIdStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    getPaymentTypeByIdSuccess: (state, action: PayloadAction<PaymentType>) => {
      state.isLoading = false
      state.selectedPaymentType = action.payload
      state.error = null
    },
    getPaymentTypeByIdFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    createPaymentTypeStart: (state, _action: PayloadAction<unknown>) => {
      state.isLoading = true
      state.error = null
    },
    createPaymentTypeSuccess: (state, action: PayloadAction<PaymentType>) => {
      state.isLoading = false
      state.paymentTypes.unshift(action.payload)
      state.error = null
    },
    createPaymentTypeFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    updatePaymentTypeStart: (
      state,
      _action: PayloadAction<{ id: string; data: unknown }>
    ) => {
      state.isLoading = true
      state.error = null
    },
    updatePaymentTypeSuccess: (state, action: PayloadAction<PaymentType>) => {
      state.isLoading = false
      const idx = state.paymentTypes.findIndex(
        (t) => t._id === action.payload._id
      )
      if (idx !== -1) state.paymentTypes[idx] = action.payload
      state.selectedPaymentType = action.payload
      state.error = null
    },
    updatePaymentTypeFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    togglePaymentTypeStatusStart: (state, _action: PayloadAction<string>) => {
      state.isLoading = true
      state.error = null
    },
    togglePaymentTypeStatusSuccess: (
      state,
      action: PayloadAction<PaymentType>
    ) => {
      state.isLoading = false
      const idx = state.paymentTypes.findIndex(
        (t) => t._id === action.payload._id
      )
      if (idx !== -1) state.paymentTypes[idx] = action.payload
      state.error = null
    },
    togglePaymentTypeStatusFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    deletePaymentTypeStart: (state, _action: PayloadAction<string>) => {
      state.isLoading = true
      state.error = null
    },
    deletePaymentTypeSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.paymentTypes = state.paymentTypes.filter(
        (t) => t._id !== action.payload
      )
      state.error = null
    },
    deletePaymentTypeFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },

    clearPaymentTypeError: (state) => {
      state.error = null
    },
    clearSelectedPaymentType: (state) => {
      state.selectedPaymentType = null
    },
  },
})

export const {
  getPaymentTypesStart,
  getPaymentTypesSuccess,
  getPaymentTypesFailure,
  getPaymentTypeByIdStart,
  getPaymentTypeByIdSuccess,
  getPaymentTypeByIdFailure,
  createPaymentTypeStart,
  createPaymentTypeSuccess,
  createPaymentTypeFailure,
  updatePaymentTypeStart,
  updatePaymentTypeSuccess,
  updatePaymentTypeFailure,
  togglePaymentTypeStatusStart,
  togglePaymentTypeStatusSuccess,
  togglePaymentTypeStatusFailure,
  deletePaymentTypeStart,
  deletePaymentTypeSuccess,
  deletePaymentTypeFailure,
  clearPaymentTypeError,
  clearSelectedPaymentType,
} = paymentTypeSlice.actions

export default paymentTypeSlice.reducer
