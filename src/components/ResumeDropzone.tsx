import { useCallback } from 'react'
import { useDropzone, FileRejection } from 'react-dropzone'
import {
  UploadCloud,
  FileText,
  X,
  FileCheck,
  AlertCircle,
  Plus,
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from './ui/badge'
import { formatFileSize, getFileExtension } from '@/lib/utils'

interface ResumeDropzoneProps {
  files: File[]
  setFiles: React.Dispatch<React.SetStateAction<File[]>>
  disabled?: boolean
}

export function ResumeDropzone({
  files,
  setFiles,
  disabled = false,
}: ResumeDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        fileRejections.forEach((rej) => {
          const err = rej.errors[0]?.message || 'Invalid file format'
          toast.error(`Could not add "${rej.file.name}": ${err}`)
        })
      }

      if (acceptedFiles.length === 0) return

      setFiles((prevFiles) => {
        const existingSignatures = new Set(
          prevFiles.map((f) => `${f.name}-${f.size}`)
        )
        const newUniqueFiles: File[] = []
        let duplicateCount = 0

        for (const file of acceptedFiles) {
          const sig = `${file.name}-${file.size}`
          if (!existingSignatures.has(sig)) {
            newUniqueFiles.push(file)
            existingSignatures.add(sig)
          } else {
            duplicateCount++
          }
        }

        if (duplicateCount > 0) {
          toast.info(
            `${duplicateCount} duplicate resume${
              duplicateCount > 1 ? 's' : ''
            } skipped.`
          )
        }

        if (newUniqueFiles.length > 0) {
          toast.success(
            `Added ${newUniqueFiles.length} resume${
              newUniqueFiles.length > 1 ? 's' : ''
            } to queue.`
          )
        }

        return [...prevFiles, ...newUniqueFiles]
      })
    },
    [setFiles]
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      disabled,
      accept: {
        'application/pdf': ['.pdf'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
          '.docx',
        ],
        'text/plain': ['.txt'],
      },
      maxSize: 15 * 1024 * 1024, // 15MB
    })

  const removeFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove))
  }

  const clearAllFiles = () => {
    setFiles([])
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-petal text-berry flex items-center justify-center font-bold text-xs">
            2
          </div>
          <h3 className="font-heading font-bold text-base text-plum">
            Candidate Resumes
          </h3>
        </div>

        {files.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-muted">
              {files.length} file{files.length === 1 ? '' : 's'} ready
            </span>
            <button
              type="button"
              onClick={clearAllFiles}
              disabled={disabled}
              className="text-xs text-muted hover:text-berry underline focus-ring rounded"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Drag & Drop Area with dashed rose border and hover scale effect */}
      <div
        {...getRootProps()}
        className={`relative flex flex-col items-center justify-center p-6 sm:p-7 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer text-center outline-none select-none ${
          isDragActive
            ? 'border-berry bg-petal/60 scale-[1.01] shadow-pink-md'
            : isDragReject
            ? 'border-red-400 bg-red-50'
            : 'border-rose/70 bg-petal/20 hover:border-berry hover:bg-petal/40 hover:scale-[1.005]'
        } ${disabled ? 'pointer-events-none opacity-60' : ''}`}
      >
        <input {...getInputProps()} id="resume-dropzone-input" />

        <div className="w-12 h-12 rounded-2xl bg-petal flex items-center justify-center mb-3 shadow-pink-subtle group-hover:scale-110 transition-transform">
          <UploadCloud className="w-6 h-6 text-berry" />
        </div>

        <p className="font-heading font-bold text-sm text-plum">
          {isDragActive
            ? 'Drop the resumes here...'
            : 'Drag & drop resumes here, or click to browse'}
        </p>

        <p className="text-xs text-muted mt-1 max-w-xs">
          Supports multiple files: PDF, DOCX, or TXT (up to 15MB each). Duplicate
          files are automatically prevented.
        </p>

        <div className="mt-3 flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] bg-white/80">
            PDF
          </Badge>
          <Badge variant="outline" className="text-[10px] bg-white/80">
            DOCX
          </Badge>
          <Badge variant="outline" className="text-[10px] bg-white/80">
            TXT
          </Badge>
        </div>
      </div>

      {/* List of uploaded resumes as chips */}
      {files.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="text-xs font-semibold text-plum flex items-center justify-between">
            <span>Queued Files ({files.length})</span>
            <span className="text-[11px] text-muted">Click × to remove</span>
          </div>

          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1 rounded-xl bg-petal/20 border border-line/60">
            {files.map((file, idx) => {
              const ext = getFileExtension(file.name)
              return (
                <div
                  key={`${file.name}-${file.size}-${idx}`}
                  className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-line shadow-pink-subtle text-xs text-plum hover:border-rose transition-colors max-w-full"
                >
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      ext === 'PDF'
                        ? 'bg-rose-light text-berry'
                        : ext === 'DOCX'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {ext}
                  </span>

                  <span className="truncate max-w-[140px] sm:max-w-[180px] font-medium" title={file.name}>
                    {file.name}
                  </span>

                  <span className="text-[10px] text-muted shrink-0">
                    {formatFileSize(file.size)}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(idx)
                    }}
                    disabled={disabled}
                    className="text-muted hover:text-berry hover:bg-petal rounded-md p-0.5 transition-colors focus-ring"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
