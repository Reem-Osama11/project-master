import express from 'express';
import Company from '../models/Company.js'
import {
  ChangeJobApplicationStatus,
  ChangeVisiblity ,
  getCompanyData,
  getCompanyJobApplicants,
  getCompanyPostedJobs,
  loginCompany,
  postJob,
  registerCompany,
} 

from '../controllers/companyController.js';
import upload from '../config/multer.js';
import crypto from "crypto";
import bcrypt from "bcryptjs";

import { protectCompany } from '../middleware/authMiddleware.js';
console.log("📁 companyRoutes LOADED");

const router = express.Router();

// Register a company
router.post('/register', upload.single('image'), registerCompany);

// Company login
router.post('/login', loginCompany);

// Get company data
router.get('/company', protectCompany, getCompanyData);

// Post a job
router.post('/post-job', protectCompany, postJob);

// Get Applicants Data of Company
router.get('/applicants', protectCompany, getCompanyJobApplicants);

// Get Company Job List
// ✅ التعديل: استخدام middleware + controller الجديد
router.get('/list-job',protectCompany, getCompanyPostedJobs);

// Change Applications Status
router.post('/change-status', protectCompany, ChangeJobApplicationStatus);

// Change Applications Visibility
router.post('/change-visiblity', protectCompany, ChangeVisiblity);

// Admin - Get all companies
// router.get('/admin-all', async (req, res) => {
//   try {
//     const adminToken = req.headers.authorization?.split(' ')[1]
//     console.log("Received token:", adminToken)
//     console.log("Expected token:", process.env.ADMIN_TOKEN)
    
//     if (adminToken !== process.env.ADMIN_TOKEN) {
//       return res.status(401).json({ message: 'Unauthorized' })
//     }
//     const companies = await Company.find({}, 'name email image')
//     res.json({ companies })
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// })
import Job from '../models/Job.js';

router.get('/admin-all', async (req, res) => {
  try {
    const adminToken = req.headers.authorization?.split(' ')[1];

    if (adminToken !== process.env.ADMIN_TOKEN) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const companies = await Company.find({}, 'name email image');

    const companiesWithJobs = await Promise.all(
      companies.map(async (company) => {
        const jobsPosted = await Job.countDocuments({
          companyId: company._id
        });

        return {
          ...company._doc,
          jobsPosted
        };
      })
    );

    res.json({ companies: companiesWithJobs });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete('/admin-delete/:id', async (req, res) => {
  try {
    const adminToken = req.headers.authorization?.split(' ')[1];

    if (adminToken !== process.env.ADMIN_TOKEN) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;

    await Company.findByIdAndDelete(id);

    // اختياري: تمسحي الوظايف بتاعتها كمان
    await Job.deleteMany({ companyId: id });

    res.json({ message: 'Company deleted successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Company.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Email not found" });
    }

    // generate token
    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 15 * 60 * 1000; // 15 min

    await user.save();

    // 🔥 fake link (علشان التجربة)
    const resetLink = `http://localhost:5173/reset-password/${token}`;

    console.log("RESET LINK 👉", resetLink);

    res.json({
      success: true,
      message: "Reset link generated (check console)",
      resetLink // optional for testing
    });

  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await Company.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.json({
        success: false,
        message: "Invalid or expired token"
      });
    }

    // 🔥 تشفير الباسورد
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpire = null;

    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully"
    });

  } catch (err) {
    res.json({
      success: false,
      message: err.message
    });
  }
});
export default router;
