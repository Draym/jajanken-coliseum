'use client'

import {useEffect, useState} from 'react'
import {useColiseumPlayer} from '@/contexts/coliseum-player-context'
import {
    clearAwaitingArenaSync,
    isAwaitingArenaSync,
    pollUntilPlayerInArena,
} from '@/lib/coliseum-player-sync'

export function useAwaitingArenaEntrySync(isPlayerInArena: boolean) {
    const {refetchPlayer, refetchProfile} = useColiseumPlayer()
    const [isSyncingEntry, setIsSyncingEntry] = useState(() => isAwaitingArenaSync())

    useEffect(() => {
        if (isPlayerInArena) {
            clearAwaitingArenaSync()
            setIsSyncingEntry(false)
            return
        }

        if (!isAwaitingArenaSync()) {
            setIsSyncingEntry(false)
            return
        }

        setIsSyncingEntry(true)
        let cancelled = false

        void (async () => {
            const synced = await pollUntilPlayerInArena(refetchPlayer)
            if (cancelled) {
                return
            }

            if (synced) {
                await refetchProfile()
            }

            clearAwaitingArenaSync()
            setIsSyncingEntry(false)
        })()

        return () => {
            cancelled = true
        }
    }, [isPlayerInArena, refetchPlayer, refetchProfile])

    return isSyncingEntry
}
