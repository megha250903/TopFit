import { useMemo, useState } from 'react'
import {
  Download,
  Filter,
  Users,
  Search,
  Sparkles,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react'
import { EmptyState } from './EmptyState'
import { CandidateCard } from './CandidateCard'
import { Button } from './ui/button'
import { Slider } from './ui/slider'
import { Switch } from './ui/switch'
import { ScoredCandidateItem, FilterOptions } from '@/lib/types'
import { exportCandidatesToCsv } from '@/lib/csv'

interface ResultsPanelProps {
  candidates: ScoredCandidateItem[]
  isScoring: boolean
  jobRole?: string
}

export function ResultsPanel({
  candidates,
  isScoring,
  jobRole,
}: ResultsPanelProps) {
  const [minScore, setMinScore] = useState<number>(0)
  const [experienceMetOnly, setExperienceMetOnly] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [showFilters, setShowFilters] = useState<boolean>(false)

  // Filter candidates based on controls while preserving highest-first score order
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      // Score filter
      if (c.score < minScore) return false

      // Experience met filter
      if (experienceMetOnly && c.experience_met !== true) return false

      // Search query (name, skills, email)
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase().trim()
        const nameMatch = (c.name || '').toLowerCase().includes(query)
        const emailMatch = (c.email || '').toLowerCase().includes(query)
        const fileMatch = (c.filename || '').toLowerCase().includes(query)
        const skillMatch =
          c.matching_skills.some((s) => s.toLowerCase().includes(query)) ||
          c.missing_skills.some((s) => s.toLowerCase().includes(query))

        if (!nameMatch && !emailMatch && !fileMatch && !skillMatch) {
          return false
        }
      }

      return true
    })
  }, [candidates, minScore, experienceMetOnly, searchQuery])

  const handleDownloadCsv = () => {
    exportCandidatesToCsv(
      filteredCandidates.length > 0 ? filteredCandidates : candidates,
      jobRole
        ? `topfit-${jobRole.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.csv`
        : 'topfit-candidates.csv'
    )
  }

  const resetFilters = () => {
    setMinScore(0)
    setExperienceMetOnly(false)
    setSearchQuery('')
  }

  const hasActiveFilters =
    minScore > 0 || experienceMetOnly || searchQuery.trim().length > 0

  return (
    <div className="space-y-4" aria-live="polite">
      {/* Results Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-3xl bg-white border border-line shadow-pink-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-petal text-berry flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-extrabold text-lg sm:text-xl text-plum">
                Ranked Shortlist
              </h2>
              {candidates.length > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-petal text-berry">
                  {filteredCandidates.length}
                  {filteredCandidates.length !== candidates.length
                    ? ` of ${candidates.length}`
                    : ''}
                </span>
              )}
            </div>
            <p className="text-xs text-muted">
              {candidates.length === 0
                ? 'Scores will update live as each resume is analyzed'
                : jobRole
                ? `Scored against: ${jobRole}`
                : 'Candidates sorted by match percentage (highest first)'}
            </p>
          </div>
        </div>

        {/* Action buttons: Filter Toggle & Download CSV */}
        {candidates.length > 0 && (
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={`rounded-xl text-xs gap-1.5 ${
                hasActiveFilters
                  ? 'border-berry text-berry bg-petal/40 font-semibold'
                  : ''
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-berry" />
              )}
            </Button>

            <Button
              type="button"
              onClick={handleDownloadCsv}
              size="sm"
              className="rounded-xl text-xs gap-1.5 font-bold shadow-pink-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </Button>
          </div>
        )}
      </div>

      {/* Filter Bar (Collapsible / Dynamic) */}
      {candidates.length > 0 && showFilters && (
        <div className="p-4 rounded-2xl bg-white border border-line shadow-pink-sm space-y-3.5 animate-in fade-in-0 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-line/60">
            <span className="text-xs font-bold uppercase tracking-wider text-plum flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-berry" />
              Filter Shortlist
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-berry hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Search Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="candidate-search"
                className="text-xs font-medium text-muted block"
              >
                Search candidate or skill
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  id="candidate-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. React, Priya, AWS..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-line bg-blush/40 text-plum placeholder:text-muted/60 focus-ring"
                />
              </div>
            </div>

            {/* Minimum Score Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-muted">Min match score:</span>
                <span className="font-bold text-berry font-heading text-sm">
                  {minScore}%
                </span>
              </div>
              <Slider
                value={[minScore]}
                onValueChange={(val) => setMinScore(val[0])}
                min={0}
                max={95}
                step={5}
                className="py-1"
              />
            </div>

            {/* Experience Met Only Toggle */}
            <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0">
              <label
                htmlFor="exp-met-switch"
                className="text-xs font-medium text-plum cursor-pointer"
              >
                Experience met only
              </label>
              <Switch
                id="exp-met-switch"
                checked={experienceMetOnly}
                onCheckedChange={setExperienceMetOnly}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Shortlist Display */}
      {candidates.length === 0 ? (
        <EmptyState />
      ) : filteredCandidates.length === 0 ? (
        <div className="p-8 text-center rounded-3xl bg-white border border-line shadow-pink-sm space-y-3">
          <p className="text-sm font-semibold text-plum">
            No candidates match the selected filters.
          </p>
          <p className="text-xs text-muted">
            Try adjusting your minimum score or turning off the experience filter.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="rounded-xl text-xs"
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCandidates.map((candidate, idx) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              rank={idx + 1}
              isTopRanked={idx === 0}
              index={idx}
            />
          ))}
        </div>
      )}

      {/* Footer note as required */}
      <div className="pt-4 text-center">
        <p className="text-xs text-muted/80">
          Scores are AI-assisted. Use them to prioritise, then review each candidate yourself.
        </p>
      </div>
    </div>
  )
}
