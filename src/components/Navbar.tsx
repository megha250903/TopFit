import { Sparkles } from 'lucide-react'
import { Logo } from './Logo'

interface NavbarProps {
  onScrollToWorkspace?: () => void
}

export function Navbar({ onScrollToWorkspace }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-line/70 bg-white/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <Logo iconSize={38} wordmarkClassName="text-2xl" />
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-petal text-berry border border-petal-dark ml-1">
            <Sparkles className="w-3 h-3" /> AI Screening
          </span>
        </div>

        {/* Action Button & Status */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-petal/50 text-xs text-plum border border-line/60">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="font-medium text-muted">Backend ready: /api</span>
          </div>

          {onScrollToWorkspace && (
            <button
              onClick={onScrollToWorkspace}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-petal text-plum hover:bg-petal-dark transition-colors focus-ring cursor-pointer"
            >
              Start Screening
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
