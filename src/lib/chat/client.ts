import * as Ably from 'ably'
import {ARENA_CHAT_TOKEN_PATH} from '@/lib/chat/constants'

export function createArenaChatRealtime(clientId: string): Ably.Realtime {
    return new Ably.Realtime({
        clientId,
        authUrl: `${ARENA_CHAT_TOKEN_PATH}?clientId=${encodeURIComponent(clientId)}`,
        autoConnect: true,
        closeOnUnload: true,
        disconnectedRetryTimeout: 5_000,
        suspendedRetryTimeout: 10_000,
    })
}

export function getArenaChatChannel(realtime: Ably.Realtime, channelName: string) {
    return realtime.channels.get(channelName, {
        params: {rewind: '0'},
    })
}
