import { useState, useCallback, useRef } from 'react'
import confetti from 'canvas-confetti'
import { toast } from 'sonner'
import {
  ParsedJob,
  CandidateScoreResult,
  ScoredCandidateItem,
  CandidateErrorItem,
  ScreeningProgress,
} from '@/lib/types'
import { parseJobDescription, scoreResume, ApiError } from '@/lib/api'

interface UseScreeningReturn {
  jobText: string
  setJobText: (text: string) => void
  jobFile: File | null
  setJobFile: (file: File | null) => void
  resumeFiles: File[]
  setResumeFiles: React.Dispatch<React.SetStateAction<File[]>>
  parsedJob: ParsedJob | null
  candidates: ScoredCandidateItem[]
  errors: CandidateErrorItem[]
  progress: ScreeningProgress
  isScreening: boolean
  startScreening: () => Promise<void>
  cancelScreening: () => void
  dismissError: (id: string) => void
  clearAll: () => void
  loadDemoData: () => void
}

export function useScreening(): UseScreeningReturn {
  const [jobText, setJobText] = useState<string>('')
  const [jobFile, setJobFile] = useState<File | null>(null)
  const [resumeFiles, setResumeFiles] = useState<File[]>([])
  const [parsedJob, setParsedJob] = useState<ParsedJob | null>(null)
  const [candidates, setCandidates] = useState<ScoredCandidateItem[]>([])
  const [errors, setErrors] = useState<CandidateErrorItem[]>([])
  const [isScreening, setIsScreening] = useState<boolean>(false)

  const [progress, setProgress] = useState<ScreeningProgress>({
    total: 0,
    current: 0,
    isScoringJob: false,
    isScoringResumes: false,
    isComplete: false,
  })

  const cancelRef = useRef<boolean>(false)

  const dismissError = useCallback((id: string) => {
    setErrors((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setCandidates([])
    setErrors([])
    setProgress({
      total: 0,
      current: 0,
      isScoringJob: false,
      isScoringResumes: false,
      isComplete: false,
    })
  }, [])

  const cancelScreening = useCallback(() => {
    cancelRef.current = true
    setIsScreening(false)
    setProgress((p) => ({ ...p, isScoringJob: false, isScoringResumes: false }))
    toast.info('Screening canceled.')
  }, [])

  const startScreening = useCallback(async () => {
    // 1. Validation
    const trimmedText = jobText.trim()
    if (!jobFile && trimmedText.length < 30) {
      toast.error('Please enter a job description of at least 30 characters, or upload a job document.')
      return
    }

    if (resumeFiles.length === 0) {
      toast.error('Please drop at least one candidate resume to score.')
      return
    }

    cancelRef.current = false
    setIsScreening(true)
    setCandidates([])
    setErrors([])
    setProgress({
      total: resumeFiles.length,
      current: 0,
      isScoringJob: true,
      isScoringResumes: false,
      isComplete: false,
    })

    let currentParsedJob: ParsedJob | null = null

    // 2. Call /api/job once
    try {
      toast.loading('Analyzing job requirements...', { id: 'job-parse' })
      currentParsedJob = await parseJobDescription({
        text: trimmedText.length >= 30 ? trimmedText : undefined,
        file: jobFile || undefined,
      })
      setParsedJob(currentParsedJob)
      toast.success(
        `Job parsed: ${currentParsedJob.role || 'Role requirements'}`,
        { id: 'job-parse' }
      )
    } catch (err: any) {
      toast.error(err.message || 'Failed to parse job description', {
        id: 'job-parse',
      })
      setIsScreening(false)
      setProgress((p) => ({ ...p, isScoringJob: false }))
      return
    }

    if (cancelRef.current) return

    // 3. Score resumes one by one
    setProgress({
      total: resumeFiles.length,
      current: 0,
      isScoringJob: false,
      isScoringResumes: true,
      isComplete: false,
    })

    const total = resumeFiles.length
    let successfulCount = 0

    for (let i = 0; i < total; i++) {
      if (cancelRef.current) break

      const currentFile = resumeFiles[i]
      const stepNumber = i + 1

      setProgress({
        total,
        current: stepNumber,
        currentFilename: currentFile.name,
        isScoringJob: false,
        isScoringResumes: true,
        isComplete: false,
      })

      try {
        const scoreResult: CandidateScoreResult = await scoreResume({
          job: currentParsedJob,
          file: currentFile,
        })

        if (cancelRef.current) break

        const newItem: ScoredCandidateItem = {
          ...scoreResult,
          id: `cand-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          scoredAt: Date.now(),
        }

        // Add to candidates and sort highest score first immediately
        setCandidates((prev) => {
          const updated = [...prev, newItem]
          return updated.sort((a, b) => b.score - a.score)
        })

        successfulCount++
      } catch (err: any) {
        // Failed resume must not stop the batch!
        const errorMessage =
          err instanceof ApiError ? err.message : err.toString()

        setErrors((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}-${i}`,
            filename: currentFile.name,
            error: errorMessage,
            timestamp: Date.now(),
          },
        ])

        toast.error(`Error scoring "${currentFile.name}"`, {
          description: errorMessage,
          duration: 4000,
        })
      }
    }

    setIsScreening(false)
    setProgress((p) => ({
      ...p,
      isScoringResumes: false,
      isComplete: true,
      currentFilename: undefined,
    }))

    if (successfulCount > 0) {
      toast.success(
        `Shortlisting complete! ${successfulCount} candidate${
          successfulCount > 1 ? 's' : ''
        } ranked.`
      )

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#d6336c', '#f28fb0', '#ffe4ed', '#2f9e72'],
        })
      } catch {
        // ignore if confetti fails
      }
    } else {
      toast.warning('No candidate resumes could be scored successfully. Please review the errors above.')
    }
  }, [jobText, jobFile, resumeFiles])

  // Helper to load sample mock data for instant previewing
  const loadDemoData = useCallback(() => {
    setCandidates([
      {
        id: 'demo-1',
        filename: 'Abhay_Singh_Resume.pdf',
        name: 'Abhay Singh',
        email: 'abhay.dev@example.com',
        phone: '+91 98765 43210',
        experience_years: 4,
        score: 93,
        matching_skills: [
          'PHP',
          'Laravel',
          'React.js',
          'Node.js',
          'Express',
          'MongoDB',
          'MySQL',
          'AWS (S3/EC2)',
          'REST APIs',
        ],
        missing_skills: ['Three.js (Advanced 3D)'],
        experience_met: true,
        verdict:
          'Outstanding full-stack profile. Directly meets required 2–5 years experience with proven PHP and MERN stack production experience. Strong AWS deployment background.',
        scoredAt: Date.now(),
      },
      {
        id: 'demo-2',
        filename: 'Priya_Sharma_Resume.pdf',
        name: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        phone: '+91 98111 22334',
        experience_years: 3.5,
        score: 84,
        matching_skills: [
          'React.js',
          'JavaScript (ES6+)',
          'Node.js',
          'MongoDB',
          'REST APIs',
          'HTML5 / CSS3',
          'Git',
        ],
        missing_skills: ['PHP / Laravel', 'Three.js'],
        experience_met: true,
        verdict:
          'Strong frontend and MERN developer with responsive UI expertise. Solid background in APIs and state management, but lacks PHP backend experience.',
        scoredAt: Date.now() - 1000,
      },
      {
        id: 'demo-3',
        filename: 'Rohan_Mehta_Resume.docx',
        name: 'Rohan Mehta',
        email: 'rohan.mehta@example.com',
        phone: '+91 97234 56789',
        experience_years: 1.5,
        score: 62,
        matching_skills: ['React.js', 'Node.js', 'MongoDB', 'CSS3'],
        missing_skills: ['PHP', 'MySQL', 'AWS Cloud', 'Three.js'],
        experience_met: false,
        verdict:
          'Junior developer with 1.5 years experience, falling short of the 2-year minimum requirement. Promising foundational skills in React, but needs senior mentorship.',
        scoredAt: Date.now() - 2000,
      },
    ])
    toast.success('Loaded 3 sample shortlisted candidates.')
  }, [])

  return {
    jobText,
    setJobText,
    jobFile,
    setJobFile,
    resumeFiles,
    setResumeFiles,
    parsedJob,
    candidates,
    errors,
    progress,
    isScreening,
    startScreening,
    cancelScreening,
    dismissError,
    clearAll,
    loadDemoData,
  }
}
