import { hasRateLimit, makeRateLimitMap } from '@/util/ratelimit'
import { NextRequest, NextResponse } from 'next/server'

const rateLimitMap = makeRateLimitMap()

export async function GET(req: NextRequest) {
    const [rateLimit, response] = hasRateLimit(req, rateLimitMap, {
        interval: 1000 * 5,
        maxRequests: 10,
        maxRequestsInterval: 1000 * 10,
    })

    let res: any = {
        rateLimited: rateLimit,
        map: Object.fromEntries(rateLimitMap),
        response: (await response?.json()) || null,
    }

    return NextResponse.json({
        body: res,
    })
}
