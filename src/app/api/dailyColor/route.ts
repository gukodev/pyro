import { getDailyColor } from '@/util/color'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
    const dailyColor = getDailyColor()
    return NextResponse.json(dailyColor)
}
