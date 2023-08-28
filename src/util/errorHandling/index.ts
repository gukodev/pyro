import axios from 'axios'
import { ErrorReportBody } from './types'

interface DiscordEmbed {
    title: string
    description?: string
    color?: number
    fields: {
        name: string
        value: any
        inline?: boolean
    }[]
    timestamp?: string
}

const labels = {
    userAgent: 'User Agent',
    url: 'URL',
    referrer: 'Referrer',
    timestamp: 'Timestamp',
    isoDate: 'ISO Date',
}

export async function sendErrorReport(
    webhookUrl: string,
    errorReport: ErrorReportBody
): Promise<void> {
    const { error, info, message } = errorReport

    const errorFields = [
        {
            name: 'Mensagem',
            value: '```' + error.message + '```',
        },
        {
            name: 'Stack',
            value: '```' + error.stack + '```',
        },
    ]

    if (message) {
        errorFields.push({
            name: 'Mensagem adicional',
            value: '```' + message + '```',
        })
    }

    const infoFields = Object.entries(info)
        .map((x) => {
            if (x[1].toString().length === 0) return null
            return {
                name: labels[x[0] as keyof typeof labels],
                value: x[1],
            }
        })
        .filter((x) => x !== null) as DiscordEmbed['fields']

    const embed: DiscordEmbed = {
        title: error.name,
        fields: [...errorFields, ...infoFields],
        color: 0xef4444,
        timestamp: info.isoDate,
    }

    try {
        await axios.post(webhookUrl, { embeds: [embed] })
        console.log('[Error Report] Um erro foi reportado com sucesso.')
    } catch (err) {
        console.error('[Error Report] Não foi possível reportar um erro:', err)
    }
}
