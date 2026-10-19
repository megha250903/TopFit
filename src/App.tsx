import { useRef } from 'react'
import {
  Sparkles,
  ArrowRight,
  Loader2,
  Trash2,
  HelpCircle,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { JobInput } from './components/JobInput'
import { ResumeDropzone } from './components/ResumeDropzone'
import { BatchProgress } from './components/BatchProgress'
import { ResultsPanel } from './components/ResultsPanel'
import { Button } from './components/ui/button'
import { Logo } from './components/Logo'
import { useScreening } from './hooks/useScreening'
import { Toaster } from 'sonner'

export function App() {
  const workspaceRef = useRef<HTMLDivElement>(null)

  const {
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
  } = useScreening()

  const scrollToWorkspace = () => {
    workspaceRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Validation
  const hasValidJob = jobFile !== null || jobText.trim().length >= 30
  const hasResumes = resumeFiles.length > 0
  const canStart = hasValidJob && hasResumes && !isScreening

  return (
    <div className="min-h-screen flex flex-col bg-blush text-plum font-sans selection:bg-petal-dark selection:text-plum">
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'rounded-2xl border-line text-plum shadow-pink-md',
          style: {
            background: '#ffffff',
            color: '#3a1b29',
            border: '1px solid #f7cfdd',
          },
        }}
      />

      {/* Navigation */}
      <Navbar onScrollToWorkspace={scrollToWorkspace} />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero onScrollToWorkspace={scrollToWorkspace} />

        {/* Workspace section */}
        <section
          ref={workspaceRef}
          id="workspace"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14"
        >
          {/* Workspace Title & Quick Tools */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-berry">
                Screening Workspace
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-plum mt-0.5">
                Screen & Rank Candidates
              </h2>
            </div>

            {/* Quick Demo button for immediate testing */}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={loadDemoData}
                disabled={isScreening}
                className="rounded-xl text-xs gap-1.5 border-line bg-white hover:border-rose text-plum"
              >
                <Sparkles className="w-3.5 h-3.5 text-berry" />
                <span>Load Sample Results</span>
              </Button>

              {(candidates.length > 0 || errors.length > 0) && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  disabled={isScreening}
                  className="rounded-xl text-xs text-muted hover:text-berry"
                  title="Clear all results"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  <span>Reset</span>
                </Button>
              )}
            </div>
          </div>

          {/* Two-column layout on desktop; single column on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (Sticky on desktop) */}
            <aside className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
              <div className="bg-white rounded-3xl border border-line p-5 sm:p-6 shadow-pink-sm space-y-6">
                {/* Step 1: Job Description */}
                <JobInput
                  jobText={jobText}
                  setJobText={setJobText}
                  jobFile={jobFile}
                  setJobFile={setJobFile}
                  disabled={isScreening}
                />

                <div className="h-px bg-line/60" />

                {/* Step 2: Resumes Dropzone */}
                <ResumeDropzone
                  files={resumeFiles}
                  setFiles={setResumeFiles}
                  disabled={isScreening}
                />

                {/* Step 3: Action Button */}
                <div className="pt-2 space-y-3">
                  {!isScreening ? (
                    <Button
                      type="button"
                      onClick={startScreening}
                      disabled={!canStart}
                      className="w-full h-12 rounded-2xl font-heading font-bold text-base gap-2"
                    >
                      <span>Rank candidates</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        disabled
                        className="flex-1 h-12 rounded-2xl font-heading font-bold text-base gap-2 bg-berry text-white opacity-90"
                      >
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Scoring in progress...</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={cancelScreening}
                        className="h-12 rounded-2xl px-4 text-xs font-bold text-muted hover:text-berry"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}

                  {/* Helper hint when button is disabled */}
                  {!canStart && !isScreening && (
                    <p className="text-[11px] text-center text-muted">
                      {!hasValidJob && !hasResumes
                        ? 'Add a job description (min 30 chars) and drop resumes to enable.'
                        : !hasValidJob
                        ? 'Job description must have at least 30 characters.'
                        : 'Drop at least one candidate resume above.'}
                    </p>
                  )}
                </div>

                {/* Batch Progress and Non-blocking error cards */}
                <BatchProgress
                  progress={progress}
                  errors={errors}
                  onDismissError={dismissError}
                />
              </div>

              {/* Helpful sidebar tip card */}
              <div className="p-4 rounded-2xl bg-petal/40 border border-petal-dark text-xs text-plum space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-berry">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Production Ready</span>
                </div>
                <p className="text-muted leading-relaxed">
                  Calls <code className="text-plum bg-petal px-1.5 py-0.5 rounded text-[11px]">POST /api/job</code> once, then iteratively calls <code className="text-plum bg-petal px-1.5 py-0.5 rounded text-[11px]">POST /api/score</code> for each resume. Unreadable files are isolated without stopping the batch.
                </p>
              </div>
            </aside>

            {/* Right Column: Shortlist Results */}
            <div className="lg:col-span-7">
              <ResultsPanel
                candidates={candidates}
                isScoring={isScreening}
                jobRole={parsedJob?.role}
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-line/60 bg-white/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <div className="flex items-center gap-3">
            <Logo iconSize={26} wordmarkClassName="text-base" />
            <span className="text-muted/60">|</span>
            <span>Intelligent AI Resume Screening</span>
          </div>
          <div>
            Built with React 18, Vite, TypeScript & Tailwind CSS
          </div>
        </div>
      </footer>
    </div>
  )
}
