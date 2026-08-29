export type ArenaChatMessage = {
    id: string
    clientId: string
    text: string
    timestamp: number
}

export type ArenaChatConnectionStatus =
    | 'idle'
    | 'connecting'
    | 'connected'
    | 'disconnected'
    | 'failed'
    | 'unavailable'

export type ArenaChatPublishInput = {
    text: string
}
