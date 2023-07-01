import fs from 'fs'
import path from 'path'

export const CACHE_DIR = path.resolve('.cache')
export const COLORNAMES = path.resolve('src/assets/data/colornames.min.json')

export interface ColorNames {
    [hex: string]: string
}

export function ensureCacheDir() {
    if (!fs.existsSync(CACHE_DIR)) {
        fs.mkdirSync(CACHE_DIR, { recursive: true })
    }
}

export function getCacheFile(name: string) {
    return path.resolve(CACHE_DIR, name)
}

export function createCacheFile(name: string, data: string) {
    ensureCacheDir()
    const cacheFile = path.resolve(CACHE_DIR, name)
    fs.writeFileSync(cacheFile, data, { encoding: 'utf-8' })
}

export function getColorNames(): ColorNames {
    return JSON.parse(fs.readFileSync(COLORNAMES, 'utf-8'))
}
