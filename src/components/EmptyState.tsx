import { Sparkles, FileText, CheckCircle2 } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-3xl border-2 border-dashed border-line/80 bg-white/60">
      <div className="relative mb-5 flex items-center justify-center">
        {/* Soft layered circles illustration */}
        <div className="w-20 h-20 rounded-2xl bg-petal flex items-center justify-center shadow-pink-sm rotate-3 transform">
          <div className="w-14 h-14 rounded-xl bg-petal-dark flex items-center justify-center -rotate-6 transform">
            <Sparkles className="w-7 h-7 text-berry" />
          </div>
        </div>
        <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white shadow-pink-sm border border-line flex items-center justify-center">
          <CheckCircle2 className="w-4 h-4 text-success" />
        </div>
      </div>

      <h3 className="font-heading text-lg sm:text-xl font-bold text-plum mb-2">
        Your ranked shortlist shows up here
      </h3>
      <p className="text-sm text-muted max-w-sm mb-6 leading-relaxed">
        Provide a job description on the left, drop one or more candidate resumes, then click <strong className="text-berry font-semibold">Rank candidates</strong> to see live AI scores.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-md text-xs text-muted-foreground">
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blush border border-line/60">
          <FileText className="w-4 h-4 text-berry shrink-0" />
          <span>Role parsing</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blush border border-line/60">
          <Sparkles className="w-4 h-4 text-rose shrink-0" />
          <span>Skill matching</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blush border border-line/60">
          <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
          <span>Live ranking</span>
        </div>
      </div>
    </div>
  )
}
