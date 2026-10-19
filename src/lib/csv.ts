import { ScoredCandidateItem } from './types'

function escapeCsvCell(value: any): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function exportCandidatesToCsv(candidates: ScoredCandidateItem[], filename = 'shortlist-candidates.csv') {
  if (!candidates || candidates.length === 0) return

  const headers = [
    'Rank',
    'Name',
    'Score',
    'Experience Met',
    'Experience Years',
    'Email',
    'Phone',
    'Matching Skills',
    'Missing Skills',
    'Verdict',
    'Filename',
  ]

  const rows = candidates.map((c, index) => {
    let expMetStr = 'Not Specified'
    if (c.experience_met === true) expMetStr = 'Met'
    if (c.experience_met === false) expMetStr = 'Not Met'

    return [
      escapeCsvCell(index + 1),
      escapeCsvCell(c.name || 'Anonymous'),
      escapeCsvCell(c.score),
      escapeCsvCell(expMetStr),
      escapeCsvCell(c.experience_years !== null && c.experience_years !== undefined ? `${c.experience_years} yrs` : 'N/A'),
      escapeCsvCell(c.email || 'N/A'),
      escapeCsvCell(c.phone || 'N/A'),
      escapeCsvCell((c.matching_skills || []).join('; ')),
      escapeCsvCell((c.missing_skills || []).join('; ')),
      escapeCsvCell(c.verdict || ''),
      escapeCsvCell(c.filename || ''),
    ].join(',')
  })

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
