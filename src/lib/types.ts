export interface ParsedJob {
  role: string;
  required_skills: string[];
  preferred_skills: string[];
  minimum_experience: number | null;
  education_requirements: string[];
  responsibilities: string[];
}

export interface CandidateScoreResult {
  filename: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  experience_years: number | null;
  score: number; // 0 - 100
  matching_skills: string[];
  missing_skills: string[];
  experience_met: boolean | null;
  verdict: string;
}

export interface ScoredCandidateItem extends CandidateScoreResult {
  id: string;
  scoredAt: number;
}

export interface CandidateErrorItem {
  id: string;
  filename: string;
  error: string;
  timestamp: number;
}

export interface ScreeningProgress {
  total: number;
  current: number;
  currentFilename?: string;
  isScoringJob: boolean;
  isScoringResumes: boolean;
  isComplete: boolean;
}

export interface FilterOptions {
  minScore: number;
  experienceMetOnly: boolean;
  searchQuery: string;
}
