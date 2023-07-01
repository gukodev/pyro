import { getTodayDate } from '@/util/date'
import { createCacheFile, getCacheFile, getColorNames } from '@/util/file'
import fs from 'fs'
import { NextResponse } from 'next/server'

interface CachedFile {
    hex: string
    name: string
    generatedAt: string
}

export async function GET(req: Request) {
    // const start = new Date()

    const date = getTodayDate()
    const unixTs = Math.floor(date.getTime() / 1000)

    const cachedFile = getCacheFile(`daily-color-${unixTs}.json`)
    const refreshAt = unixTs + 86400

    if (fs.existsSync(cachedFile)) {
        const { hex, name } = JSON.parse(fs.readFileSync(cachedFile, 'utf-8')) as CachedFile

        // const end = new Date()
        // console.log(`[cached] ${end.getTime() - start.getTime()}ms`)

        return NextResponse.json({
            hex,
            name,
            refreshAt,
        })
    }

    const colorNames = Object.entries(getColorNames())

    const rndIndex = unixTs % colorNames.length
    const [hex, name] = colorNames[rndIndex]

    const data: CachedFile = {
        hex: `#${hex}`,
        name,
        generatedAt: new Date().toISOString(),
    }

    try {
        createCacheFile(`daily-color-${unixTs}.json`, JSON.stringify(data))
    } catch (err) {
        console.log('Could not create daily color cache file')
        console.log(err)
    }

    // const end = new Date()
    // console.log(`[read] ${end.getTime() - start.getTime()}ms`)

    return NextResponse.json(data)
}
