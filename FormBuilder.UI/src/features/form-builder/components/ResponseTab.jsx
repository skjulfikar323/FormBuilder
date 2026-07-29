import { useMemo, useState } from 'react'
import { Trash2, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import { useSubmissions, useDeleteSubmission } from '../hooks/useSubmissions.js'
import { ConfirmModal } from '@shared/components/ui/ConfirmModal.jsx'

function formatDate(iso) {
  try {
    const d = new Date(iso)
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  } catch {
    return iso
  }
}

function columnLabel(block, indexInGroup) {
  const label = block.data?.label?.trim()
  if (label) return label
  const typeName = block.type.replace('-input', '').replace(/^./, (c) => c.toUpperCase())
  return `${typeName} ${indexInGroup + 1}`
}

function toCSV(columns, rows) {
  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const header = ['#', 'Submitted at', ...columns.map((c) => c.label)].map(escape).join(',')
  const body = rows
    .map((r, i) =>
      [i + 1, formatDate(r.submittedAt), ...columns.map((c) => r.values?.[c.id] ?? '')]
        .map(escape)
        .join(',')
    )
    .join('\n')
  return `${header}\n${body}`
}

export function ResponseTab({ form }) {
  const { data, isLoading } = useSubmissions(form.id)
  const deleteSubmission = useDeleteSubmission(form.id)
  const [confirming, setConfirming] = useState(null)

  const inputBlocks = useMemo(
    () => (form.blocks || []).filter((b) => b.type.endsWith('-input')),
    [form.blocks]
  )

  const columns = useMemo(() => {
    const counters = {}
    return inputBlocks.map((b) => {
      const t = b.type
      counters[t] = (counters[t] || 0) + 1
      return { id: b.id, type: b.type, label: columnLabel(b, counters[t] - 1) }
    })
  }, [inputBlocks])

  const stats = data?.form || { views: 0, starts: 0, submissionCount: 0 }
  const submissions = data?.submissions || []
  const completionRate = stats.starts > 0
    ? Math.round((stats.submissionCount / stats.starts) * 100)
    : 0

  const handleExport = () => {
    if (submissions.length === 0) {
      toast.error('Nothing to export yet')
      return
    }
    const csv = toCSV(columns, submissions)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${form.name || 'responses'}.csv`
    link.click()
    URL.revokeObjectURL(url)
    toast.success('CSV downloaded')
  }

  const handleDeleteSubmission = () => {
    if (!confirming) return
    deleteSubmission.mutate(confirming, { onSuccess: () => setConfirming(null) })
  }

  return (
    <div className="app-bg flex-1 overflow-y-auto p-6 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Views" value={stats.views} />
          <StatCard label="Starts" value={stats.starts} />
          <StatCard label="Completion rate" value={`${completionRate}%`} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold app-text">Submissions</h3>
          <button
            type="button"
            onClick={handleExport}
            disabled={submissions.length === 0}
            className="inline-flex items-center gap-1.5 rounded-md bg-[#1A5FFF] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#1653DD] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
        </div>

        {columns.length === 0 ? (
          <div
            className="rounded-lg border p-8 text-center text-sm app-surface app-text-muted"
            style={{ borderColor: 'var(--app-border)' }}
          >
            Add input blocks in the <strong className="app-text">Flow</strong> tab to
            start collecting responses. Columns and rows will appear here.
          </div>
        ) : (
          <div
            className="overflow-hidden rounded-lg border app-surface"
            style={{ borderColor: 'var(--app-border)' }}
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-max text-left text-sm">
                <thead>
                  <tr
                    className="border-b app-text-muted"
                    style={{ borderColor: 'var(--app-border)' }}
                  >
                    <th className="w-10 px-3 py-2.5 text-xs font-semibold">#</th>
                    <th className="px-3 py-2.5 text-xs font-semibold">Submitted at</th>
                    {columns.map((c) => (
                      <th
                        key={c.id}
                        className="px-3 py-2.5 text-xs font-semibold whitespace-nowrap"
                      >
                        {c.label}
                      </th>
                    ))}
                    <th className="w-10 px-3 py-2.5" aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={columns.length + 3} className="px-3 py-10 text-center text-sm app-text-muted">
                        Loading responses…
                      </td>
                    </tr>
                  ) : submissions.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + 3} className="px-3 py-10 text-center text-sm app-text-muted">
                        No responses yet. Share the form link to collect responses.
                      </td>
                    </tr>
                  ) : (
                    submissions.map((sub, i) => (
                      <tr
                        key={sub.id}
                        className="border-t app-text hover:opacity-90"
                        style={{ borderColor: 'var(--app-border)' }}
                      >
                        <td className="px-3 py-3 text-xs app-text-muted">{i + 1}</td>
                        <td className="px-3 py-3 text-xs app-text-muted whitespace-nowrap">
                          {formatDate(sub.submittedAt)}
                        </td>
                        {columns.map((c) => (
                          <td
                            key={c.id}
                            className="max-w-[240px] truncate px-3 py-3 text-sm"
                            title={String(sub.values?.[c.id] ?? '')}
                          >
                            {sub.values?.[c.id] ?? <span className="app-text-dim">—</span>}
                          </td>
                        ))}
                        <td className="px-3 py-3">
                          <button
                            type="button"
                            onClick={() => setConfirming(sub.id)}
                            aria-label="Delete response"
                            className="grid h-7 w-7 place-items-center rounded text-[#F55050] transition hover:bg-[#F55050]/15"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!confirming}
        onClose={() => setConfirming(null)}
        onConfirm={handleDeleteSubmission}
        title="Delete response?"
        message="This response will be permanently deleted. This cannot be undone."
        confirmLabel="Delete"
      />
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div
      className="rounded-xl border p-5 app-surface"
      style={{ borderColor: 'var(--app-border)' }}
    >
      <div className="text-sm font-medium app-text">{label}</div>
      <div className="mt-1 text-3xl font-bold app-text">{value}</div>
    </div>
  )
}
