import { AlertTriangle } from 'lucide-react'
import { Modal } from './Modal.jsx'

const TONES = {
  danger: {
    button: 'bg-[#F55050] hover:bg-[#E44646]',
    iconBg: 'bg-[#F55050]/15 text-[#F55050]',
  },
  warning: {
    button: 'bg-[#FF8B1A] hover:bg-[#E67200]',
    iconBg: 'bg-[#FF8B1A]/15 text-[#FF8B1A]',
  },
  info: {
    button: 'bg-[#1A5FFF] hover:bg-[#1653DD]',
    iconBg: 'bg-[#1A5FFF]/15 text-[#1A5FFF]',
  },
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  tone = 'danger',
}) {
  const t = TONES[tone] || TONES.danger

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="flex items-start gap-3">
        <div
          className={`grid h-10 w-10 flex-shrink-0 place-items-center rounded-full ${t.iconBg}`}
        >
          <AlertTriangle className="h-5 w-5" />
        </div>
        <p className="pt-1.5 text-sm text-white/80">{message}</p>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-white/15 bg-transparent px-4 py-2 text-sm text-white/85 transition hover:bg-white/5"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`rounded-md px-4 py-2 text-sm font-medium text-white transition ${t.button}`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
