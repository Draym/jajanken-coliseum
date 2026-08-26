'use client'

import {useEffect, useRef, useState} from 'react'
import {useAccount} from 'wagmi'
import {hasPersistedWalletConnection} from '@/lib/wallet-session'

const PERSISTED_RECONNECT_TIMEOUT_MS = 1500

export function useWalletBootstrap() {
    const [mounted, setMounted] = useState(false)
    const [initialCheckDone, setInitialCheckDone] = useState(false)
    const reconnectAttemptSeen = useRef(false)
    const {isConnected, status} = useAccount()

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) {
            return
        }

        if (isConnected) {
            setInitialCheckDone(true)
            return
        }

        if (status === 'reconnecting' || status === 'connecting') {
            reconnectAttemptSeen.current = true
            return
        }

        if (status !== 'disconnected') {
            return
        }

        if (hasPersistedWalletConnection() && !reconnectAttemptSeen.current) {
            const timer = window.setTimeout(() => {
                reconnectAttemptSeen.current = true
                setInitialCheckDone(true)
            }, PERSISTED_RECONNECT_TIMEOUT_MS)

            return () => window.clearTimeout(timer)
        }

        reconnectAttemptSeen.current = true
        setInitialCheckDone(true)
    }, [isConnected, mounted, status])

    const isWalletSettling =
        !mounted ||
        !initialCheckDone ||
        status === 'connecting' ||
        status === 'reconnecting'

    const isWalletReady = mounted && initialCheckDone && !isWalletSettling
    const allowWalletModal = isWalletReady && !isConnected

    return {
        allowWalletModal,
        isWalletSettling,
        isWalletReady,
        isConnected,
    }
}
