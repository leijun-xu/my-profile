import { z } from "zod";

export const signInSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    firstName: z.string().regex(/^[a-zA-Z\u4e00-\u9fa5]+$/, 'input English or Chinese characters only')
        .min(1, 'can input 1-6 characters only')
        .max(6, 'can input 1-6 characters only'),
    lastName: z.string().regex(/^[a-zA-Z\u4e00-\u9fa5]+$/, 'input English or Chinese characters only')
        .min(1, 'can input 1-6 characters only')
        .max(6, 'can input 1-6 characters only')
})

// 导出类型
export type UserForm = z.infer<typeof signInSchema>;
