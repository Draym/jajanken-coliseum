import * as Ably from 'ably'
import {NextResponse} from 'next/server'
import {isAddress} from 'viem'
import {ARENA_CHAT_CHANNEL} from '@/lib/chat/constants'

export const runtime = 'nodejs'

function getApiKey() {
    return process.env.ABLY_API_KEY?.trim() || null
}

export async function GET(request: Request) {
    const apiKey = getApiKey()
    if (!apiKey) {
        return NextResponse.json({error: 'Chat is not configured'}, {status: 503})
    }

    const {searchParams} = new URL(request.url)
    const clientId = searchParams.get('clientId')?.trim()

    if (!clientId || !isAddress(clientId)) {
        return NextResponse.json({error: 'Valid wallet clientId is required'}, {status: 400})
    }

    try {
        const rest = new Ably.Rest({key: apiKey})
        const tokenRequest = await rest.auth.createTokenRequest({
            clientId,
            capability: {
                [ARENA_CHAT_CHANNEL]: ['publish', 'subscribe', 'history', 'presence'],
            },
        })

        return NextResponse.json(tokenRequest)
    } catch (error) {
        console.error('[chat] failed to create Ably token request', error)
        return NextResponse.json({error: 'Failed to authorize chat'}, {status: 500})
    }
}
