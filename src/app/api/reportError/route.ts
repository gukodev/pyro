import { sendErrorReport } from '@/util/errorHandling'
import { ErrorReportBodySchema } from '@/util/errorHandling/types'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const maxDuration = 0

// TODO: Add rate limiting
export async function POST(req: Request) {
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
