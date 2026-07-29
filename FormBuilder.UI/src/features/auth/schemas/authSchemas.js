import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Enter a valid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' }),
})

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, { message: 'Username is required' })
      .min(3, { message: 'Minimum 3 characters' })
      .max(30, { message: 'Maximum 30 characters' })
      .regex(/^[a-zA-Z0-9_.-]+$/, {
        message: 'Only letters, numbers, dot, dash, underscore',
      }),
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Enter a valid email address' }),
    password: z
      .string()
      .min(1, { message: 'Password is required' })
      .min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'enter same password in both fields',
    path: ['confirmPassword'],
  })
