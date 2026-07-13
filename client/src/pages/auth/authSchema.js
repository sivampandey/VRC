import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email or Phone is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  signUpMethod: z.enum(['email', 'phone']),
  email: z.string().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .refine((val) => /[A-Z]/.test(val), { message: 'Must contain an uppercase letter' })
    .refine((val) => /[a-z]/.test(val), { message: 'Must contain a lowercase letter' })
    .refine((val) => /[0-9]/.test(val), { message: 'Must contain a number' })
    .refine((val) => /[^A-Za-z0-9]/.test(val), { message: 'Must contain a special character' }),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms and conditions' }),
  }),
}).superRefine((data, ctx) => {
  if (data.signUpMethod === 'email') {
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A valid email address is required',
        path: ['email'],
      });
    }
  } else if (data.signUpMethod === 'phone') {
    if (!data.phone || data.phone.trim().length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A valid phone number is required',
        path: ['phone'],
      });
    }
  }

  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    });
  }
});
