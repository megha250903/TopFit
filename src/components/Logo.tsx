import React from 'react'

interface LogoProps {
  className?: string
  iconSize?: number
  showWordmark?: boolean
  wordmarkClassName?: string
}

export function Logo({
  className = '',
  iconSize = 40,
  showWordmark = true,
  wordmarkClassName = '',
}: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* TopFit Squircle Icon with Checkmark & Sparkle */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm transition-transform duration-200 hover:scale-105"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="topfit-squircle-grad"
            x1="12"
            y1="10"
            x2="90"
            y2="92"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#f580a6" />
            <stop offset="100%" stopColor="#d6336c" />
          </linearGradient>
        </defs>

        {/* Rounded squircle background */}
        <rect
          width="100"
          height="100"
          rx="28"
          fill="url(#topfit-squircle-grad)"
        />

        {/* Crisp checkmark path */}
        <path
          d="M26 53.5L42 69.5L72 38"
          stroke="white"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 4-pointed sparkle at the top tip of the checkmark */}
        <path
          d="M78 22 C78 26.5 80.5 29 85 29 C80.5 29 78 31.5 78 36 C78 31.5 75.5 29 71 29 C75.5 29 78 26.5 78 22 Z"
          fill="white"
        />
      </svg>

      {/* TopFit Wordmark: "Top" in deep plum, "Fit" in vibrant berry */}
      {showWordmark && (
        <span
          className={`font-heading font-extrabold tracking-tight leading-none text-2xl text-plum ${wordmarkClassName}`}
        >
          Top<span className="text-berry">Fit</span>
        </span>
      )}
    </div>
  )
}
