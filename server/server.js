import './config/instrument.js'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from './controllers/webhooks.js'
import companyRoutes from './routes/companyRoutes.js'
import connectCloudinary from './config/cloudinary.js'
import jobRoutes from './routes/jobRoutes.js'
import userRoutes from './routes/userRoutes.js'
import jobApplicationRoutes from './routes/jobApplicationRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import adminRoutes from './routes/adminRoutes.js'
import aiRoutes from "./routes/aiRoutes.js";

// Initialize express
const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Connect DB + Cloudinary مرة واحدة (مناسب لـ serverless)
let ready
const init = async () => {
  await connectDB()
  await connectCloudinary()
}

app.use(async (req, res, next) => {
  try {
    ready ??= init()
    await ready
    next()
  } catch (err) {
    ready = null
    next(err)
  }
})

app.use(clerkMiddleware())

app.use((req, res, next) => {
  console.log("SERVER RECEIVED:", req.method, req.url);
  next();
});

// Routes
app.get('/', (req, res) => res.send("API WORKING"))

app.post('/webhooks', clerkWebhooks)

app.use('/api/company', companyRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/users', userRoutes)
app.use('/api/applications', jobApplicationRoutes)
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);

Sentry.setupExpressErrorHandler(app);

// يشتغل محلياً بس، مش على Vercel
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5001
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  })
}

export default app