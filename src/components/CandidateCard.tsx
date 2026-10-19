import { memo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Mail,
  Phone,
  Briefcase,
  Check,
  AlertCircle,
  HelpCircle,
  Award,
} from 'lucide-react'
import { ScoreRing } from './ScoreRing'
import { Badge } from './ui/badge'
import { ScoredCandidateItem } from '@/lib/types'
import { getMatchLabel } from '@/lib/utils'

interface CandidateCardProps {
  candidate: ScoredCandidateItem
  rank: number
  isTopRanked?: boolean
  index?: number
}

export const CandidateCard = memo(function CandidateCard({
  candidate,
  rank,
  isTopRanked = false,
  index = 0,
}: CandidateCardProps) {
  const prefersReducedMotion = useReducedMotion()
  const matchInfo = getMatchLabel(candidate.score)

  // Experience requirement badge text & icon
  let expBadge = {
    label: 'Experience requirement: Not specified',
    color: 'bg-blush text-muted border-line',
    icon: <HelpCircle className="w-3.5 h-3.5" />,
  }

  if (candidate.experience_met === true) {
    expBadge = {
      label: 'Experience requirement: Met',
      color: 'bg-success-light text-success-dark border-success-border font-medium',
      icon: <Check className="w-3.5 h-3.5" />,
    }
  } else if (candidate.experience_met === false) {
    expBadge = {
      label: 'Experience requirement: Not met',
      color: 'bg-rose-light text-berry border-rose/40 font-medium',
      icon: <AlertCircle className="w-3.5 h-3.5" />,
    }
  }

  // Orchestrated motion entrance
  const cardMotionVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: prefersReducedMotion
        ? { duration: 0 }
        : {
            duration: 0.35,
            delay: Math.min(index * 0.07, 0.4),
            ease: [0.16, 1, 0.3, 1],
          },
    },
  }

  return (
    <motion.article
      variants={cardMotionVariants}
      initial="hidden"
      animate="visible"
      layout={prefersReducedMotion ? false : 'position'}
      className={`relative rounded-3xl p-5 sm:p-6 transition-all duration-300 ${
        isTopRanked
          ? 'bg-white border-2 border-berry shadow-pink-md ring-4 ring-berry/10'
          : 'bg-white border border-line shadow-pink-sm hover:shadow-pink-md'
      }`}
      aria-labelledby={`candidate-name-${candidate.id}`}
    >
      {/* Top candidate banner tag */}
      {isTopRanked && (
        <div className="absolute -top-3.5 left-6 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-berry to-berry-dark text-white text-xs font-bold tracking-wide shadow-pink-sm">
          <Award className="w-3.5 h-3.5" />
          <span>Top Match</span>
        </div>
      )}

      {/* Header section with Rank, Info, and Score Ring */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-line/60">
        <div className="flex items-start gap-3.5">
          {/* Rank Badge */}
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center font-heading font-extrabold text-base shrink-0 ${
              isTopRanked
                ? 'bg-berry text-white shadow-pink-sm'
                : 'bg-petal text-plum border border-petal-dark'
            }`}
            aria-label={`Rank ${rank}`}
          >
            #{rank}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h4
                id={`candidate-name-${candidate.id}`}
                className="font-heading text-lg sm:text-xl font-bold text-plum"
              >
                {candidate.name || candidate.filename.replace(/\.[^/.]+$/, '')}
              </h4>
              <Badge
                variant="outline"
                className={`text-xs font-semibold px-2.5 py-0.5 border ${matchInfo.colorClass}`}
              >
                {matchInfo.label}
              </Badge>
            </div>

            {/* Contact details line: email · phone · years of experience */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
              {candidate.email && (
                <span className="inline-flex items-center gap-1">
                  <Mail className="w-3 h-3 text-rose shrink-0" />
                  <span className="truncate max-w-[180px] sm:max-w-[240px]">
                    {candidate.email}
                  </span>
                </span>
              )}
              {candidate.phone && (
                <span className="inline-flex items-center gap-1">
                  <Phone className="w-3 h-3 text-rose shrink-0" />
                  <span>{candidate.phone}</span>
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-rose shrink-0" />
                <span>
                  {candidate.experience_years !== null &&
                  candidate.experience_years !== undefined
                    ? `${candidate.experience_years} ${
                        candidate.experience_years === 1 ? 'yr' : 'yrs'
                      } experience`
                    : 'Experience not specified'}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Circular Score Ring */}
        <div className="self-end sm:self-center">
          <ScoreRing score={candidate.score} size={68} />
        </div>
      </div>

      {/* Experience requirement status badge */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border ${expBadge.color}`}
        >
          {expBadge.icon}
          <span>{expBadge.label}</span>
        </div>
        <span className="text-[11px] text-muted truncate max-w-[200px]">
          File: {candidate.filename}
        </span>
      </div>

      {/* Verdict in a petal-coloured box */}
      {candidate.verdict && (
        <div className="mt-3.5 p-3.5 rounded-2xl bg-petal/60 border border-petal-dark text-plum text-xs sm:text-sm leading-relaxed">
          <span className="font-bold text-berry text-xs uppercase tracking-wider block mb-1">
            Recruiter Verdict
          </span>
          <p className="text-plum/90">{candidate.verdict}</p>
        </div>
      )}

      {/* Two columns: Matching skills and Missing skills */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Matching Skills Column */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-success">
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Matching skills
            </span>
            <span className="text-[11px] font-semibold text-muted">
              ({candidate.matching_skills?.length || 0})
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {candidate.matching_skills && candidate.matching_skills.length > 0 ? (
              candidate.matching_skills.map((skill, i) => (
                <Badge
                  key={`${skill}-${i}`}
                  variant="success"
                  className="text-xs font-medium px-2.5 py-0.5 rounded-lg"
                >
                  {skill}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-muted italic">None identified</span>
            )}
          </div>
        </div>

        {/* Missing Skills Column */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-berry">
            <span className="flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Missing skills
            </span>
            <span className="text-[11px] font-semibold text-muted">
              ({candidate.missing_skills?.length || 0})
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {candidate.missing_skills && candidate.missing_skills.length > 0 ? (
              candidate.missing_skills.map((skill, i) => (
                <Badge
                  key={`${skill}-${i}`}
                  variant="missing"
                  className="text-xs font-medium px-2.5 py-0.5 rounded-lg"
                >
                  {skill}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-success font-medium">All core skills covered</span>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  )
})
