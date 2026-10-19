import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, Sparkles, Check, Briefcase, Zap } from 'lucide-react'
import { ScoreRing } from './ScoreRing'
import { Badge } from './ui/badge'

interface HeroProps {
  onScrollToWorkspace: () => void
}

export function Hero({ onScrollToWorkspace }: HeroProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="relative overflow-hidden pt-10 pb-16 lg:py-20 border-b border-line/50">
      {/* Background soft ambient pink glows */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-petal/60 rounded-full blur-3xl opacity-70"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-40 -right-20 w-[400px] h-[400px] bg-rose-light/50 rounded-full blur-3xl opacity-60"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-petal border border-petal-dark text-xs font-semibold text-berry mb-6 shadow-pink-subtle">
              <Sparkles className="w-3.5 h-3.5 text-berry" />
              <span>AI-Powered Resume Screening Engine</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-plum leading-[1.12]">
              Find your best hire in{' '}
              <span className="text-berry underline decoration-rose decoration-wavy decoration-2 underline-offset-8">
                minutes
              </span>
              , not days
            </h1>

            <p className="mt-5 text-base sm:text-lg text-muted max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Upload any job description and drop in resumes. TopFit extracts
              technical skills, verifies experience criteria, and scores every
              candidate with explainable AI verdicts.
            </p>

            {/* Quick feature bullets */}
            <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-medium text-plum">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-line shadow-pink-subtle">
                <Check className="w-3.5 h-3.5 text-success" /> Live rank updates
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-line shadow-pink-subtle">
                <Zap className="w-3.5 h-3.5 text-berry" /> Skill gap breakdown
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-line shadow-pink-subtle">
                <Briefcase className="w-3.5 h-3.5 text-muted" /> PDF · DOCX · TXT
              </span>
            </div>

            {/* CTA Button */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onScrollToWorkspace}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-berry to-berry-dark text-white font-heading font-bold text-base shadow-pink-md hover:shadow-pink-glow hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus-ring cursor-pointer"
              >
                <span>Screen resumes</span>
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </button>
              <span className="text-xs text-muted">
                No signup required · Works with FastAPI backend
              </span>
            </div>
          </div>

          {/* Right Column: Tilted stack of 3 sample candidate cards */}
          <div className="lg:col-span-5 relative flex justify-center items-center py-6">
            <div className="relative w-full max-w-md">
              {/* Sample indicator pill */}
              <div className="text-center mb-3">
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-muted/80 bg-petal/50 border border-line/60 px-3 py-0.5 rounded-full">
                  Interactive Preview · Example shortlists
                </span>
              </div>

              {/* Stack Card 3 (Bottom) */}
              <motion.div
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 30, rotate: 0 }}
                animate={{ opacity: 0.65, y: 28, rotate: 5, scale: 0.92 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="absolute inset-0 mx-auto rounded-3xl bg-white/90 border border-line p-5 shadow-pink-sm pointer-events-none select-none"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-petal text-plum flex items-center justify-center text-xs font-bold">
                      #3
                    </div>
                    <div>
                      <div className="h-4 w-28 bg-line/60 rounded" />
                      <div className="h-3 w-16 bg-line/40 rounded mt-1.5" />
                    </div>
                  </div>
                  <ScoreRing score={58} size={50} strokeWidth={5} />
                </div>
              </motion.div>

              {/* Stack Card 2 (Middle) */}
              <motion.div
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20, rotate: 0 }}
                animate={{ opacity: 0.88, y: 14, rotate: -3, scale: 0.96 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="absolute inset-0 mx-auto rounded-3xl bg-white border border-line p-5 shadow-pink-sm pointer-events-none select-none"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-petal text-plum flex items-center justify-center text-xs font-bold">
                      #2
                    </div>
                    <div>
                      <div className="font-heading font-bold text-sm text-plum">
                        Priya Sharma
                      </div>
                      <div className="text-[11px] text-muted">
                        3 yrs · React, Node.js, AWS
                      </div>
                    </div>
                  </div>
                  <ScoreRing score={82} size={52} strokeWidth={5} />
                </div>
              </motion.div>

              {/* Stack Card 1 (Top Hero Card) */}
              <motion.div
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 10, rotate: 0 }}
                animate={{ opacity: 1, y: 0, rotate: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative rounded-3xl bg-white border-2 border-berry shadow-pink-md p-5 sm:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-berry text-white flex items-center justify-center font-heading font-extrabold text-sm shadow-pink-sm shrink-0">
                      #1
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-base text-plum">
                          Abhay Singh
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[10px] bg-success-light text-success border-success-border font-bold"
                        >
                          Strong match
                        </Badge>
                      </div>
                      <p className="text-xs text-muted mt-0.5">
                        abhay.dev@example.com · 4 yrs experience
                      </p>
                    </div>
                  </div>

                  <ScoreRing score={94} size={58} strokeWidth={5.5} />
                </div>

                <div className="mt-3.5 p-2.5 rounded-xl bg-petal/60 border border-petal-dark text-xs text-plum">
                  <span className="font-bold text-berry text-[10px] uppercase tracking-wider block mb-0.5">
                    AI Verdict
                  </span>
                  Full-stack fit with PHP and MERN expertise. Experience in AWS
                  and 3D rendering matches role requirements.
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Badge variant="success" className="text-[11px]">
                    PHP & Laravel
                  </Badge>
                  <Badge variant="success" className="text-[11px]">
                    React.js & MERN
                  </Badge>
                  <Badge variant="success" className="text-[11px]">
                    MySQL / MongoDB
                  </Badge>
                  <Badge variant="missing" className="text-[11px]">
                    Three.js (Basic)
                  </Badge>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
