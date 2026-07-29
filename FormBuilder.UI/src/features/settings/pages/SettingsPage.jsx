import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, User, KeyRound, Trash2, Eye, EyeOff, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '@features/auth/store/authStore.js'
import { useLogout } from '@features/auth/hooks/useAuth.js'
import { useFolders } from '@features/dashboard/hooks/useFolders.js'
import { useForms } from '@features/dashboard/hooks/useForms.js'
import { authApi } from '@features/auth/api/authApi.js'
import { errorMessage } from '@config/api.js'
import { ConfirmModal } from '@shared/components/ui/ConfirmModal.jsx'

export function SettingsPage() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const user = useAuthStore((s) => s.user)
  const setSession = useAuthStore((s) => s.setSession)
  const token = useAuthStore((s) => s.token)
  const logout = useLogout()

  const [fullName, setFullName] = useState(user?.fullName || '')
  const [email, setEmail] = useState(user?.email || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [profileSaving, setProfileSaving] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [clearBusy, setClearBusy] = useState(false)
  const [deleteBusy, setDeleteBusy] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [dangerModal, setDangerModal] = useState(null)

  const { data: folders = [] } = useFolders()
  const { data: forms = [] } = useForms()

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    if (!fullName.trim() || !email.trim()) {
      toast.error('Name and email are required')
      return
    }
    setProfileSaving(true)
    try {
      const { data, message } = await authApi.updateProfile({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
      })
      setSession(data, token)
      toast.success(message || 'Profile updated')
    } catch (err) {
      toast.error(errorMessage(err, 'Failed to update profile'))
    } finally {
      setProfileSaving(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (!currentPassword) {
      toast.error('Current password required')
      return
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setPasswordSaving(true)
    try {
      const { message } = await authApi.changePassword({
        currentPassword,
        newPassword: password,
      })
      setCurrentPassword('')
      setPassword('')
      setConfirmPassword('')
      toast.success(message || 'Password changed')
    } catch (err) {
      toast.error(errorMessage(err, 'Failed to change password'))
    } finally {
      setPasswordSaving(false)
    }
  }

  const clearWorkspace = async () => {
    setClearBusy(true)
    try {
      const { message } = await authApi.clearWorkspace()
      qc.invalidateQueries()
      toast.success(message || 'All folders and forms deleted')
      setDangerModal(null)
    } catch (err) {
      toast.error(errorMessage(err, 'Failed to clear workspace'))
    } finally {
      setClearBusy(false)
    }
  }

  const deleteAccount = async () => {
    setDeleteBusy(true)
    try {
      await authApi.deleteAccount()
      toast.success('Account deleted')
      qc.clear()
      logout()
    } catch (err) {
      toast.error(errorMessage(err, 'Failed to delete account'))
    } finally {
      setDeleteBusy(false)
    }
  }

  const inputBase =
    'w-full rounded-lg border border-white/15 bg-[#141416] px-3 py-2 text-sm text-white outline-none transition focus:border-white/40'

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button
        type="button"
        onClick={() => navigate('/dashboard')}
        className="inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to workspace
      </button>

      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-sm text-white/60">
          Manage your account and workspace preferences.
        </p>
      </div>

      <section className="rounded-xl border border-white/10 bg-[#1A1A1D] p-6">
        <div className="mb-5 flex items-center gap-2">
          <User className="h-4 w-4 text-white/70" />
          <h2 className="text-base font-semibold text-white">Profile</h2>
        </div>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/70">Username</label>
            <input
              type="text"
              value={user?.username || ''}
              readOnly
              className="w-full cursor-not-allowed rounded-lg border border-white/10 bg-[#141416] px-3 py-2 text-sm text-white/60"
            />
            <p className="mt-1 text-xs text-white/40">Username cannot be changed.</p>
          </div>
          <div>
            <label htmlFor="fullName" className="mb-1.5 block text-xs font-medium text-white/70">
              Display name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
              className={inputBase}
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-white/70">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputBase}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={profileSaving}
              className="rounded-md bg-[#1A5FFF] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1653DD] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {profileSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-white/10 bg-[#1A1A1D] p-6">
        <div className="mb-5 flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-white/70" />
          <h2 className="text-base font-semibold text-white">Change password</h2>
        </div>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <PasswordField
            id="current-password"
            label="Current password"
            value={currentPassword}
            onChange={setCurrentPassword}
            placeholder="Enter current password"
            show={showCurrent}
            onToggle={() => setShowCurrent((v) => !v)}
          />
          <PasswordField
            id="new-password"
            label="New password"
            value={password}
            onChange={setPassword}
            placeholder="At least 8 characters"
            show={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
          />
          <PasswordField
            id="confirm-password"
            label="Confirm new password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Repeat password"
            show={showConfirm}
            onToggle={() => setShowConfirm((v) => !v)}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={passwordSaving || !currentPassword || !password || !confirmPassword}
              className="rounded-md bg-[#1A5FFF] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1653DD] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {passwordSaving ? 'Updating...' : 'Save'}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-white/10 bg-[#1A1A1D] p-6">
        <h2 className="mb-2 text-base font-semibold text-white">Workspace</h2>
        <p className="mb-4 text-sm text-white/60">
          You have <strong className="text-white">{folders.length}</strong> folder
          {folders.length === 1 ? '' : 's'} and{' '}
          <strong className="text-white">{forms.length}</strong> form
          {forms.length === 1 ? '' : 's'}.
        </p>
        <button
          type="button"
          onClick={() => setDangerModal('clear')}
          disabled={forms.length === 0 && folders.length === 0}
          className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-transparent px-3 py-1.5 text-sm text-white/85 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Trash2 className="h-4 w-4" />
          Clear all folders and forms
        </button>
      </section>

      <section className="rounded-xl border border-white/10 bg-[#1A1A1D] p-6">
        <div className="mb-3 flex items-center gap-2">
          <LogOut className="h-4 w-4 text-[#FF8B1A]" />
          <h2 className="text-base font-semibold text-white">Log out</h2>
        </div>
        <p className="mb-4 text-sm text-white/60">
          Sign out of your account on this device. Your workspace data stays saved.
        </p>
        <button
          type="button"
          onClick={() => setDangerModal('logout')}
          className="inline-flex items-center gap-2 rounded-md bg-[#FF8B1A] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#E67200]"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </section>

      <section className="rounded-xl border border-[#F55050]/40 bg-[#F55050]/5 p-6">
        <h2 className="mb-2 text-base font-semibold text-[#F55050]">Danger zone</h2>
        <p className="mb-4 text-sm text-white/70">
          Deleting your account will remove all your folders, forms and submissions permanently.
        </p>
        <button
          type="button"
          onClick={() => setDangerModal('delete-account')}
          className="rounded-md bg-[#F55050] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#E44646]"
        >
          Delete account
        </button>
      </section>

      <ConfirmModal
        open={dangerModal === 'logout'}
        onClose={() => setDangerModal(null)}
        onConfirm={() => {
          setDangerModal(null)
          logout()
        }}
        title="Log out?"
        message="You'll be signed out of your account. Your workspace data will stay saved and available when you log back in."
        confirmLabel="Log out"
        tone="warning"
      />

      <ConfirmModal
        open={dangerModal === 'clear'}
        onClose={() => setDangerModal(null)}
        onConfirm={clearWorkspace}
        title="Clear workspace?"
        message="All folders and forms will be permanently deleted. This cannot be undone."
        confirmLabel={clearBusy ? 'Clearing…' : 'Clear all'}
      />

      <ConfirmModal
        open={dangerModal === 'delete-account'}
        onClose={() => setDangerModal(null)}
        onConfirm={deleteAccount}
        title="Delete account?"
        message="Your account and all data will be permanently removed. You'll be logged out immediately. This cannot be undone."
        confirmLabel={deleteBusy ? 'Deleting…' : 'Delete account'}
      />
    </div>
  )
}

function PasswordField({ id, label, value, onChange, placeholder, show, onToggle }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-white/70">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-white/15 bg-[#141416] px-3 py-2 pr-10 text-sm text-white outline-none transition focus:border-white/40"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? 'Hide password' : 'Show password'}
          tabIndex={-1}
          className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded text-white/50 transition hover:bg-white/5 hover:text-white/85"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}
