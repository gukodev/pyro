import dayjs from 'dayjs'
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
        req.headers.get('x-real-ip') ||
        req.headers.get('x-forwarded-for') ||
        req.headers.get('cf-connecting-ip') ||
        req.headers.get('x-client-ip') ||
        req.headers.get('x-cluster-client-ip') ||
        req.headers.get('x-forwarded') ||
        req.headers.get('forwarded-for') ||
        req.headers.get('forwarded')
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

    const rateLimitObj = rateLimitMap.get(ip)
    console.log(`[rate-limit] has rate limit obj: ${!!rateLimitObj}`)

    if (rateLimitObj) {
        const now = Date.now()
        const rateLimited = rateLimitObj.lastRequest + rateLimitOptions.interval > now
        const wait = rateLimitObj.lastRequest + rateLimitOptions.interval - now

        const formatted = dayjs(wait).format('mm:ss')

        console.log(`[rate-limit] rate limited: ${rateLimited}`)
        console.log(`[rate-limit] wait: ${formatted}`)

        if (rateLimitObj.tooManyRequests) {
            const rateLimitedTooManyRequests =
                rateLimitObj.lastRequest + rateLimitOptions.maxRequestsInterval > Date.now()

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

            rateLimitObj.tooManyRequests = false
            rateLimitObj.lastRequest = Date.now()
            rateLimitObj.requests = 1
        } else {
            if (rateLimited) {
                console.log(`[rate-limit] rate limited`)
                rateLimitObj.requests = rateLimitObj.requests ? rateLimitObj.requests + 1 : 1

                if (rateLimitObj.requests > rateLimitOptions.maxRequests) {
                    rateLimitObj.tooManyRequests = true
                    rateLimitObj.lastRequest = Date.now()
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
            rateLimitObj.lastRequest = Date.now()
            rateLimitObj.requests = 1
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
