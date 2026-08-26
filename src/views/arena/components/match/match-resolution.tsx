'use client'

import {useEffect, useState} from 'react'
import {AnimatePresence, LayoutGroup, motion} from 'framer-motion'
import {useAccount} from 'wagmi'
import type {ParsedMatchEnd} from '@/lib/match/parse-match'
import {didPlayerWin, getOpponentTechniqueFromEnd, getSelfTechniqueFromEnd} from '@/lib/match/parse-match'
import type {TechniqueId} from '@/lib/techniques'
import {MatchBattleCard, MatchBattlePlaceholder, MATCH_BATTLE_VS_FRAME_CLASS} from '@/views/arena/components/match/match-battle-display'

type MatchResolutionProps = {
    matchId: `0x${string}`
    resolution: ParsedMatchEnd
    onComplete: () => void
}

type ResolutionStep = 'reveal' | 'collide' | 'result' | 'done'

const RESULT_WINNER_SCALE = 1.28
const RESULT_LOSER_ROTATE = 20

export default function MatchResolution({matchId, resolution, onComplete}: MatchResolutionProps) {
    const {address} = useAccount()
    const [step, setStep] = useState<ResolutionStep>('reveal')

    const selfTechnique = address ? getSelfTechniqueFromEnd(resolution, address, matchId) : null
    const opponentTechnique = address ? getOpponentTechniqueFromEnd(resolution, address, matchId) : null
    const outcome = address ? didPlayerWin(resolution, address) : null
    const isDraw = resolution.isDraw

    useEffect(() => {
        const timers = [
            window.setTimeout(() => setStep('collide'), 1200),
            window.setTimeout(() => setStep('result'), isDraw ? 2600 : 2200),
            window.setTimeout(() => setStep('done'), isDraw ? 4200 : 3600),
        ]

        return () => timers.forEach(clearTimeout)
    }, [isDraw])

    const handleSkip = () => {
        if (step === 'done') {
            onComplete()
        }
    }

    if (!selfTechnique || !opponentTechnique) {
        return null
    }

    const showEnemy = step !== 'reveal'
    const isColliding = step === 'collide'
    const showResult = step === 'result' || step === 'done'
    const showFinalStack = showResult && !isDraw && outcome !== null

    const winnerTechnique: TechniqueId = outcome ? selfTechnique : opponentTechnique
    const loserTechnique: TechniqueId = outcome ? opponentTechnique : selfTechnique
    const winnerLayoutId = outcome ? 'self-card' : 'opp-card'
    const loserLayoutId = outcome ? 'opp-card' : 'self-card'
    const loserUsed = true

    return (
        <button
            type="button"
            className={`flex flex-1 flex-col items-center justify-center px-4 py-8 outline-none ${
                step === 'done' ? 'cursor-pointer' : 'cursor-default'
            }`}
            onClick={handleSkip}
        >
            <LayoutGroup>
                {showFinalStack ? (
                    <div className="relative flex h-[280px] w-[min(100%,13.75rem)] items-center justify-center sm:h-[360px] sm:w-[min(100%,18.75rem)] lg:w-[min(100%,20rem)]">
                        <motion.div
                            layoutId={loserLayoutId}
                            className="absolute z-0 flex items-center justify-center"
                            transition={{type: 'spring', stiffness: 260, damping: 28}}
                            animate={{
                                rotate: RESULT_LOSER_ROTATE,
                                scale: RESULT_WINNER_SCALE,
                                y: 14,
                                x: 10,
                                opacity: 0.72,
                            }}
                        >
                            <MatchBattleCard techniqueId={loserTechnique} used={loserUsed} plain />
                        </motion.div>

                        <motion.div
                            layoutId={winnerLayoutId}
                            className="relative z-10 flex items-center justify-center"
                            transition={{type: 'spring', stiffness: 260, damping: 28}}
                            animate={{scale: RESULT_WINNER_SCALE}}
                        >
                            <MatchBattleCard techniqueId={winnerTechnique} plain />
                        </motion.div>
                    </div>
                ) : (
                    <div className="flex w-full max-w-3xl flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10">
                        <motion.div
                            layoutId="self-card"
                            animate={{
                                x: isColliding && !isDraw ? 40 : 0,
                                y: isColliding && isDraw ? -20 : 0,
                                scale: isColliding ? 1.05 : 1,
                            }}
                            transition={{duration: 0.45}}
                        >
                            <MatchBattleCard
                                techniqueId={selfTechnique}
                                plain={showResult && isDraw}
                            />
                        </motion.div>

                        <AnimatePresence mode="wait">
                            {!showResult || isDraw ? (
                                <motion.div
                                    key={isDraw && showResult ? 'draw' : 'vs'}
                                    initial={{opacity: 1, scale: 1}}
                                    animate={{opacity: isColliding && !isDraw ? 0 : 1, scale: isDraw && showResult ? 1.1 : 1}}
                                    exit={{opacity: 0}}
                                    className={`flex items-center justify-center ${MATCH_BATTLE_VS_FRAME_CLASS}`}
                                >
                                    {isDraw && showResult ? (
                                        <p className="m-0 text-3xl font-black uppercase tracking-[0.2em] text-[#f7d436]">Draw</p>
                                    ) : (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img className="h-full w-auto" src="/rule4-img.png" alt="VS" />
                                    )}
                                </motion.div>
                            ) : null}
                        </AnimatePresence>

                        <motion.div
                            layoutId="opp-card"
                            initial={{opacity: 0, scale: 0.85}}
                            animate={{
                                opacity: showEnemy ? 1 : 0.25,
                                scale: showEnemy ? 1 : 0.85,
                                x: isColliding && !isDraw ? -40 : 0,
                                y: isColliding && isDraw ? 20 : 0,
                            }}
                            transition={{duration: 0.45}}
                        >
                            {showEnemy ? (
                                <MatchBattleCard
                                    techniqueId={opponentTechnique}
                                    plain={showResult && isDraw}
                                />
                            ) : (
                                <MatchBattlePlaceholder />
                            )}
                        </motion.div>
                    </div>
                )}
            </LayoutGroup>

            <AnimatePresence>
                {showResult && !isDraw && (
                    <motion.p
                        initial={{opacity: 0, y: 12}}
                        animate={{opacity: 1, y: 0}}
                        className={`mt-10 text-2xl font-black uppercase tracking-[0.18em] sm:text-3xl ${
                            outcome ? 'text-[#b8f04a]' : 'text-[#ff6b6b]'
                        }`}
                    >
                        {outcome ? 'Victory' : 'Defeat'}
                    </motion.p>
                )}
            </AnimatePresence>

            {step === 'done' && (
                <p className="mt-6 text-xs font-medium text-white/40">Click anywhere to skip</p>
            )}
        </button>
    )
}
