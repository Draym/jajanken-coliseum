'use client'

import {useCallback, useEffect, useRef, useState} from 'react'
import {useAccount, useSwitchChain} from 'wagmi'
import {appChainId} from '@/config/chain'

export function isPhantomConnector(connector: {id: string; name?: string} | undefined) {
    if (!connector) {
        return false
    }

    const id = connector.id.toLowerCase()
    const name = connector.name?.toLowerCase() ?? ''
    return id === 'phantom' || id.includes('phantom') || name.includes('phantom')
}

export function useEnsureAppChain() {
    const {isConnected, chainId, connector} = useAccount()
    const {switchChainAsync, isPending, error} = useSwitchChain()
    const autoSwitchAttempted = useRef(false)
    const [switchFailed, setSwitchFailed] = useState(false)

    const isPhantom = isPhantomConnector(connector)
    const isWrongChain = isConnected && chainId !== undefined && chainId !== appChainId
    const isCorrectChain = !isConnected || chainId === appChainId

    const switchToAppChain = useCallback(async () => {
        setSwitchFailed(false)

        try {
            await switchChainAsync({chainId: appChainId})
        } catch {
            setSwitchFailed(true)
        }
    }, [switchChainAsync])

    useEffect(() => {
        if (!isWrongChain || isPending || autoSwitchAttempted.current) {
            return
        }

        autoSwitchAttempted.current = true
        void switchChainAsync({chainId: appChainId}).catch(() => {
            setSwitchFailed(true)
        })
    }, [isWrongChain, isPending, switchChainAsync])

    useEffect(() => {
        if (isCorrectChain) {
            autoSwitchAttempted.current = false
            setSwitchFailed(false)
        }
    }, [isCorrectChain])

    return {
        isWrongChain,
        isCorrectChain,
        isSwitching: isPending,
        switchFailed,
        isPhantom,
        switchToAppChain,
        switchError: error,
    }
}
