import * as z from 'zod';

export const TaskFormSchema = z.object({
    title: z.string().min(1, { message: "Title must have at least 1 character" }).max(100, { message: "Title must be at most 100 characters" }),
    description: z.string().max(500, { message: "Description must be at most 500 characters" }).optional(),
});