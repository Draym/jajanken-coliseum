export type ColiseumChainAction =
    | 'join_arena'
    | 'join_match'
    | 'play_match'
    | 'reveal_match'
    | 'skip_afk_play'
    | 'skip_afk_reveal'
    | 'forfeit_match'
    | 'withdraw_gains'

export type ColiseumChainPhase = 'idle' | 'signing' | 'confirming' | 'syncing' | 'settling'

export type ColiseumMatchmakingPhase = 'idle' | 'searching' | 'matched'

export type MatchUiPhase =
    | 'select'
    | 'commit_pending'
    | 'waiting_commit'
    | 'reveal_ready'
    | 'reveal_pending'
    | 'waiting_reveal'
    | 'reveal_blocked'
    | 'resolution'
    | 'post_match'
