import { ImageResponse } from 'next/server'

export const runtime = 'edge'

export const size = {
    width: 32,
    height: 32,
}
export const contentType = 'image/png'

export default function Icon({ params }: { params: { color: string } }) {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div
                    style={{
                        backgroundColor: `#${params.color || 'ef4444'}`,
                        width: '32px',
                        height: '32px',
                        borderRadius: '33.33%',
                    }}
                />
            </div>
        ),
        {
            ...size,
        }
    )
}
