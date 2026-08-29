'use client'

import {useAccount} from 'wagmi'
import type {ParsedMatchEnd} from '@/lib/match/parse-match'
import {didPlayerWin, getOpponentTechniqueFromEnd, getSelfTechniqueFromEnd} from '@/lib/match/parse-match'
import MatchClashAnimation, {type ClashOutcome} from '@/views/arena/components/match/match-clash-animation'

type MatchResolutionProps = {
    matchId: `0x${string}`
    resolution: ParsedMatchEnd
    onComplete: () => void
}

function toClashOutcome(isDraw: boolean, playerWon: boolean | null): ClashOutcome {
    if (isDraw) return 'draw'
    return playerWon ? 'win' : 'lose'
}

export default function MatchResolution({matchId, resolution, onComplete}: MatchResolutionProps) {
    const {address} = useAccount()

    const selfTechnique = address ? getSelfTechniqueFromEnd(resolution, address, matchId) : null
    const opponentTechnique = address ? getOpponentTechniqueFromEnd(resolution, address, matchId) : null
    const playerWon = address ? didPlayerWin(resolution, address) : null

    if (!selfTechnique || !opponentTechnique) {
        return null
    }

    return (
        <MatchClashAnimation
            selfTechnique={selfTechnique}
            opponentTechnique={opponentTechnique}
            outcome={toClashOutcome(resolution.isDraw, playerWon)}
            onComplete={onComplete}
        />
    )
}
