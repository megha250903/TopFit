import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface ScoreRingProps {
  score: number // 0 to 100
  size?: number // px
  strokeWidth?: number
  showLabel?: boolean
  className?: string
}

export function ScoreRing({
  score,
  size = 72,
  strokeWidth = 6.5,
  showLabel = false,
  className = '',
}: ScoreRingProps) {
  const prefersReducedMotion = useReducedMotion()
  const [displayScore, setDisplayScore] = useState(prefersReducedMotion ? score : 0)

  // Clamp score
  const safeScore = Math.min(100, Math.max(0, Math.round(score)))

  // Color selection based on specifications:
  // >= 75 green (#2f9e72), 50-74 berry (#d6336c), < 50 muted pink-grey (#8c6676)
  let ringColor = '#8c6676'
  let textColor = 'text-muted'
  let trackColor = '#ffd1e1'

  if (safeScore >= 75) {
    ringColor = '#2f9e72'
    textColor = 'text-success'
    trackColor = '#dcf2e8'
  } else if (safeScore >= 50) {
    ringColor = '#d6336c'
    textColor = 'text-berry'
    trackColor = '#ffe4ed'
  }

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (safeScore / 100) * circumference

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayScore(safeScore)
      return
    }

    let start = 0
    const duration = 1000 // ms
    const stepTime = 20
    const steps = duration / stepTime
    const increment = safeScore / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= safeScore) {
        setDisplayScore(safeScore)
        clearInterval(timer)
      } else {
        setDisplayScore(Math.round(current))
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [safeScore, prefersReducedMotion])

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={safeScore}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Score: ${safeScore} out of 100`}
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90 transform"
        style={{ overflow: 'visible' }}
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Animated progress ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeLinecap="round"
          fill="transparent"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 1.1, ease: [0.16, 1, 0.3, 1] }
          }
        />
      </svg>

      {/* Centered number display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span
          className={`font-heading font-extrabold tracking-tight ${textColor}`}
          style={{ fontSize: size <= 60 ? '1rem' : size <= 80 ? '1.35rem' : '1.75rem' }}
        >
          {displayScore}
        </span>
        {showLabel && (
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted -mt-1">
            score
          </span>
        )}
      </div>
    </div>
  )
}
