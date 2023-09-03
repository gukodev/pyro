import 'dotenv/config'
import fs from 'fs'
import path from 'path'

const config = {
    useRelativeUrls: true,
    baseUrl: undefined,
    sitemapDir: 'public',
    filenameFormat: 'sitemap_{i}.xml', // {i} is replaced with the index of the sitemap
    hexPercentage: 100,
    itemsPerSitemap: 25000,
    shuffleHex: true,
    minify: true,
}

const SITEMAP_DIR = path.join(process.cwd(), config.sitemapDir)

if (!config.useRelativeUrls && !config.baseUrl) {
    console.error('BASE_URL is required when using relative urls')
    process.exit(1)
}

const BASE_URL = config.useRelativeUrls ? '' : config.baseUrl

const header = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`.trim()

const entry = (hex: string) =>
    `
  <url>
    <loc>${BASE_URL}/${hex}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`.trim()

const footer = `
</urlset>
`.trim()

const getChunks = (arr: string[], size: number) => {
    const chunks = []
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size))
    }
    return chunks
}

const minifyXml = (xml: string) => {
    if (!config.minify) return xml
    return xml.replace(/\n/g, '').replace(/>\s+</g, '><').trim()
}

const generateMainSitemap = (length: number) => {
    const header = `
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`.trim()
    const footer = `
</sitemapindex>
`.trim()

    const entries = Array.from({ length }, (_, i) => {
        return `
<sitemap>
  <loc>${BASE_URL}/${config.filenameFormat.replace('{i}', i.toString())}</loc>
</sitemap>
    `.trim()
    })

    const xml = [header, ...entries, footer].join('\n')
    return minifyXml(xml)
}

const exportSitemap = (xml: string, name: string) => {
    if (!fs.existsSync(SITEMAP_DIR)) {
        fs.mkdirSync(SITEMAP_DIR)
    }
    const filePath = path.join(SITEMAP_DIR, name)
    fs.writeFileSync(filePath, xml, 'utf8')
}

const shuffle = (arr: string[]) => {
    const newArr = [...arr]
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[newArr[i], newArr[j]] = [newArr[j], newArr[i]]
    }
    return newArr
}

const main = async () => {
    console.log(
        'Config:',
        Object.entries(config)
            .map(([k, v]) => `${k}=${v}`)
            .join(', ')
    )

    console.log('Getting hex colors...')
    const hexLen = Math.floor((config.hexPercentage / 100) * 16777216)
    let allHexColors = Array.from({ length: hexLen }, (_, i) => i.toString(16).padStart(6, '0'))

    if (config.shuffleHex) {
        console.log('Shuffling hex colors...')
        allHexColors = shuffle(allHexColors)
    }

    console.log('Getting chunks...')
    const chunks = getChunks(allHexColors, config.itemsPerSitemap)
    console.log(`Got ${chunks.length} chunks`)

    console.log('Generating main sitemap...')
    const mainSitemap = generateMainSitemap(chunks.length)
    exportSitemap(mainSitemap, 'sitemap.xml')

    console.log('Generating sitemaps...')
    let ci = 0
    for (const chunk of chunks) {
        const entries = []
        for (const hex of chunk) {
            entries.push(entry(hex))
        }

        const xml = [header, ...entries, footer].join('\n')
        const name = config.filenameFormat.replace('{i}', ci.toString())
        const minifiedXml = minifyXml(xml)
        exportSitemap(minifiedXml, name)

        ci += 1
        console.log(`Generated ${name} (${ci}/${chunks.length})`)
    }
}

main()
