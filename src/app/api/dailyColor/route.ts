import { getDailyColor } from '@/util/color'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    const dailyColor = getDailyColor()
    return NextResponse.json(dailyColor)
}
