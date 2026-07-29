import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { loginSchema } from '../schemas/authSchemas.js'
import { useLogin } from '../hooks/useAuth.js'
import { PasswordInput } from './PasswordInput.jsx'

const baseInput =
  'w-full h-10 rounded-xl bg-transparent border border-white/50 px-4 text-sm text-white placeholder:text-[#636364] outline-none transition focus:border-white/80 focus:ring-2 focus:ring-white/10 shadow-[0_4px_10px_rgba(0,0,0,0.25)]'

const errorInput =
  'border-[#FF2727]/60 focus:border-[#FF2727] focus:ring-[#FF2727]/10'

export function LoginForm() {
  const { mutate: login, isPending } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (values) => {
    login(values)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-semibold text-white">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          className={`${baseInput} ${errors.email ? errorInput : ''}`}
          {...register('email')}
        />
        {errors.email && (
          <p className="text-xs text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-semibold text-white">
          Password
        </label>
        <PasswordInput
          id="password"
          placeholder="**********"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          className={baseInput}
          errorClassName={errorInput}
          hasError={!!errors.password}
          {...register('password')}
        />
        {errors.password && (
          <p className="text-xs text-red-400">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1A5FFF] text-sm font-semibold text-white shadow-[0_4px_10px_rgba(26,95,255,0.35)] transition hover:bg-[#1653DD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A5FFF]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#18181B] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
            <path
              fill="currentColor"
              className="opacity-75"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        )}
        {isPending ? 'Logging in...' : 'Log In'}
      </button>

      <p className="text-center text-sm text-white">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-medium text-[#1A5FFF] hover:underline">
          Register now
        </Link>
      </p>
    </form>
  )
}
