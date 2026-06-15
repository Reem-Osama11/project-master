// import { useState, useContext } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { toast } from 'react-toastify'
// import { motion } from 'framer-motion'
// import Navbar from '../components/Navbar'
// import Footer from '../components/Footer'
// import { AppContext } from '../context/AppContext'

// const MAX_FILE_SIZE_MB = 5

// const ATSChecker = () => {
//   const navigate = useNavigate()
//   const { backendUrl } = useContext(AppContext)

//   const [formData, setFormData] = useState({
//     companyTitle: '',
//     jobTitle: '',
//     jobDescription: '',
//     cvFile: null,
//   })

//   const [isAnalyzing, setIsAnalyzing] = useState(false)
//   const [analyzeStatus, setAnalyzeStatus] = useState('')
//   const [dragActive, setDragActive] = useState(false)

//   // ================= HANDLERS =================

//   const handleTextChange = (e) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files?.[0] || null
//     setFormData((prev) => ({ ...prev, cvFile: selectedFile }))
//   }

//   const handleDrag = (e) => {
//     e.preventDefault()
//     e.stopPropagation()
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true)
//     } else if (e.type === "dragleave") {
//       setDragActive(false)
//     }
//   }

//   const handleDrop = (e) => {
//     e.preventDefault()
//     e.stopPropagation()
//     setDragActive(false)

//     const file = e.dataTransfer.files?.[0]
//     if (file) {
//       const error = validateFile(file)
//       if (error) {
//         toast.error(error)
//       } else {
//         setFormData((prev) => ({ ...prev, cvFile: file }))
//         toast.success(`File selected: ${file.name}`)
//       }
//     }
//   }

//   const validateFile = (file) => {
//     if (!file) return 'Please upload your CV.'

//     const allowedExtensions = ['pdf', 'doc', 'docx']
//     const extension = file.name.split('.').pop()?.toLowerCase()

//     if (!allowedExtensions.includes(extension)) {
//       return 'Only PDF, DOC, and DOCX files are allowed.'
//     }

//     const maxBytes = MAX_FILE_SIZE_MB * 1024 * 1024
//     if (file.size > maxBytes) {
//       return `File size must be less than ${MAX_FILE_SIZE_MB}MB.`
//     }

//     return ''
//   }

//   // ================= SUBMIT =================

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     const { companyTitle, jobTitle, jobDescription, cvFile } = formData

//     if (!companyTitle.trim()) return toast.error('Company title is required.')
//     if (!jobTitle.trim()) return toast.error('Job name is required.')
//     if (!jobDescription.trim()) return toast.error('Job description is required.')
//     if (jobDescription.length < 50) return toast.error('Minimum 50 characters required.')

//     const fileError = validateFile(cvFile)
//     if (fileError) return toast.error(fileError)

//     setIsAnalyzing(true)

//     try {
//       // ── STEP 1: بعت الـ CV للباك وجيب النص منه ──
//       setAnalyzeStatus('Extracting CV text...')

//       const formPayload = new FormData()
//       formPayload.append("cv", cvFile)

//       const analyzeRes = await fetch(`${backendUrl}/api/ai/analyze-resume`, {
//         method: "POST",
//         body: formPayload
//       })

//       const analyzeData = await analyzeRes.json()

//       if (!analyzeRes.ok) {
//         throw new Error(analyzeData.error || "CV analysis failed")
//       }

//       const resumeText = analyzeData.resumeText

//       if (!resumeText) {
//         throw new Error("Could not extract text from CV")
//       }

//       // ── STEP 2: بعت النص + Job Description وجيب الـ score ──
//       setAnalyzeStatus('Matching with job description...')

//       const matchRes = await fetch(`${backendUrl}/api/ai/match-resume`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ resumeText, jobDescription })
//       })

//       const matchData = await matchRes.json()

//       if (!matchRes.ok) {
//         throw new Error(matchData.error || "Matching failed")
//       }

//       toast.success("ATS Analysis Complete ✅")

//       // ── STEP 3: روح لصفحة الـ feedback بكل الداتا ──
//       const feedbackPayload = {
//         // من الـ match
//         score: matchData.score,
//         missingSkills: matchData.missingSkills,
//         courses: matchData.courses,
//         // من الـ analyze
//         analysisText: analyzeData.analysisText,
//         analysis: analyzeData.analysis,           // { skills, strengths, weaknesses }
//         resumeText: analyzeData.resumeText,
//         extractionStatus: analyzeData.extractionStatus,
//         // من الـ form
//         companyTitle,
//         jobTitle,
//         jobDescription,
//         createdAt: new Date().toISOString()
//       }

//       sessionStorage.setItem('ats_feedback_payload', JSON.stringify(feedbackPayload))

//       navigate('/ats-feedback', { state: feedbackPayload })

//     } catch (error) {
//       toast.error(error.message)
//     } finally {
//       setIsAnalyzing(false)
//       setAnalyzeStatus('')
//     }
//   }

//   // ================= UI =================

//   return (
//     <div className='min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-100'>
//       <Navbar />

//       <main className='pt-28 pb-12 px-4'>
//         <div className='max-w-4xl mx-auto'>

//           <h1 className="text-3xl font-bold text-center mb-6">
//             ATS Resume Checker
//           </h1>

//           <form onSubmit={handleSubmit} className='space-y-6'>

//             <input
//               type='text'
//               name='companyTitle'
//               placeholder='Company Name'
//               value={formData.companyTitle}
//               onChange={handleTextChange}
//               className='w-full p-3 border rounded'
//             />

//             <input
//               type='text'
//               name='jobTitle'
//               placeholder='Job Title'
//               value={formData.jobTitle}
//               onChange={handleTextChange}
//               className='w-full p-3 border rounded'
//             />

//             <textarea
//               name='jobDescription'
//               placeholder='Job Description'
//               value={formData.jobDescription}
//               onChange={handleTextChange}
//               className='w-full p-3 border rounded'
//               rows={5}
//             />

//             {/* Upload */}
//             <div
//               className={`border-2 border-dashed p-6 text-center ${dragActive ? 'border-violet-500' : ''}`}
//               onDragEnter={handleDrag}
//               onDragLeave={handleDrag}
//               onDragOver={handleDrag}
//               onDrop={handleDrop}
//             >
//               <input
//                 type='file'
//                 accept='.pdf,.doc,.docx'
//                 onChange={handleFileChange}
//               />

//               <p className="mt-2">
//                 {formData.cvFile ? formData.cvFile.name : "Upload your CV"}
//               </p>
//             </div>

//             <button
//               type='submit'
//               disabled={isAnalyzing}
//               className='w-full bg-violet-600 text-white py-3 rounded disabled:opacity-60'
//             >
//               {isAnalyzing ? analyzeStatus || "Analyzing..." : "Analyze Resume"}
//             </button>

//           </form>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   )
// }

// export default ATSChecker
import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { AppContext } from '../context/AppContext'
import { useLocation } from "react-router-dom";


const MAX_FILE_SIZE_MB = 5

// مكوّن الأشكال العائمة في الخلفية (framer-motion)
const FloatingShape = ({ className, delay = 0 }) => (
  <motion.div
    className={`absolute rounded-full mix-blend-multiply filter blur-xl opacity-70 ${className}`}
    animate={{
      y: [0, 30, 0],
      x: [0, 15, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 10,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
)

const ATSChecker = () => {
    const location = useLocation();   // 👈 هنا
  const job = location.state?.job;  // 👈 هنا
  const navigate = useNavigate()
  const { backendUrl } = useContext(AppContext) // استخدام الـ URL من الـ Context بتاعك

  const [formData, setFormData] = useState({
    companyTitle: '',
    jobTitle: '',
    jobDescription: '',
    cvFile: null,
  })
  const stripHtml = (html) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};
  
  useEffect(() => {
  if (!location.state?.job) return;

  const jobData = location.state.job;

  setFormData({
    companyTitle: jobData.companyId?.name || "",
    jobTitle: jobData.title || "",
    jobDescription: stripHtml(jobData.description || ""),
    cvFile: null
  });

}, [location.state]);

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzeStatus, setAnalyzeStatus] = useState('') // لعرض حالة الـ API
  const [dragActive, setDragActive] = useState(false)

  // ================= HANDLERS =================

  const handleTextChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, cvFile: selectedFile }))
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      const error = validateFile(file)
      if (error) {
        toast.error(error)
      } else {
        setFormData((prev) => ({ ...prev, cvFile: file }))
        toast.success(`File selected: ${file.name}`)
      }
    }
  }

  const validateFile = (file) => {
    if (!file) return 'Please upload your CV.'
    const allowedExtensions = ['pdf', 'doc', 'docx']
    const extension = file.name.split('.').pop()?.toLowerCase()
    if (!allowedExtensions.includes(extension)) {
      return 'Only PDF, DOC, and DOCX files are allowed.'
    }
    const maxBytes = MAX_FILE_SIZE_MB * 1024 * 1024
    if (file.size > maxBytes) {
      return `File size must be less than ${MAX_FILE_SIZE_MB}MB.`
    }
    return ''
  }

  // ================= SUBMIT (Your API Logic) =================

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { companyTitle, jobTitle, jobDescription, cvFile } = formData

    if (!companyTitle.trim()) return toast.error('Company title is required.')
    if (!jobTitle.trim()) return toast.error('Job name is required.')
    if (!jobDescription.trim()) return toast.error('Job description is required.')
    // if (jobDescription.length < 50) return toast.error('Minimum 50 characters required.')

    const fileError = validateFile(cvFile)
    if (fileError) return toast.error(fileError)

    setIsAnalyzing(true)

    try {
      // Step 1: Extract Text
      setAnalyzeStatus('Extracting CV text...')
      const formPayload = new FormData()
      formPayload.append("cv", cvFile)

      const analyzeRes = await fetch(`${backendUrl}/api/ai/analyze-resume`, {
        method: "POST",
        body: formPayload
      })
      const analyzeData = await analyzeRes.json()
      if (!analyzeRes.ok) throw new Error(analyzeData.error || "CV analysis failed")

      // Step 2: Match
      setAnalyzeStatus('Matching with job description...')
      const matchRes = await fetch(`${backendUrl}/api/ai/match-resume`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: analyzeData.resumeText, jobDescription })
      })
      const matchData = await matchRes.json()
      if (!matchRes.ok) throw new Error(matchData.error || "Matching failed")

      toast.success("ATS Analysis Complete ✅")
// 🟢 APPLY TO JOB

      const feedbackPayload = {
        score: matchData.score,
        missingSkills: matchData.missingSkills,
        courses: matchData.courses,
        analysisText: analyzeData.analysisText,
        analysis: analyzeData.analysis,
        resumeText: analyzeData.resumeText,
        companyTitle,
        jobTitle,
        jobDescription,
        createdAt: new Date().toISOString()
      }

      sessionStorage.setItem('ats_feedback_payload', JSON.stringify(feedbackPayload))
navigate('/ats-feedback', { 
  state: { 
    ...feedbackPayload,
    jobId: job?._id,
    companyId: job?.companyId?._id   // 🔥 أهم سطر
  } 
})
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsAnalyzing(false)
      setAnalyzeStatus('')
    }
  }

  return (
    <div className='min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-100 font-sans'>
      {/* Animated background shapes */}
      <FloatingShape className="top-20 left-10 w-96 h-96 bg-violet-300/20" delay={0} />
      <FloatingShape className="top-40 right-10 w-80 h-80 bg-violet-300/20" delay={2} />
      <FloatingShape className="bottom-20 left-1/3 w-72 h-72 bg-amber-300/20" delay={4} />
      <FloatingShape className="bottom-40 right-1/4 w-64 h-64 bg-violet-300/20" delay={6} />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />

      <Navbar />

      <main className='relative pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-200/50 text-violet-700 text-sm font-medium mb-4">
            🎯 AI-Powered ATS Analysis
          </span>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
            Optimize Your Resume for ATS
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Get instant AI feedback on your resume's compatibility with any job description
          </p>
        </motion.div>

        {/* Two-Columns Layout: Info Card (Left) vs Form Card (Right) */}
        <div className='grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10'>
          
          {/* Left Column - Info Card (facc3 style) */}
          <motion.section
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className='relative group'
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-purple-400 rounded-[40px] blur-2xl opacity-20 group-hover:opacity-35 transition-opacity" />
            <div className='relative rounded-[40px] bg-gradient-to-br from-slate-700 via-violet-700 to-purple-700 text-white p-8 sm:p-10 shadow-2xl overflow-hidden'>
              <div className="absolute inset-0 opacity-10">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat'
                  }}
                />
              </div>

              <div className='relative z-10'>
                <div className="flex items-center gap-3 mb-6">
                  <span className='inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-violet-100 backdrop-blur-sm'>
                    ATS Intelligence
                  </span>
                  <span className='inline-flex items-center rounded-full bg-violet-500/20 px-3 py-1 text-xs text-violet-200 border border-violet-500/30'>
                    v2.0
                  </span>
                </div>

                <h2 className='text-3xl sm:text-4xl font-bold leading-tight'>
                  Turn Your Resume Into A
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400">
                    High-Match Candidate Profile
                  </span>
                </h2>

                <p className='mt-6 text-violet-100/80 leading-relaxed mb-8'>
                  Submit company, role, job description, and your CV. The analyzer scores ATS compatibility, finds missing keywords, and gives targeted rewrite suggestions.
                  This analysis is thorough and tailored for success.
                </p>

                {/* الـ Badges (image_5facc3) */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-3">
                    <span className="text-3xl">🤖</span>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-violet-200">Model</p>
                      <p className="font-bold text-sm">Gemini 3 Flash</p>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-3">
                    <span className="text-3xl">📊</span>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-violet-200">Report</p>
                      <p className="font-bold text-sm">Score + Gaps</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Right Column - Form Card */}
          <motion.section
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className='relative'
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-400/20 to-purple-400/20 rounded-[40px] blur-2xl" />
            <div className='relative rounded-[40px] border border-white/50 bg-white/90 backdrop-blur-xl shadow-2xl p-8 sm:p-10'>
              <div className='flex flex-wrap items-center justify-between gap-4 mb-8'>
                <div>
                  <h2 className='text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent'>
                    ATS Checker Form
                  </h2>
                  <p className='mt-1 text-sm text-slate-600'>Provide complete role context for precise evaluation</p>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='relative flex h-3 w-3'>
                    <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75'></span>
                    <span className='relative inline-flex rounded-full h-3 w-3 bg-violet-500'></span>
                  </span>
                  <span className='text-xs font-medium text-slate-600'>Secure Upload</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Company Title */}
                <div className="group space-y-2">
                  <label htmlFor='companyTitle' className='text-xs font-semibold uppercase tracking-[0.1em] text-slate-600 group-focus-within:text-violet-600 transition-colors'>Company Title</label>
                  <input name='companyTitle' type='text' value={formData.companyTitle} onChange={handleTextChange} placeholder='e.g., Google, Microsoft' className='w-full rounded-xl border-2 border-slate-200 bg-white/50 p-4 outline-none focus:border-violet-500 transition-all text-slate-900' required />
                </div>

                {/* Job Title */}
                <div className="group space-y-2">
                  <label htmlFor='jobTitle' className='text-xs font-semibold uppercase tracking-[0.1em] text-slate-600 group-focus-within:text-violet-600 transition-colors'>Job Title</label>
                  <input name='jobTitle' type='text' value={formData.jobTitle} onChange={handleTextChange} placeholder='e.g., Frontend Developer' className='w-full rounded-xl border-2 border-slate-200 bg-white/50 p-4 outline-none focus:border-violet-500 transition-all text-slate-900' required />
                </div>

                {/* Job Description */}
                <div className="group space-y-2">
                  <label htmlFor='jobDescription' className='text-xs font-semibold uppercase tracking-[0.1em] text-slate-600 group-focus-within:text-violet-600 transition-colors'>Job Description</label>
                  <textarea name='jobDescription' rows='6' value={formData.jobDescription} onChange={handleTextChange} placeholder='Paste the full job description here...' className='w-full rounded-xl border-2 border-slate-200 bg-white/50 p-4 outline-none focus:border-violet-500 transition-all text-slate-900 resize-y' required />
                  {/* تنبيه عدد الحروف (image_5facc3) */}
                  {/* <p className="text-[11px] text-orange-500 mt-1 flex items-center gap-1 font-medium">
                    ⚠️ Minimum 50 characters recommended
                  </p> */}
                </div>

                {/* File Upload Area */}
                <div className="group space-y-2">
                  <label className='text-xs font-semibold uppercase tracking-[0.1em] text-slate-600'>Upload Your CV</label>
                  <div className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-all ${dragActive ? 'border-violet-500 bg-violet-50/50' : 'border-slate-200 bg-slate-50/50 hover:border-violet-300'}`} onDragOver={handleDrag} onDrop={handleDrop}>
                    <input type='file' accept='.pdf,.doc,.docx' onChange={handleFileChange} className='absolute inset-0 w-full h-full opacity-0 cursor-pointer' />
                    <span className="text-4xl block mb-2">📎</span>
                    <p className="font-medium text-slate-700">{formData.cvFile ? formData.cvFile.name : 'Drag & drop or click to upload'}</p>
                    
                    {/* Tags الملفات (image_5facc3) */}
                    <div className="flex justify-center gap-2 mt-4 flex-wrap">
                      {['PDF', 'DOC', 'DOCX'].map(ext => (
                        <span key={ext} className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] text-slate-400 font-bold">📄 {ext}</span>
                      ))}
                      <span className="px-2 py-1 bg-violet-100 text-violet-600 rounded text-[10px] font-bold">⚡ Max 5MB</span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type='submit'
                  disabled={isAnalyzing}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className='relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white font-bold px-8 py-4 transition-all disabled:opacity-70 shadow-lg'
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                        <span>{analyzeStatus || "Analyzing..."}</span>
                      </>
                    ) : (
                      <>✨ Generate ATS Feedback →</>
                    )}
                  </span>
                </motion.button>

                {/* الـ Security notice (image_5facc3) */}
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3 mt-4">
                  <span className="text-xl">🔒</span>
                  <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                    After clicking Generate, you'll be redirected to a detailed feedback page with your complete ATS analysis. This ensures a safe process.
                  </p>
                </div>
              </form>
            </div>
          </motion.section>
        </div>

        {/* الـ Trust Badges في الفوتر (image_5facc3) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 pt-10 border-t border-slate-200 flex flex-wrap justify-center gap-x-12 gap-y-4 text-slate-500"
        >
          <div className="flex items-center gap-2 text-xs"><span>🔒</span> End-to-end encrypted</div>
          <div className="flex items-center gap-2 text-xs"><span>⚡</span> Real-time analysis</div>
          <div className="flex items-center gap-2 font-bold text-xs"><span>🤖</span> Powered by Gemini 3 Flash</div>
          <div className="flex items-center gap-2 text-xs"><span>🗑️</span> Auto-delete after analysis</div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}

export default ATSChecker