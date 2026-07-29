import { Outlet } from 'react-router-dom'
import { WorkspaceHeader } from '@features/dashboard/components/WorkspaceHeader.jsx'

export function DashboardLayout() {
  return (
    <div className="app-bg app-text min-h-screen">
      <WorkspaceHeader />
      <main className="mx-auto max-w-7xl px-5 py-6 md:px-10 md:py-8">
        <Outlet />
      </main>
    </div>
  )
}
