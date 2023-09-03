import ColorInfo from '@/core/ColorInfo'
import { formatQuery } from '@/util/format'
import { NextRequest, NextResponse } from 'next/server'

interface Context {
    params: {
        query: string
    }
}

export async function GET(req: NextRequest, { params }: Context) {
    const { query } = params

    try {
        const formattedQuery = formatQuery(query)
        if (!formattedQuery) return NextResponse.json({ error: true }, { status: 400 })

        const suggestions = new ColorInfo().getSuggestions(formattedQuery)

        return NextResponse.json({
            query,
            suggestions: suggestions,
        })
    } catch (err) {
        return NextResponse.json(
            {
                error: true,
            },
            {
                status: 500,
            }
        )
    }
}
