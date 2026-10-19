import { Loader2, AlertCircle, CheckCircle2, FileText, X } from 'lucide-react'
import { Progress } from './ui/progress'
import { ScreeningProgress, CandidateErrorItem } from '@/lib/types'

interface BatchProgressProps {
  progress: ScreeningProgress
  errors: CandidateErrorItem[]
  onDismissError?: (id: string) => void
}

export function BatchProgress({
  progress,
  errors,
  onDismissError,
}: BatchProgressProps) {
  const { total, current, currentFilename, isScoringJob, isScoringResumes, isComplete } = progress

  const percentage =
    total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0

  if (!isScoringJob && !isScoringResumes && !isComplete && errors.length === 0) {
    return null
  }

  return (
    <div
      className="space-y-3 pt-2"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Active Screening Status Card */}
      {(isScoringJob || isScoringResumes || isComplete) && (
        <div className="p-4 rounded-2xl bg-petal/40 border border-petal-dark shadow-pink-subtle space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {isComplete ? (
                <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
              ) : (
                <Loader2 className="w-4 h-4 text-berry animate-spin shrink-0" />
              )}
              <span className="font-heading font-bold text-plum text-sm">
                {isScoringJob
                  ? 'Analyzing job requirements...'
                  : isComplete
                  ? 'Shortlist ranking complete!'
                  : `Scoring resume ${current} of ${total}`}
              </span>
            </div>

            <span className="font-bold text-berry text-xs">
              {isScoringJob ? 'Initializing' : `${percentage}%`}
            </span>
          </div>

          {/* Progress bar */}
          <Progress
            value={isScoringJob ? 15 : percentage}
            className="h-2.5 bg-petal-dark/80"
          />

          <div className="flex items-center justify-between text-[11px] text-muted">
            <span className="truncate max-w-[220px]">
              {isScoringJob
                ? 'Parsing skills, responsibilities & experience...'
                : isComplete
                ? `Processed ${total} resumes`
                : currentFilename
                ? `Current: ${currentFilename}`
                : 'Evaluating match against role...'}
            </span>
            <span>
              {current}/{total} scored
            </span>
          </div>
        </div>
      )}

      {/* Error cards for failed resumes (does not halt the batch) */}
      {errors.length > 0 && (
        <div className="space-y-2" aria-live="assertive">
          <div className="flex items-center justify-between text-xs font-semibold text-berry">
            <span className="flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              Processing Issues ({errors.length})
            </span>
            <span className="text-[11px] text-muted font-normal">
              Batch continued without interruption
            </span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {errors.map((err) => (
              <div
                key={err.id}
                className="flex items-start justify-between gap-3 p-3 rounded-xl bg-white border border-rose/60 shadow-pink-subtle text-xs"
              >
                <div className="flex items-start gap-2.5 overflow-hidden">
                  <div className="p-1 rounded-lg bg-rose-light text-berry shrink-0 mt-0.5">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-plum block truncate max-w-[200px]">
                      {err.filename}
                    </span>
                    <p className="text-muted text-[11px] mt-0.5 leading-snug">
                      {err.error}
                    </p>
                  </div>
                </div>

                {onDismissError && (
                  <button
                    type="button"
                    onClick={() => onDismissError(err.id)}
                    className="text-muted hover:text-plum p-1 rounded-md transition-colors"
                    aria-label={`Dismiss error for ${err.filename}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
