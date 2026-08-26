'use client'

import {useEffect, useState} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import {useAccount} from 'wagmi'
import type {ParsedMatchEnd} from '@/lib/match/parse-match'
import {didPlayerWin, getOpponentTechniqueFromEnd, getSelfTechniqueFromEnd} from '@/lib/match/parse-match'
import {MatchBattleCard} from '@/views/arena/components/match/match-battle-display'

type MatchResolutionProps = {
    matchId: `0x${string}`
    resolution: ParsedMatchEnd
    onComplete: () => void
}

type ResolutionStep = 'reveal' | 'collide' | 'result' | 'done'

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

    const selfWinner = showResult && outcome === true
    const selfLoser = showResult && outcome === false
    const oppWinner = showResult && outcome === false
    const oppLoser = showResult && outcome === true

    return (
        <button
            type="button"
            className={`flex flex-1 flex-col items-center justify-center px-4 py-8 outline-none ${
                step === 'done' ? 'cursor-pointer' : 'cursor-default'
            }`}
            onClick={handleSkip}
        >
            <div className="flex w-full max-w-3xl flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10">
                <motion.div
                    animate={{
                        x: isColliding && !isDraw ? 40 : 0,
                        y: isColliding && isDraw ? -20 : 0,
                        scale: isColliding ? 1.05 : 1,
                    }}
                    transition={{duration: 0.45}}
                >
                    <MatchBattleCard
                        techniqueId={selfTechnique}
                        winner={selfWinner}
                        loser={selfLoser || (isDraw && showResult)}
                        used={selfLoser}
                    />
                </motion.div>

                <AnimatePresence mode="wait">
                    {!showResult || isDraw ? (
                        <motion.div
                            key={isDraw && showResult ? 'draw' : 'vs'}
                            initial={{opacity: 1, scale: 1}}
                            animate={{opacity: isColliding && !isDraw ? 0 : 1, scale: isDraw && showResult ? 1.1 : 1}}
                            exit={{opacity: 0}}
                            className="flex h-16 items-center justify-center sm:h-20"
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
                            winner={oppWinner}
                            loser={oppLoser || (isDraw && showResult)}
                            used={oppLoser}
                        />
                    ) : (
                        <div className="h-[130px] w-[88px] rounded-2xl border border-dashed border-white/20 sm:h-[170px] sm:w-[120px]" />
                    )}
                </motion.div>
            </div>

            <AnimatePresence>
                {showResult && (
                    <motion.p
                        initial={{opacity: 0, y: 12}}
                        animate={{opacity: 1, y: 0}}
                        className={`mt-10 text-2xl font-black uppercase tracking-[0.18em] sm:text-3xl ${
                            isDraw ? 'text-[#f7d436]' : outcome ? 'text-[#b8f04a]' : 'text-[#ff6b6b]'
                        }`}
                    >
                        {isDraw ? 'Draw' : outcome ? 'Victory' : 'Defeat'}
                    </motion.p>
                )}
            </AnimatePresence>

            {step === 'done' && (
                <p className="mt-6 text-xs font-medium text-white/40">Click anywhere to skip</p>
            )}
        </button>
    )
}
