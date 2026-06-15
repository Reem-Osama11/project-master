import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useContext } from 'react'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'
import { useUser } from "@clerk/clerk-react"

const PLATFORM_CONFIG = {
  Coursera: {
    emoji: '🎓',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    url: (q) => `https://www.coursera.org/search?query=${encodeURIComponent(q)}`,
  },
  Udemy: {
    emoji: '📚',
    color: 'bg-violet-100 text-violet-800 border-violet-200',
    url: (q) => `https://www.udemy.com/courses/search/?q=${encodeURIComponent(q)}`,
  },
  YouTube: {
    emoji: '▶️',
    color: 'bg-rose-100 text-rose-800 border-rose-200',
    url: (q) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q + ' tutorial')}`,
  },
  'LinkedIn Learning': {
    emoji: '💼',
    color: 'bg-sky-100 text-sky-800 border-sky-200',
    url: (q) => `https://www.linkedin.com/learning/search?keywords=${encodeURIComponent(q)}`,
  },
  edX: {
    emoji: '🏫',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    url: (q) => `https://www.edx.org/search?q=${encodeURIComponent(q)}`,
  },
  freeCodeCamp: {
    emoji: '💻',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    url: (q) => `https://www.freecodecamp.org/news/search/?query=${encodeURIComponent(q)}`,
  },
}

const LEVEL_BADGE = {
  Beginner: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Intermediate: 'bg-amber-100 text-amber-700 border-amber-200',
  Advanced: 'bg-rose-100 text-rose-700 border-rose-200',
}

const SECTION_CARD_STYLES = {
  'ATS Match Score (0-100)': {
    border: 'border-sky-200',
    bg: 'from-sky-50 to-white',
    badge: 'bg-sky-100 text-sky-800 border-sky-200',
    dot: 'bg-sky-500',
    icon: '📊',
    gradient: 'from-sky-400 to-blue-500',
  },
  'Missing Keywords': {
    border: 'border-rose-200',
    bg: 'from-rose-50 to-white',
    badge: 'bg-rose-100 text-rose-800 border-rose-200',
    dot: 'bg-rose-500',
    icon: '🔑',
    gradient: 'from-rose-400 to-pink-500',
  },
  'Strong Matches': {
    border: 'border-emerald-200',
    bg: 'from-emerald-50 to-white',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-500',
    icon: '✅',
    gradient: 'from-emerald-400 to-teal-500',
  },
  'Resume Issues': {
    border: 'border-amber-200',
    bg: 'from-amber-50 to-white',
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    dot: 'bg-amber-500',
    icon: '⚠️',
    gradient: 'from-amber-400 to-orange-500',
  },
  'Rewrite Suggestions': {
    border: 'border-violet-200',
    bg: 'from-violet-50 to-white',
    badge: 'bg-violet-100 text-violet-800 border-violet-200',
    dot: 'bg-violet-500',
    icon: '✍️',
    gradient: 'from-violet-400 to-purple-500',
  },
  '30-Second Summary': {
    border: 'border-cyan-200',
    bg: 'from-cyan-50 to-white',
    badge: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    dot: 'bg-cyan-500',
    icon: '📝',
    gradient: 'from-cyan-400 to-sky-500',
  },
}

const ScoreIndicator = ({ score }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600'
    if (score >= 60) return 'text-amber-600'
    return 'text-rose-600'
  }

  const getScoreMessage = (score) => {
    if (score === null) return 'Score not detected'
    if (score >= 80) return 'Excellent match! Your resume is well-optimized.'
    if (score >= 60) return 'Good match with room for improvement.'
    if (score >= 40) return 'Needs significant optimization.'
    return 'Critical issues detected. Major improvements needed.'
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-200/30 to-purple-200/30 blur-2xl animate-pulse" />
      <div className="relative w-48 h-48 mx-auto">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8" />
          <circle
            cx="50" cy="50" r="45" fill="none"
            stroke="url(#scoreGradient)" strokeWidth="8" strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - (score || 0) / 100)}`}
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            {score ?? '--'}
          </span>
          <span className="text-sm text-slate-500">out of 100</span>
        </div>
      </div>
      <p className={`mt-4 text-center font-medium ${getScoreColor(score)}`}>
        {getScoreMessage(score)}
      </p>
    </div>
  )
}

const FloatingShape = ({ className, delay = 0 }) => (
  <motion.div
    className={`absolute rounded-full mix-blend-multiply filter blur-xl opacity-70 ${className}`}
    animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
    transition={{ duration: 8, delay, repeat: Infinity, ease: "easeInOut" }}
  />
)

const ATSFeedback = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { backendUrl } = useContext(AppContext)
  const { user } = useUser()

  const [payload, setPayload] = useState(location.state || null)
  const [expandedSection, setExpandedSection] = useState(null)
  const [applied, setApplied] = useState(false)

  useEffect(() => {
    if (payload) return
    const saved = sessionStorage.getItem('ats_feedback_payload')
    if (!saved) return
    try {
      setPayload(JSON.parse(saved))
    } catch {
      setPayload(null)
    }
  }, [payload])

  const score = payload?.score ?? null

  const sections = useMemo(() => {
    if (!payload) return []
    return [
      {
        key: 'score',
        heading: 'ATS Match Score (0-100)',
        content: payload.score ? [`${payload.score}/100`] : []
      },
      {
        key: 'missing',
        heading: 'Missing Keywords',
        content: payload.missingSkills || []
      },
      {
        key: 'strong',
        heading: 'Strong Matches',
        content: payload.analysis?.skills || []
      },
      {
        key: 'issues',
        heading: 'Resume Issues',
        content: payload.analysis?.weaknesses?.length
          ? payload.analysis.weaknesses
          : ['No major issues detected']
      },
      {
        key: 'suggestions',
        heading: 'Rewrite Suggestions',
        content: payload.analysis?.strengths || []
      },
      {
        key: 'summary',
        heading: '30-Second Summary',
        content: payload.analysis?.skills?.length
          ? [`Candidate has experience with ${payload.analysis.skills.slice(0, 5).join(', ')} and shows strong potential for the role.`]
          : []
      }
    ]
  }, [payload])

  const courses = useMemo(() => {
    if (payload?.courses?.length) return payload.courses
    if (!payload?.missingSkills?.length) return []
    const generated = []
    payload.missingSkills.forEach((skill) => {
      generated.push(
        { title: `${skill} Complete Course`, skill, platform: 'Udemy', level: 'Beginner', duration: '10+ hours' },
        { title: `${skill} Crash Course`, skill, platform: 'YouTube', level: 'Beginner', duration: '2-4 hours' }
      )
    })
    return generated
  }, [payload])

  const generatedAt = useMemo(() => {
    if (!payload?.createdAt) return 'Unknown time'
    try {
      return new Date(payload.createdAt).toLocaleString()
    } catch {
      return payload.createdAt
    }
  }, [payload])

  const handleApply = async () => {
    try {
      const payloadData = {
        jobId: payload?.jobId,
        companyId: payload?.companyId,
        userId: user?.id,
        userName: `${user?.firstName || ""} ${user?.lastName || ""}`,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        userImage: user?.imageUrl,
        resume: payload?.resumeText || "ATS Resume",
        atsScore: payload?.score,
        missingSkills: payload?.missingSkills || [],
        aiAnalysis: payload?.analysis || {}
      }
      const res = await fetch(`${backendUrl}/api/applications/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadData)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      toast.success("Applied Successfully ✅")
      setApplied(true)
      navigate(`/apply-job/${payload?.jobId}`, { state: { applied: true } })
    } catch (err) {
      toast.error("Apply failed ❌")
    }
  }

  const extractionTone = useMemo(() => {
    if (payload?.extractionStatus === 'success') {
      return { wrapper: 'border-violet-200 bg-violet-50', badge: 'bg-violet-100 text-violet-800 border-violet-200', icon: '✅' }
    }
    if (payload?.extractionStatus === 'empty') {
      return { wrapper: 'border-amber-200 bg-amber-50', badge: 'bg-amber-100 text-amber-800 border-amber-200', icon: '⚠️' }
    }
    return { wrapper: 'border-slate-200 bg-slate-50', badge: 'bg-slate-100 text-slate-700 border-slate-200', icon: 'ℹ️' }
  }, [payload])

  return (
    <div className='min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-cyan-50'>
      <FloatingShape className="top-20 left-10 w-72 h-72 bg-violet-300/20" delay={0} />
      <FloatingShape className="top-40 right-10 w-96 h-96 bg-purple-300/20" delay={2} />
      <FloatingShape className="bottom-20 left-1/3 w-80 h-80 bg-violet-300/20" delay={4} />

      <Navbar />

      <main className='relative pt-28 pb-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <AnimatePresence mode="wait">
            {!payload ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className='rounded-[40px] border border-slate-200 bg-white/80 backdrop-blur-xl shadow-2xl p-10 text-center'
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 p-1">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <span className="text-4xl">📄</span>
                  </div>
                </div>
                <h1 className='text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent'>
                  No Feedback Found Yet
                </h1>
                <p className='mt-3 text-slate-600 max-w-xl mx-auto text-lg'>
                  Submit your details on ATS Checker first, then your AI analysis will appear here.
                </p>
                <Link to='/ats-checker' className='inline-block mt-8 group relative'>
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl blur opacity-60 group-hover:opacity-100 transition-opacity" />
                  <div className='relative bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold px-8 py-4 rounded-xl transition-all transform group-hover:scale-105'>
                    Go To ATS Checker
                  </div>
                </Link>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">

                {/* Header Section */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                  className='grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6'
                >
                  {/* Hero Card */}
                  <div className='rounded-[40px] bg-gradient-to-br from-slate-700 via-violet-700 to-purple-700 text-white p-8 shadow-2xl relative overflow-hidden'>
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundRepeat: 'repeat'
                      }} />
                    </div>
                    <div className='relative'>
                      <div className='flex flex-wrap items-center gap-3'>
                        <span className='inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-violet-100 backdrop-blur-sm'>
                          AI Resume Analyzer
                        </span>
                        <span className='inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs text-violet-100 backdrop-blur-sm'>
                          Generated: {generatedAt}
                        </span>
                      </div>
                      <h1 className='mt-6 text-3xl sm:text-5xl font-bold leading-tight'>
                        ATS Feedback
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-purple-300">Report</span>
                      </h1>
                      <p className='mt-4 text-sm sm:text-base text-violet-100/90 max-w-2xl leading-relaxed'>
                        Structured feedback generated from your CV and role requirements to improve ATS performance.
                      </p>
                      <div className='mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <div className='rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-5 hover:bg-white/15 transition-colors'>
                          <p className='text-xs text-violet-200 uppercase tracking-widest mb-1'>Company</p>
                          <p className='text-lg font-semibold break-words'>{payload.companyTitle}</p>
                        </div>
                        <div className='rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-5 hover:bg-white/15 transition-colors'>
                          <p className='text-xs text-violet-200 uppercase tracking-widest mb-1'>Job Name</p>
                          <p className='text-lg font-semibold break-words'>{payload.jobTitle}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Score Card */}
                  <div className='rounded-[40px] border border-violet-100 bg-white/90 backdrop-blur-xl p-8 shadow-xl hover:shadow-2xl transition-shadow'>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className='text-xs uppercase tracking-widest text-slate-500'>Overall Performance</p>
                        <p className='text-xl font-bold text-slate-800'>ATS Match Score</p>
                      </div>
                      <span className="text-4xl opacity-10">🎯</span>
                    </div>
                    <ScoreIndicator score={score} />
                    <div className='mt-6 flex flex-col gap-3'>
                      <Link to='/ats-checker' className='block group relative'>
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl blur opacity-60 group-hover:opacity-100 transition-opacity" />
                        <div className='relative bg-gradient-to-r from-violet-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold text-center hover:from-violet-700 hover:to-purple-700 transition-all transform group-hover:scale-[1.02]'>
                          Analyze Another CV
                        </div>
                      </Link>
                      {payload?.jobId && (
                        <button
                          onClick={handleApply}
                          disabled={applied}
                          className='w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3.5 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-[1.02] disabled:opacity-50'
                        >
                          {applied ? 'Applied ✅' : 'Apply for this Job 🚀'}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Feedback Sections */}
                <motion.section
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                  className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'
                >
                  {sections.map((section, index) => {
                    const cardStyle = SECTION_CARD_STYLES[section.heading] || {
                      border: 'border-slate-200', bg: 'from-slate-50 to-white',
                      badge: 'bg-slate-100 text-slate-800 border-slate-200',
                      dot: 'bg-slate-500', icon: '📌', gradient: 'from-slate-400 to-slate-500',
                    }
                    const isExpanded = expandedSection === section.key
                    const visibleItems = isExpanded ? section.content : section.content.slice(0, 3)

                    return (
                      <motion.article
                        key={section.key}
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }} whileHover={{ y: -5 }}
                        className={`group rounded-2xl border bg-gradient-to-b p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer ${cardStyle.border} ${cardStyle.bg}`}
                        onClick={() => setExpandedSection(isExpanded ? null : section.key)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cardStyle.gradient} flex items-center justify-center text-white text-lg`}>
                              {cardStyle.icon}
                            </div>
                            <div>
                              <span className={`inline-block rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${cardStyle.badge}`}>
                                Section
                              </span>
                              <h3 className='mt-2 text-base font-bold text-slate-900'>{section.heading}</h3>
                            </div>
                          </div>
                          <span className="text-slate-400 group-hover:text-slate-600 transition-colors">
                            {isExpanded ? '▼' : '▶'}
                          </span>
                        </div>

                        {section.content.length === 0 ? (
                          <p className='mt-3 text-sm text-slate-500 italic'>No specific feedback found.</p>
                        ) : (
                          <ul className='mt-3 space-y-2 text-sm text-slate-700'>
                            {visibleItems.map((item, idx) => (
                              <li key={idx} className='flex items-start gap-2'>
                                <span className={`mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0 ${cardStyle.dot}`} />
                                <span className="flex-1">{item}</span>
                              </li>
                            ))}
                            {!isExpanded && section.content.length > 3 && (
                              <li className="text-xs text-slate-500 mt-2">
                                +{section.content.length - 3} more items...
                              </li>
                            )}
                          </ul>
                        )}
                      </motion.article>
                    )
                  })}
                </motion.section>

                {/* Courses */}
                <motion.section
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.38 }}
                  className='rounded-[32px] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 shadow-xl'
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl shadow-lg">
                      🎓
                    </div>
                    <div>
                      <h2 className='text-xl font-bold text-slate-900'>Recommended Learning Resources</h2>
                      <p className='text-sm text-slate-500'>Courses tailored to bridge your skill gaps for this role</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {courses.map((course, idx) => {
                      const platform = PLATFORM_CONFIG[course.platform] || PLATFORM_CONFIG['YouTube']
                      const levelStyle = LEVEL_BADGE[course.level] || 'bg-slate-100 text-slate-700 border-slate-200'
                      const courseUrl = platform.url(course.skill || course.title)
                      return (
                        <motion.a
                          key={idx} href={courseUrl} target="_blank" rel="noopener noreferrer"
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.07 }} whileHover={{ y: -4 }}
                          className="group flex flex-col rounded-2xl border border-slate-100 bg-white p-4 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all no-underline"
                        >
                          <span className={`self-start inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${platform.color}`}>
                            <span>{platform.emoji}</span>
                            {course.platform}
                          </span>
                          <h3 className="mt-3 text-sm font-bold text-slate-900 leading-snug group-hover:text-indigo-700 transition-colors flex-1">
                            {course.title}
                          </h3>
                          <p className="mt-1.5 text-xs text-slate-500 italic line-clamp-1">{course.skill}</p>
                          <div className="mt-3 flex items-center gap-2 flex-wrap">
                            <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold ${levelStyle}`}>
                              {course.level}
                            </span>
                            {course.duration && <span className="text-[10px] text-slate-400">⏱ {course.duration}</span>}
                          </div>
                          <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
                            View course <span className="group-hover:translate-x-0.5 transition-transform inline-block">→</span>
                          </div>
                        </motion.a>
                      )
                    })}
                  </div>
                </motion.section>

                {/* Resume Content */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
                  className={`rounded-[32px] border p-6 shadow-xl backdrop-blur-xl ${extractionTone.wrapper}`}
                >
                  <div className='flex items-center gap-3 mb-4'>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white text-xl">
                      {extractionTone.icon}
                    </div>
                    <div>
                      <h2 className='text-xl font-bold text-slate-900'>Resume Content</h2>
                      <span className={`inline-block mt-1 rounded-full border px-3 py-1 text-xs font-semibold ${extractionTone.badge}`}>
{payload.resumeExtractedText || payload.resumeText ? 'success' : 'empty'}                      </span>
                    </div>
                  </div>
                  <div className='relative'>
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-violet-400 to-purple-500 rounded-full" />
                    <pre className='pl-4 text-xs sm:text-sm whitespace-pre-wrap break-words text-slate-800 max-h-60 overflow-y-auto'>
                      {payload.resumeExtractedText || payload.resumeText || 'No extracted resume text found.'}
                    </pre>
                  </div>
                </motion.div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  )
}

export default ATSFeedback