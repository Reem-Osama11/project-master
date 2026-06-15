import express from "express";
import { analyzeResume, matchResume } from "../controllers/aiController.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// ✅ بدل dest بس، حددنا نوع الملف والحجم
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = [".pdf", ".doc", ".docx"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, DOCX files are allowed"));
    }
  }
});

router.post("/analyze-resume", upload.single("cv"), analyzeResume);
router.post("/match-resume", matchResume);

export default router;