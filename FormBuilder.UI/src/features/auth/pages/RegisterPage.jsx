import { AuthLayout } from '@shared/components/layout/AuthLayout.jsx'
import { RegisterForm } from '../components/RegisterForm.jsx'

export function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  )
}
