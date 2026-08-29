/** Single global Arena room — lobby and match share this channel. */
export const ARENA_CHAT_CHANNEL = 'arena:global'

export const ARENA_CHAT_EVENT = 'message'

export const ARENA_CHAT_HISTORY_LIMIT = 40

/** New connections only load messages newer than this window. */
export const ARENA_CHAT_HISTORY_WINDOW_MS = 10 * 60 * 1000

export const ARENA_CHAT_MAX_LENGTH = 280

export const ARENA_CHAT_TOKEN_PATH = '/api/chat/token'
