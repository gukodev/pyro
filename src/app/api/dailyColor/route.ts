import { ColorInfo, getColorInfo, getColorNames } from '@/util/color'
import { getTodayDate } from '@/util/date'
import { createCacheFile, getCacheFile } from '@/util/file'
import fs from 'fs'
import { NextResponse } from 'next/server'

interface CachedFile {
    info: ColorInfo
    generatedAt: string
}

export async function GET(req: Request) {
    // const start = new Date()

    const date = getTodayDate()
    const unixTs = Math.floor(date.getTime() / 1000)

    const cachedFile = getCacheFile(`daily-color-${unixTs}.json`)
    const refreshAt = unixTs + 86400

    if (fs.existsSync(cachedFile)) {
        const { info } = JSON.parse(fs.readFileSync(cachedFile, 'utf-8')) as CachedFile

        // const end = new Date()
        // console.log(`[cached] ${end.getTime() - start.getTime()}ms`)

        return NextResponse.json({
            info,
            refreshAt,
        })
    }

    const colorNames = Object.entries(getColorNames())

    const rndIndex = unixTs % colorNames.length
    const [hex] = colorNames[rndIndex]

    const data: CachedFile = {
        info: getColorInfo(hex),
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

    return NextResponse.json({
        info: data.info,
        refreshAt,
    })
}
