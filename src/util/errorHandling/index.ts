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
            value: '```\n' + error.message.slice(0, 1000) + '\n```',
        },
        {
            name: 'Stack',
            value: '```\n' + error.stack.slice(0, 1000) + '\n```',
        },
    ]

    if (message) {
        errorFields.push({
            name: 'Mensagem adicional',
            value: '```\n' + message.slice(0, 1000) + '\n```',
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

    console.log('data', embed)

    return axios.post(webhookUrl, {
        embeds: [embed],
    })
}
