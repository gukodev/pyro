import { NextRequest, NextResponse } from 'next/server'

export interface RateLimit {
    ip: string
    lastRequest: number
    tooManyRequests?: boolean
    requests?: number
}

export interface RateLimitOptions {
    interval: number
    maxRequests: number
    maxRequestsInterval: number
}

const defaultOptions: RateLimitOptions = {
    interval: 1000 * 60,
    maxRequests: 60,
    maxRequestsInterval: 1000 * 60 * 60 * 24,
}

type RateLimitMap = Map<string, RateLimit>

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

export const makeRateLimitMap = () => new Map<string, RateLimit>()

export const hasRateLimit = (
    req: NextRequest,
    rateLimitMap: RateLimitMap,
    rateLimitOptions: RateLimitOptions = defaultOptions
): [boolean, NextResponse<any> | null] => {
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

    const rateLimit = rateLimitMap.get(ip)
    console.log(`[rate-limit] has rate limit obj: ${!!rateLimit}`)

    if (rateLimit) {
        const rateLimited = rateLimit.lastRequest + rateLimitOptions.interval > Date.now()

        if (rateLimit.tooManyRequests) {
            const rateLimitedTooManyRequests =
                rateLimit.lastRequest + rateLimitOptions.maxRequestsInterval > Date.now()
            if (rateLimitedTooManyRequests) {
                console.log(`[rate-limit] rate limited too many requests`)
                return [
                    true,
                    NextResponse.json(
                        {
                            ratelimited: true,
                        },
                        {
                            status: 429,
                        }
                    ),
                ]
            }

            rateLimit.tooManyRequests = false
            rateLimit.lastRequest = Date.now()
            rateLimit.requests = 1
        } else {
            if (rateLimited) {
                console.log(`[rate-limit] rate limited`)
                rateLimit.requests = rateLimit.requests ? rateLimit.requests + 1 : 1

                if (rateLimit.requests > rateLimitOptions.maxRequests) {
                    rateLimit.tooManyRequests = true
                    rateLimit.lastRequest = Date.now()
                    return [
                        true,
                        NextResponse.json(
                            {
                                ratelimited: true,
                            },
                            {
                                status: 429,
                            }
                        ),
                    ]
                }

                return [
                    true,
                    NextResponse.json(
                        {
                            ratelimited: true,
                        },
                        {
                            status: 429,
                        }
                    ),
                ]
            }

            console.log(`[rate-limit] not rate limited`)
            rateLimit.lastRequest = Date.now()
            rateLimit.requests = 1
        }

        return [false, null]
    }

    console.log(`[rate-limit] creating rate limit obj`)
    rateLimitMap.set(ip, {
        ip,
        lastRequest: Date.now(),
        requests: 1,
    })

    return [false, null]
}
