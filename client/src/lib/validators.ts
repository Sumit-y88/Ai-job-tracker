import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const jobSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  jobDescription: z
    .string()
    .min(50, 'Please enter a full job description (at least 50 characters)'),
  applicationUrl: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  appliedAt: z.string().optional(),
  status: z
    .enum(['saved', 'applied', 'interviewing', 'offered', 'rejected'])
    .default('saved'),
  notes: z.string().optional(),
})

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
})

export const resumeSchema = z.object({
  resumeText: z.string().max(8000, 'Resume must be under 8000 characters'),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type JobFormData = z.infer<typeof jobSchema>
export type ProfileFormData = z.infer<typeof profileSchema>
export type ResumeFormData = z.infer<typeof resumeSchema>
