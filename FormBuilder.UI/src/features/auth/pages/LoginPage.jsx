import { AuthLayout } from '@shared/components/layout/AuthLayout.jsx'
import { LoginForm } from '../components/LoginForm.jsx'

export function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  )
}
