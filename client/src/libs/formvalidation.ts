import { z } from "zod";

export const createTaskSchema = z.object({
    title: z.string()
        .min(5, { message: "Title must be at least 5 characters long" })
        .max(50, { message: "Title should not be greater than 50 characters" }),
    description: z.string()
        .min(10, { message: "Description must be at least 10 characters long" })
        .max(200, { message: "Description should not be greater than 200 characters" }),
    tag: z.enum(["Urgent", "Important", "urgent", "important"], {
        message: "Tag is required"
    }),
});
export type CreateTaskType = z.infer<typeof createTaskSchema>;

export const loginSchema = z.object({
    email: z.string({
        message: "Please enter a valid email"
    })
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email address" }),
    password: z.string()
        .min(6, { message: "Password must be at least 6 characters long" })
});

export type LoginType = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    username: z.string()
        .min(1, { message: "Username is required" }),
    email: z.string({
        message:"Please enter a valid email"
    })
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email address" }),
    password: z.string()
        .min(6, { message: "Password must be at least 6 characters long" })
});
export type RegisterType = z.infer<typeof registerSchema>;