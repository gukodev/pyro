import fs from 'fs'
import path from 'path'

export const CACHE_DIR = path.resolve('.cache')

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
