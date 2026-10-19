import { ParsedJob, CandidateScoreResult } from './types'

export class ApiError extends Error {
  status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * Format friendly user-facing error messages
 */
export function formatFriendlyErrorMessage(rawMessage: string, status?: number): string {
  const lower = (rawMessage || '').toLowerCase()

  if (
    lower.includes('econnrefused') ||
    lower.includes('failed to fetch') ||
    lower.includes('networkerror') ||
    lower.includes('proxy error') ||
    status === 504 ||
    lower.includes('<!doctype') ||
    lower.includes('<html')
  ) {
    return 'Unable to reach the screening backend at http://localhost:8000. Please make sure the FastAPI server is running (uvicorn main:app --reload --port 8000).'
  }

  if (lower.includes('ai model error') || lower.includes('model_not_found')) {
    return `AI Service Error: ${rawMessage.replace(/ai model error:/i, '').trim()}`
  }

  if (
    lower.includes('scan') ||
    lower.includes('no text') ||
    lower.includes('empty text') ||
    lower.includes('extract')
  ) {
    return 'This PDF has no readable text. It may be a scanned document or image. Try a DOCX or a text-based PDF.'
  }

  if (lower.includes('corrupt') || lower.includes('cannot read') || lower.includes('invalid file')) {
    return 'The file appears corrupted or unreadable. Please check the file and try re-saving as PDF or DOCX.'
  }

  if (lower.includes('rate limit') || lower.includes('429') || lower.includes('quota')) {
    return 'AI provider rate limit reached. Please wait a few seconds before scoring the next resume.'
  }

  if (lower.includes('api key') || lower.includes('unauthorized') || status === 401) {
    return 'Backend AI API key is missing or invalid. Check your GROQ_API_KEY environment variable.'
  }

  return rawMessage || 'An unexpected error occurred while processing this file.'
}

/**
 * Safe error parser that only consumes body stream ONCE
 */
async function parseErrorFromResponse(res: Response): Promise<string> {
  let errorMsg = `Server error (${res.status})`
  try {
    const rawText = await res.text()
    if (rawText) {
      try {
        const errorJson = JSON.parse(rawText)
        if (errorJson.detail) {
          errorMsg =
            typeof errorJson.detail === 'string'
              ? errorJson.detail
              : JSON.stringify(errorJson.detail)
        } else if (errorJson.message) {
          errorMsg = errorJson.message
        } else {
          errorMsg = rawText
        }
      } catch {
        errorMsg = rawText
      }
    }
  } catch (readErr: any) {
    errorMsg = readErr?.message || `HTTP ${res.status}`
  }
  return errorMsg
}

/**
 * Call POST /api/job
 */
export async function parseJobDescription(params: {
  text?: string
  file?: File
}): Promise<ParsedJob> {
  const formData = new FormData()
  if (params.text && params.text.trim().length > 0) {
    formData.append('text', params.text.trim())
  }
  if (params.file) {
    formData.append('file', params.file)
  }

  try {
    const res = await fetch('/api/job', {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      const errorMsg = await parseErrorFromResponse(res)
      throw new ApiError(formatFriendlyErrorMessage(errorMsg, res.status), res.status)
    }

    const data: ParsedJob = await res.json()
    return data
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err
    }
    throw new ApiError(formatFriendlyErrorMessage(err.message || 'Network request failed'))
  }
}

/**
 * Call POST /api/score
 */
export async function scoreResume(params: {
  job: ParsedJob
  file: File
}): Promise<CandidateScoreResult> {
  const formData = new FormData()
  formData.append('job', JSON.stringify(params.job))
  formData.append('file', params.file)

  try {
    const res = await fetch('/api/score', {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      const errorMsg = await parseErrorFromResponse(res)
      throw new ApiError(formatFriendlyErrorMessage(errorMsg, res.status), res.status)
    }

    const data: CandidateScoreResult = await res.json()
    return {
      ...data,
      filename: data.filename || params.file.name,
      score: Math.min(100, Math.max(0, Math.round(Number(data.score) || 0))),
    }
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err
    }
    throw new ApiError(formatFriendlyErrorMessage(err.message || 'Failed to score candidate'))
  }
}

/**
 * Check if backend is reachable
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch('/api/health', { method: 'GET', signal: AbortSignal.timeout(3000) })
    return res.ok
  } catch {
    return false
  }
}
