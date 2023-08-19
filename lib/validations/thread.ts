import * as z from 'zod';

// used for form validation inputs
export const ThreadValidation = z.object({
    // image: z.string().url(),
    text: z.string().nonempty().min(3, {message: "Minimum 3 characters"}).max(400, {message: "Maximum 400 characters"}),
    accountId: z.string().min(3).max(400),
})

export const CommentValidation = z.object({
    // image: z.string().url(),
    text: z.string().nonempty().min(3, {message: "Minimum 3 characters"}).max(400, {message: "Maximum 400 characters"}),
    // accountId: z.string().min(3).max(400),
})