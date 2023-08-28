import { sendErrorReport } from '@/util/errorHandling'
import { ErrorReportBodySchema } from '@/util/errorHandling/types'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface RateLimit {
    ip: string
    lastRequest: number
}

const rateLimits = new Map<string, RateLimit>()

const getIp = (req: NextRequest) => {
    const ip =
        req.headers.get('cf-connecting-ip') ||
        req.headers.get('x-forwarded-for') ||
        req.headers.get('x-real-ip') ||
        req.headers.get('x-client-ip') ||
        req.headers.get('x-cluster-client-ip') ||
        req.headers.get('x-forwarded') ||
        req.headers.get('forwarded-for') ||
        req.headers.get('forwarded')
    const hedars = req.headers.entries()
    console.log('[getIp]', ip)
    console.log(Object.fromEntries(hedars))
    return ip
}

const hasRateLimit = (req: NextRequest): [boolean, NextResponse<any> | null] => {
    if (process.env.NODE_ENV === 'development') return [false, null]

    const ip = getIp(req)
    console.log(`[rate-limit] ${ip}`)

    if (!ip)
        return [
            false,
            NextResponse.json(
                {
                    error: true,
                    message: 'No ip provided',
                },
                {
                    status: 400,
                }
            ),
        ]

    const rateLimit = rateLimits.get(ip)
    console.log(`[rate-limit] has rate limit obj: ${!!rateLimit}`)

    if (rateLimit) {
        const rateLimited = rateLimit.lastRequest + 1000 * 60 > Date.now()

        if (rateLimited) {
            console.log(`[rate-limit] rate limited`)
            return [
                true,
                NextResponse.json(
                    {
                        error: true,
                        message: 'Rate limited',
                    },
                    {
                        status: 429,
                    }
                ),
            ]
        }

        console.log(`[rate-limit] not rate limited`)
        rateLimit.lastRequest = Date.now()
        return [false, null]
    }

    console.log(`[rate-limit] creating rate limit obj`)
    rateLimits.set(ip, {
        ip,
        lastRequest: Date.now(),
    })

    return [false, null]
}

// TODO: Add rate limiting
export async function POST(req: NextRequest) {
    const [rateLimit, response] = hasRateLimit(req)
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
