import express from "express";
import { analyzeResume, matchResume } from "../controllers/aiController.js";
import multer from "multer";
import path from "path";
import os from "os";

const router = express.Router();

// على Vercel الكتابة مسموحة في /tmp بس
const storage = multer.diskStorage({
  destination: os.tmpdir(),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 }, // 4MB (حد Vercel حوالي 4.5MB)
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