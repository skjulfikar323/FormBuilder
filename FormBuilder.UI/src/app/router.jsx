import { Route, Routes } from 'react-router-dom'
import { LandingPage } from '@features/landing/pages/LandingPage.jsx'
import { LoginPage } from '@features/auth/pages/LoginPage.jsx'
import { RegisterPage } from '@features/auth/pages/RegisterPage.jsx'
import { DashboardHome } from '@features/dashboard/pages/DashboardHome.jsx'
import { DashboardLayout } from '@shared/components/layout/DashboardLayout.jsx'
import { FormBuilderPage } from '@features/form-builder/pages/FormBuilderPage.jsx'
import { SettingsPage } from '@features/settings/pages/SettingsPage.jsx'
import { PublicFormPage } from '@features/public-form/pages/PublicFormPage.jsx'
import {
  ProtectedRoute,
  PublicOnlyRoute,
} from '@features/auth/components/ProtectedRoute.jsx'

function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-background p-6 text-center">
      <div>
        <div className="text-6xl font-bold text-primary">404</div>
        <p className="mt-2 text-muted-foreground">Page not found.</p>
        <a href="/" className="mt-4 inline-block text-sm text-primary hover:underline">
          &larr; Back home
        </a>
      </div>
    </div>
  )
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/f/:formId" element={<PublicFormPage />} />

      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route
        path="/dashboard/forms/:formId"
        element={
          <ProtectedRoute>
            <FormBuilderPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
