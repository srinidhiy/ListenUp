import * as z from 'zod';

// used for form validation inputs
export const ThreadValidation = z.object({
    // image: z.string().url(),
    text: z.string().nonempty().min(3, {message: "Minimum 3 characters"}).max(400, {message: "Maximum 400 characters"}),
    accountId: z.string().min(3).max(400),
    albumId: z.string().min(3).max(400),
    rating: z.number().min(0).max(5),
    // album_name: z.string().min(1).max(400),
    // album_artist: z.string().min(1).max(400),
    // album_image: z.string().min(3).max(400),
})

export const CommentValidation = z.object({
    // image: z.string().url(),
    text: z.string().nonempty().min(3, {message: "Minimum 3 characters"}).max(400, {message: "Maximum 400 characters"}),
    // accountId: z.string().min(3).max(400),
})