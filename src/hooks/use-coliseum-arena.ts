'use client'

import {useMemo} from 'react'
import {useReadContract} from 'wagmi'
import {appChainId} from '@/config/chain'
import {isColiseumConfigured} from '@/config/coliseum'
import {coliseumAbi, coliseumAddress} from '@/lib/coliseum-contract'
import {techniqueIds, type TechniqueId} from '@/lib/techniques'

function toCount(value: bigint | undefined) {
    if (value === undefined) {
        return undefined
    }
    return Number(value)
}

export function useColiseumArena() {
    const baseQuery = {
        address: coliseumAddress,
        abi: coliseumAbi,
        chainId: appChainId,
        query: {enabled: isColiseumConfigured},
    } as const

    const {data: alivePlayers, isLoading: isAliveLoading} = useReadContract({
        ...baseQuery,
        functionName: 'alivePlayers',
    })

    const {data: totalGuu, isLoading: isGuuLoading} = useReadContract({
        ...baseQuery,
        functionName: 'totalGuu',
    })

    const {data: totalChi, isLoading: isChiLoading} = useReadContract({
        ...baseQuery,
        functionName: 'totalChi',
    })

    const {data: totalPaa, isLoading: isPaaLoading} = useReadContract({
        ...baseQuery,
        functionName: 'totalPaa',
    })

    const techniqueSupply = useMemo<Partial<Record<TechniqueId, number>>>(() => {
        return {
            guu: toCount(totalGuu as bigint | undefined),
            chi: toCount(totalChi as bigint | undefined),
            paa: toCount(totalPaa as bigint | undefined),
        }
    }, [totalChi, totalGuu, totalPaa])

    const isLoading = isAliveLoading || isGuuLoading || isChiLoading || isPaaLoading

    return {
        alivePlayers: toCount(alivePlayers as bigint | undefined),
        techniqueSupply,
        isLoading,
    }
}

export function formatArenaCount(value: number | undefined) {
    if (value === undefined) {
        return '—'
    }
    return value.toLocaleString('en-US').replace(/,/g, ' ')
}
