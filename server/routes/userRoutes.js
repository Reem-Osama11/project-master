// import express from 'express'
// import { applyForJob, getUserData, getUserJobApplications, updateUserResume } from '../controllers/userController.js'
// import upload from '../config/multer.js'

// const router = express.Router()

// // Get user data
// router.get('/user',getUserData)

// // Apply for a job
// router.post('/apply',applyForJob)

// // Get a applied jobs data
// router.get('/applications',getUserJobApplications)

// // update user profile
// router.post('/update-resume', upload.single('resume'),updateUserResume)

// export default router
import express from "express";
import {
  applyForJob,
  getUserData,
  getUserJobApplications,
  updateUserResume,
  saveUser
} from "../controllers/userController.js";
import upload from "../config/multer.js";
import { requireAuth } from "@clerk/express";

const router = express.Router();


router.post("/save", requireAuth, saveUser);


router.get("/user", requireAuth, getUserData);


router.post("/apply", requireAuth, applyForJob);


router.get("/applications", requireAuth, getUserJobApplications);


router.post("/update-resume", requireAuth, upload.single("resume"), updateUserResume);


export default router;

