import ColorInfo from '@/core/ColorInfo'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
    const dailyColor = new ColorInfo().getDailyColor()
    return NextResponse.json(dailyColor)
}
