import fs from 'fs'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const pdfParseModule = require('pdf-parse')

// ✅ الحل النهائي - pdf-parse بترجع default export
const pdfParse = pdfParseModule.default || pdfParseModule

// ─────────────────────────────────────────
// POST /api/ai/analyze-resume
// ─────────────────────────────────────────
export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "CV file is required" })
    }

    // قراءة الـ PDF وتحويله لنص
    const fileBuffer = fs.readFileSync(req.file.path)
    const pdfData = await pdfParse(fileBuffer)
    const resumeText = pdfData.text

    // احذف الفايل من السيرفر بعد القراءة
    fs.unlinkSync(req.file.path)

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ error: "Could not extract text from PDF" })
    }

    // بعت للـ AI
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Analyze this resume and return ONLY JSON like this:
{
  "skills": ["skill1", "skill2"],
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"]
}

Resume:
${resumeText}`
          }
        ]
      })
    })

    const data = await response.json()
    const aiText = data?.choices?.[0]?.message?.content || "No response"

    let parsed
    try {
      const clean = aiText.replace(/```json|```/g, "").trim()
      parsed = JSON.parse(clean)
    } catch {
      parsed = null
    }

    res.json({
      analysisText: aiText,
      analysis: parsed,
      resumeText,
      extractionStatus: "success"
    })

  } catch (error) {
    console.error("ANALYZE ERROR:", error)
    res.status(500).json({ error: error.message })
  }
}

// ─────────────────────────────────────────
// POST /api/ai/match-resume
// ─────────────────────────────────────────
export const matchResume = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ error: "resumeText and jobDescription are required" })
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Compare this resume with the job description.

Return ONLY JSON like this:
{
  "score": number,
  "missingSkills": ["skill1", "skill2"],
  "courses": [
    {
      "title": "",
      "skill": "",
      "platform": "YouTube | Udemy | Coursera",
      "level": "Beginner | Intermediate | Advanced",
      "duration": "",
      "description": ""
    }
  ]
}

IMPORTANT:
- كل missing skill لازم يكون ليه 2 أو 3 كورسات
- الكورسات تكون متنوعة (Beginner / Intermediate / Advanced)
- رجع على الأقل 6 كورسات في المجموع
- رجع JSON فقط بدون أي كلام تاني

Resume:
${resumeText}

Job Description:
${jobDescription}`
          }
        ]
      })
    })

    const data = await response.json()
    const text = data?.choices?.[0]?.message?.content || ""

    let parsed
    try {
      const clean = text.replace(/```json|```/g, "").trim()
      parsed = JSON.parse(clean)
    } catch {
      return res.json({ result: text })
    }

    res.json({
      score: parsed.score,
      missingSkills: parsed.missingSkills,
      courses: parsed.courses
    })

  } catch (error) {
    console.error("MATCH ERROR:", error)
    res.status(500).json({ error: error.message })
  }
}