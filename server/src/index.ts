import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import authRoutes from './routes/authRoutes'
import studentRoutes from './routes/studentRoutes'
import teacherRoutes from './routes/teacherRoutes'
import committeeMemberRoutes from './routes/commiteeMemberRoutes'
import directorRoutes from './routes/directorRoutes'
import paymentTypeRoutes from './routes/paymentTypeRoutes'
import paymentRoutes from './routes/paymentRoutes'
import reportRoutes from './routes/reportRoutes'
import { generatePendingPayments } from './utils/generatePendingPayments'
import { User } from './models/User'

dotenv.config()

const app: Express = express()
const PORT = process.env.PORT || 5000

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
)
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mediresa')
  .then(() => {
    console.log('✅ MongoDB connected successfully')
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err)
    process.exit(1)
  })

app.use('/api/auth', authRoutes)
app.use('/api/students', studentRoutes)

app.use('/api/teachers', teacherRoutes)
app.use('/api/committee-members', committeeMemberRoutes)
app.use('/api/directors', directorRoutes)

app.use('/api/payment-types', paymentTypeRoutes)
app.use('/api/payments', paymentRoutes)

app.use('/api/reports', reportRoutes)
// Auto-generate pending payments on startup
mongoose.connection.once('open', async () => {
  try {
    const now = new Date()
    const leader = await User.findOne({ role: 'committee_leader' }).select(
      '_id'
    )
    const result = await generatePendingPayments(
      now.getFullYear(),
      now.getMonth() + 1,
      leader?._id?.toString() ?? null
    )
    console.log(
      `📅 Pending payments: ${result.created} created, ${result.skipped} skipped (${result.periodLabel})`
    )
  } catch (err) {
    console.error('Auto-generate pending payments failed:', err)
  }
})
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Mediresa Management System API',
    status: 'Server is running',
    timestamp: new Date().toISOString(),
  })
})

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    database:
      mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  })
})

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err)
  process.exit(1)
})
