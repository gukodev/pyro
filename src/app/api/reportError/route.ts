import { sendErrorReport } from '@/util/errorHandling'
import { ErrorReportBodySchema } from '@/util/errorHandling/types'
import { hasRateLimit, makeRateLimitMap } from '@/util/ratelimit'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const rateLimitMap = makeRateLimitMap()

// TODO: Add rate limiting
export async function POST(req: NextRequest) {
    const [rateLimit, response] = hasRateLimit(req, rateLimitMap, {
        interval: 1000 * 60,
        maxRequests: 60,
        maxRequestsInterval: 1000 * 60 * 60 * 24,
    })

    if (rateLimit && response) return response

    const body = await req.json()

    const parse = ErrorReportBodySchema.safeParse(body)
    if (!parse.success)
        return NextResponse.json(
            {
                error: true,
                message: 'Invalid request',
            },
            {
                status: 400,
            }
        )

    const { error, info, message } = parse.data

    if (!process.env.DISCORD_WEBHOOK_URL) {
        return NextResponse.json(
            {
                error: true,
                message: 'No webhook url provided',
            },
            {
                status: 500,
            }
        )
    }

    try {
        await sendErrorReport(process.env.DISCORD_WEBHOOK_URL, {
            error,
            info,
            message,
        })

        return NextResponse.json(
            {
                success: true,
                message: 'Report sent successfully',
            },
            {
                status: 200,
            }
        )
    } catch (err) {
        console.error(err)
        return NextResponse.json(
            {
                error: true,
                message: 'Internal server error',
            },
            {
                status: 500,
            }
        )
    }
}
