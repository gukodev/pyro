import { z } from 'zod'

export const ErrorReportBodySchema = z.object({
    error: z.object({
        name: z.string(),
        message: z.string(),
        stack: z.string(),
    }),
    info: z.object({
        userAgent: z.string(),
        url: z.string(),
        referrer: z.string().optional(),
        timestamp: z.number(),
        isoDate: z.string(),
    }),
    message: z.string().max(1024).optional(),
})

export type ErrorReportBody = z.infer<typeof ErrorReportBodySchema>
