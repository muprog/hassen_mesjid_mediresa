import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
})

// Auth APIs
export const authAPI = {
  // Check if registration is available
  checkRegistrationStatus: () => api.get('/auth/registration-status'),

  // Register Committee Leader (only if no leader exists)
  registerCommitteeLeader: (data: any) => api.post('/auth/register', data),

  // Login
  login: (data: any) => api.post('/auth/login', data),

  // Logout
  logout: () => api.post('/auth/logout'),

  // Check if user is authenticated
  checkAuth: () => api.get('/auth/check-auth'),

  // Get current user
  getCurrentUser: () => api.get('/auth/me'),
  forgotPassword: (data: { email: string }) =>
    api.post('/auth/forgot-password', data),
  verifyOtp: (data: { email: string; otp: string }) =>
    api.post('/auth/verify-otp', data),
  resetPassword: (data: { resetToken: string; newPassword: string }) =>
    api.post('/auth/reset-password', data),
}
export const studentAPI = {
  // Create student
  create: (data: any) => api.post('/students', data),

  // Get all students with filters
  getAll: (params?: any) => api.get('/students', { params }),

  // Get student by ID
  getById: (id: string) => api.get(`/students/${id}`),

  // Update student
  update: (id: string, data: any) => api.put(`/students/${id}`, data),

  // Delete student (soft delete)
  delete: (id: string) => api.delete(`/students/${id}`),

  // Get students by haleqa
  getByHaleqa: (haleqa: string) => api.get(`/students/haleqa/${haleqa}`),

  // Get students by teacher
  getByTeacher: (teacherId: string) =>
    api.get(`/students/teacher/${teacherId}`),

  // Add progress
  addProgress: (id: string, data: any) =>
    api.post(`/students/${id}/progress`, data),
}
export const teacherAPI = {
  create: (data: any) => api.post('/teachers', data),
  getAll: (params?: any) => api.get('/teachers', { params }),
  getById: (id: string) => api.get(`/teachers/${id}`),
  update: (id: string, data: any) => api.put(`/teachers/${id}`, data),
  delete: (id: string) => api.delete(`/teachers/${id}`),
  assignStudent: (teacherId: string, studentId: string) =>
    api.post(`/teachers/${teacherId}/assign/${studentId}`),
  removeStudent: (teacherId: string, studentId: string) =>
    api.delete(`/teachers/${teacherId}/remove/${studentId}`),
}
export const committeeMemberAPI = {
  // Create committee member
  create: (data: any) => api.post('/committee-members', data),

  // Get all committee members
  getAll: (params?: any) => api.get('/committee-members', { params }),

  // Get member by ID
  getById: (id: string) => api.get(`/committee-members/${id}`),

  // Update member
  update: (id: string, data: any) => api.put(`/committee-members/${id}`, data),

  // Toggle status (Activate/Deactivate)
  toggleStatus: (id: string) =>
    api.patch(`/committee-members/${id}/toggle-status`),

  // Delete member
  delete: (id: string) => api.delete(`/committee-members/${id}`),
}

export const directorAPI = {
  // Create director
  create: (data: any) => api.post('/directors', data),

  // Get all directors
  getAll: (params?: any) => api.get('/directors', { params }),

  // Get director by ID
  getById: (id: string) => api.get(`/directors/${id}`),

  // Update director
  update: (id: string, data: any) => api.put(`/directors/${id}`, data),

  // Toggle status (Activate/Deactivate)
  toggleStatus: (id: string) => api.patch(`/directors/${id}/toggle-status`),

  // Delete director
  delete: (id: string) => api.delete(`/directors/${id}`),
}
export const paymentTypeAPI = {
  create: (data: {
    name: string
    defaultAmount: number
    period?: 'monthly' | 'one-time' | 'yearly'
  }) => api.post('/payment-types', data),
  getAll: (params?: Record<string, string | number | undefined>) =>
    api.get('/payment-types', { params }),
  getById: (id: string) => api.get(`/payment-types/${id}`),
  update: (
    id: string,
    data: Partial<{
      name: string
      defaultAmount: number
      period: 'monthly' | 'one-time' | 'yearly'
      isActive: boolean
    }>
  ) => api.put(`/payment-types/${id}`, data),
  toggleStatus: (id: string) => api.patch(`/payment-types/${id}/toggle-status`),
  delete: (id: string) => api.delete(`/payment-types/${id}`),
}

// export const paymentAPI = {
//   getAll: (params?: Record<string, string | number | undefined>) =>
//     api.get('/payments', { params }),
//   getById: (id: string) => api.get(`/payments/${id}`),
//   getStats: () => api.get('/payments/stats'),
//   generateThisMonth: () => api.post('/payments/generate-this-month'),
//   markPaid: (id: string) => api.patch(`/payments/${id}/mark-paid`),
//   undo: (id: string) => api.patch(`/payments/${id}/undo`),
//   update: (
//     id: string,
//     data: {
//       paymentType?: string | null
//       amountDue?: number
//       amountPaid?: number
//       method?: 'cash' | 'bank' | 'mobile_money' | 'other' | null
//       note?: string
//     }
//   ) => api.put(`/payments/${id}`, data),
// }
export interface PaymentUpdatePayload {
  paymentType?: string | null
  amountDue?: number
  amountPaid?: number
  method?: 'cash' | 'bank' | 'mobile_money' | 'other' | null
  note?: string
}

export const paymentAPI = {
  getGrid: (params: {
    fromYear: number
    fromMonth: number
    toYear: number
    toMonth: number
    search?: string
    haleqa?: string
    section?: string
  }) => api.get('/payments/grid', { params }),

  getAll: (params?: Record<string, string | number | undefined>) =>
    api.get('/payments', { params }),
  getById: (id: string) => api.get(`/payments/${id}`),
  getStats: () => api.get('/payments/stats'),
  generateThisMonth: () => api.post('/payments/generate-this-month'),
  markPaid: (id: string) => api.patch(`/payments/${id}/mark-paid`),
  undo: (id: string) => api.patch(`/payments/${id}/undo`),
  update: (id: string, data: PaymentUpdatePayload) =>
    api.put(`/payments/${id}`, data),
  createForMonth: (data: {
    studentId: string
    periodYear: number
    periodMonth: number
    markPaid?: boolean
    paymentType?: string | null
    amountDue?: number
    method?: 'cash' | 'bank' | 'mobile_money' | 'other' | null
    note?: string
  }) => api.post('/payments/create-for-month', data),

  generateForMonth: (year: number, month: number) =>
    api.post('/payments/generate-month', { year, month }),
  markMonthPaid: (data: {
    studentId: string
    periodYear: number
    periodMonth: number
    paymentType?: string | null
  }) => api.post('/payments/mark-month-paid', data),
}
export const reportAPI = {
  getPaymentReport: (params: {
    year: number
    month: number
    day?: string
    method?: string
    receivedBy?: string
  }) => api.get('/reports/payments', { params }),
  unpaid: (params: {
    year: number
    month: number
    haleqa?: string
    section?: string
  }) => api.get('/reports/unpaid', { params }),
}

export default api
