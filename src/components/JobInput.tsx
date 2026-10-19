import { useState, useRef, ChangeEvent } from 'react'
import {
  FileText,
  UploadCloud,
  FileCheck,
  X,
  Sparkles,
  AlertCircle,
} from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs'
import { Button } from './ui/button'
import { formatFileSize } from '@/lib/utils'

interface JobInputProps {
  jobText: string
  setJobText: (text: string) => void
  jobFile: File | null
  setJobFile: (file: File | null) => void
  disabled?: boolean
}

// Sample job provided in the prompt for instant test-driving
const SAMPLE_JOB_TEXT = `Position: Full-Stack Developer – PHP & MERN
Experience: 2–5 Years
Location: Dehradun / Work From Office
Employment Type: Full-Time

Position Overview:
We are looking for a Full-Stack Developer with strong hands-on experience in PHP and the MERN stack to join our development team. The primary focus of this role is full-stack web application development using PHP, Node.js, React.js, and modern JavaScript technologies. Experience in 3D web technologies such as Three.js will be an added advantage.

Required Skills:
- Strong experience with PHP & frameworks (Laravel, CodeIgniter, etc.)
- Strong experience with Node.js and Express.js
- React.js, JavaScript (ES6+), HTML5, CSS3
- Databases: MySQL and MongoDB
- REST APIs & third-party integrations
- Basic to good working knowledge of AWS (S3, EC2) and Git
- Three.js / WebGL is an added advantage.`

export function JobInput({
  jobText,
  setJobText,
  jobFile,
  setJobFile,
  disabled = false,
}: JobInputProps) {
  const [activeTab, setActiveTab] = useState<'paste' | 'upload'>(
    jobFile ? 'upload' : 'paste'
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const validTypes = ['.pdf', '.docx', '.txt']
      const hasValidExt = validTypes.some((ext) =>
        file.name.toLowerCase().endsWith(ext)
      )

      if (!hasValidExt) {
        alert('Please select a PDF, DOCX, or TXT file.')
        return
      }

      setJobFile(file)
      setActiveTab('upload')
    }
  }

  const handleRemoveFile = () => {
    setJobFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleLoadSample = () => {
    setJobText(SAMPLE_JOB_TEXT)
    setJobFile(null)
    setActiveTab('paste')
  }

  const isTextValid = jobText.trim().length >= 30
  const isReady = isTextValid || jobFile !== null

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-petal text-berry flex items-center justify-center font-bold text-xs">
            1
          </div>
          <h3 className="font-heading font-bold text-base text-plum">
            Job Description
          </h3>
        </div>

        {/* Load sample button */}
        <button
          type="button"
          onClick={handleLoadSample}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-berry hover:text-berry-dark hover:underline focus-ring rounded-lg px-2 py-1"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Load sample job
        </button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as 'paste' | 'upload')}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="paste" disabled={disabled}>
            <FileText className="w-4 h-4 mr-2" />
            Paste text
          </TabsTrigger>
          <TabsTrigger value="upload" disabled={disabled}>
            <UploadCloud className="w-4 h-4 mr-2" />
            Upload file
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Paste Text */}
        <TabsContent value="paste" className="space-y-2">
          <div className="relative">
            <textarea
              id="job-description-textarea"
              aria-label="Job description text"
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              disabled={disabled}
              placeholder="Paste the job description here (role title, required skills, experience level, responsibilities)..."
              rows={6}
              className="w-full rounded-2xl border border-line bg-white/90 p-3.5 text-sm text-plum placeholder:text-muted/60 focus-ring resize-y min-h-[140px] max-h-[300px] shadow-inner"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-muted">
            <div className="flex items-center gap-1">
              {!isTextValid && jobText.length > 0 && (
                <span className="text-berry inline-flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Minimum 30 characters required ({jobText.trim().length}/30)
                </span>
              )}
              {isTextValid && (
                <span className="text-success inline-flex items-center gap-1 font-medium">
                  <FileCheck className="w-3.5 h-3.5" />
                  Ready to parse ({jobText.trim().length} chars)
                </span>
              )}
              {jobText.length === 0 && (
                <span>Minimum 30 characters required</span>
              )}
            </div>

            {jobText.length > 0 && (
              <button
                type="button"
                onClick={() => setJobText('')}
                disabled={disabled}
                className="text-muted hover:text-plum"
              >
                Clear
              </button>
            )}
          </div>
        </TabsContent>

        {/* Tab 2: Upload File */}
        <TabsContent value="upload" className="space-y-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx,.txt"
            className="hidden"
            id="job-file-input"
          />

          {!jobFile ? (
            <label
              htmlFor="job-file-input"
              className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-rose/60 bg-petal/20 hover:bg-petal/40 transition-all cursor-pointer text-center group ${
                disabled ? 'pointer-events-none opacity-60' : ''
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-petal flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <UploadCloud className="w-6 h-6 text-berry" />
              </div>
              <span className="font-heading font-semibold text-sm text-plum">
                Select Job Document
              </span>
              <span className="text-xs text-muted mt-1">
                Supports PDF, DOCX, or TXT (up to 10MB)
              </span>
            </label>
          ) : (
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-line shadow-pink-sm">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-petal text-berry flex items-center justify-center shrink-0">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <p className="font-medium text-sm text-plum truncate max-w-[200px]">
                    {jobFile.name}
                  </p>
                  <p className="text-xs text-muted">
                    {formatFileSize(jobFile.size)} · Document
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleRemoveFile}
                disabled={disabled}
                className="text-muted hover:text-berry hover:bg-rose/20 rounded-xl"
                aria-label="Remove job document"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
