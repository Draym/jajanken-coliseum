'use client'

import {useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react'
import {AnimatePresence, motion} from 'framer-motion'
import type {TechniqueId} from '@/lib/techniques'
import {MatchBattleCard, MATCH_BATTLE_VS_FRAME_CLASS} from '@/views/arena/components/match/match-battle-display'

export type ClashOutcome = 'win' | 'lose' | 'draw'

type MatchClashAnimationProps = {
    selfTechnique: TechniqueId
    opponentTechnique: TechniqueId
    outcome: ClashOutcome
    onComplete?: () => void
    /** Bump to replay the animation from the start. */
    playKey?: number | string
    autoDismiss?: boolean
}

type WinLoseStep = 'faceoff' | 'charge' | 'impact' | 'resolve' | 'label' | 'done'

const RESULT_WINNER_SCALE = 1.28
const RESULT_LOSER_ROTATE = 12
const RESULT_LOSER_PEEK_X = 8
const RESULT_LOSER_PEEK_Y = 12

const CHARGE_IN = 56
const BOUNCE_OUT = 28
const CLASH_OVERLAP = 14

const RESOLVE_SPRING = {type: 'spring' as const, stiffness: 240, damping: 26}
const CHARGE_EASE = {duration: 0.34, ease: [0.55, 0.05, 0.9, 0.4] as const}
const IMPACT_SPRING = {type: 'spring' as const, stiffness: 420, damping: 20, mass: 0.85}

type ClashSpark = {
    angle: number
    distance: number
    length: number
    thickness: number
    delay: number
    duration: number
    color: string
    glow: string
    kind: 'streak' | 'shard' | 'flash'
}

const CLASH_PALETTE = [
    {color: '#ffffff', glow: '#ffe566'},
    {color: '#fff8d6', glow: '#ffb020'},
    {color: '#ffe9a0', glow: '#ff9a1a'},
    {color: '#ffffff', glow: '#ffd24a'},
    {color: '#ffd978', glow: '#ff8c1a'},
] as const

function clashRand(seed: number) {
    const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
    return x - Math.floor(x)
}

/** Radial impact burst from the clash point — game VFX, not edge emitters. */
function createClashBurst(): ClashSpark[] {
    const sparks: ClashSpark[] = []

    // Primary star-burst streaks (all directions from center).
    for (let i = 0; i < 18; i++) {
        const r = clashRand(i * 19.7)
        const r2 = clashRand(i * 47.3)
        const baseAngle = (i / 18) * 360 + (r - 0.5) * 28
        const palette = CLASH_PALETTE[i % CLASH_PALETTE.length]

        sparks.push({
            angle: baseAngle,
            distance: 70 + r * 70,
            length: 18 + r2 * 26,
            thickness: 2 + r * 2,
            delay: r * 0.03,
            duration: 0.32 + r2 * 0.18,
            color: palette.color,
            glow: palette.glow,
            kind: 'streak',
        })
    }

    // Secondary shards — shorter, punchier.
    for (let i = 0; i < 14; i++) {
        const r = clashRand(200 + i * 23.1)
        const r2 = clashRand(300 + i * 11.5)
        const palette = CLASH_PALETTE[(i + 2) % CLASH_PALETTE.length]

        sparks.push({
            angle: r * 360,
            distance: 36 + r2 * 48,
            length: 8 + r * 14,
            thickness: 1.5 + r2,
            delay: 0.01 + r * 0.04,
            duration: 0.22 + r2 * 0.16,
            color: palette.color,
            glow: palette.glow,
            kind: 'shard',
        })
    }

    // Tiny flash flecks near the hit.
    for (let i = 0; i < 10; i++) {
        const r = clashRand(500 + i * 7.9)
        const palette = CLASH_PALETTE[i % CLASH_PALETTE.length]

        sparks.push({
            angle: r * 360,
            distance: 16 + r * 28,
            length: 5 + r * 6,
            thickness: 3 + r * 2,
            delay: r * 0.02,
            duration: 0.18 + r * 0.1,
            color: palette.color,
            glow: palette.glow,
            kind: 'flash',
        })
    }

    return sparks
}

const CLASH_SPARKS = createClashBurst()

function sparkOffset(angleDeg: number, distance: number) {
    const radians = (angleDeg * Math.PI) / 180
    return {
        x: Math.cos(radians) * distance,
        y: Math.sin(radians) * distance,
    }
}

function ClashDebris({active}: {active: boolean}) {
    return (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-visible" aria-hidden="true">
            <AnimatePresence>
                {active && (
                    <>
                        {/* Core hit flash */}
                        <motion.div
                            key="hit-core"
                            className="absolute size-8 rounded-full bg-white sm:size-10"
                            style={{
                                boxShadow:
                                    '0 0 18px 8px rgba(255,255,255,0.9), 0 0 40px 14px rgba(255,180,40,0.55)',
                            }}
                            initial={{opacity: 0, scale: 0.2}}
                            animate={{opacity: [0, 1, 0], scale: [0.2, 1.4, 0.6]}}
                            exit={{opacity: 0}}
                            transition={{duration: 0.28, times: [0, 0.2, 1], ease: 'easeOut'}}
                        />

                        {/* Expanding shock rings */}
                        {[0, 1].map((ring) => (
                            <motion.div
                                key={`ring-${ring}`}
                                className="absolute rounded-full border border-[#ffe566]/70"
                                style={{
                                    width: 28,
                                    height: 28,
                                    boxShadow: '0 0 12px rgba(255, 200, 60, 0.35)',
                                }}
                                initial={{opacity: 0, scale: 0.4}}
                                animate={{opacity: [0, 0.85, 0], scale: [0.4, 2.8 + ring * 0.7, 3.6 + ring]}}
                                exit={{opacity: 0}}
                                transition={{
                                    duration: 0.4,
                                    delay: ring * 0.04,
                                    ease: [0.15, 0.8, 0.2, 1],
                                }}
                            />
                        ))}

                        {CLASH_SPARKS.map((spark, index) => {
                            const end = sparkOffset(spark.angle, spark.distance)
                            const mid = sparkOffset(spark.angle, spark.distance * 0.45)
                            const isFlash = spark.kind === 'flash'

                            return (
                                <motion.span
                                    key={index}
                                    className={`absolute ${isFlash ? 'rounded-full' : 'origin-center rounded-full'}`}
                                    style={{
                                        width: isFlash ? spark.thickness : spark.length,
                                        height: isFlash ? spark.thickness : spark.thickness,
                                        background: isFlash
                                            ? spark.color
                                            : `linear-gradient(90deg, transparent 0%, ${spark.color} 25%, ${spark.glow} 70%, transparent 100%)`,
                                        boxShadow: `0 0 ${isFlash ? 10 : 7}px ${spark.glow}`,
                                    }}
                                    transformTemplate={({x, y, scaleX, scale}) =>
                                        isFlash
                                            ? `translate(-50%, -50%) translate(${x}, ${y}) scale(${scale})`
                                            : `translate(-50%, -50%) translate(${x}, ${y}) rotate(${spark.angle}deg) scaleX(${scaleX})`
                                    }
                                    initial={
                                        isFlash
                                            ? {opacity: 0, x: 0, y: 0, scale: 0.2}
                                            : {opacity: 0, x: 0, y: 0, scaleX: 0.1}
                                    }
                                    animate={
                                        isFlash
                                            ? {
                                                  opacity: [0, 1, 0],
                                                  x: [0, mid.x, end.x],
                                                  y: [0, mid.y, end.y],
                                                  scale: [0.2, 1.3, 0.3],
                                              }
                                            : {
                                                  opacity: [0, 1, 0.9, 0],
                                                  x: [0, mid.x, end.x],
                                                  y: [0, mid.y, end.y],
                                                  scaleX: [0.1, 1.25, 0.4],
                                              }
                                    }
                                    exit={{opacity: 0}}
                                    transition={{
                                        duration: spark.duration,
                                        delay: spark.delay,
                                        times: isFlash ? [0, 0.25, 1] : [0, 0.12, 0.45, 1],
                                        ease: [0.1, 0.85, 0.2, 1],
                                    }}
                                />
                            )
                        })}
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

function idlePose() {
    return {x: 0, y: 0, scale: 1, rotate: 0, opacity: 1, zIndex: 10}
}

function winnerPose(centerX: number) {
    return {
        x: centerX,
        y: 0,
        scale: RESULT_WINNER_SCALE,
        rotate: 0,
        opacity: 1,
        zIndex: 10,
    }
}

function loserPose(centerX: number) {
    return {
        x: centerX + RESULT_LOSER_PEEK_X,
        y: RESULT_LOSER_PEEK_Y,
        scale: RESULT_WINNER_SCALE,
        rotate: RESULT_LOSER_ROTATE,
        opacity: 0.72,
        zIndex: 0,
    }
}

const LABEL_MOTION = {
    initial: {opacity: 0, y: 28, scale: 0.82, filter: 'blur(6px)'},
    animate: {opacity: 1, y: 0, scale: 1, filter: 'blur(0px)'},
    exit: {opacity: 0, y: 8},
    transition: {type: 'spring' as const, stiffness: 320, damping: 22},
}

function ResultLabel({
    text,
    className,
    glow,
}: {
    text: string
    className: string
    glow: string
}) {
    return (
        <motion.p
            key={text}
            initial={LABEL_MOTION.initial}
            animate={LABEL_MOTION.animate}
            exit={LABEL_MOTION.exit}
            transition={LABEL_MOTION.transition}
            className={`m-0 text-2xl font-black uppercase tracking-[0.18em] sm:text-3xl ${className}`}
            style={{textShadow: glow}}
        >
            {text}
        </motion.p>
    )
}

function ClashSequence({
    selfTechnique,
    opponentTechnique,
    outcome,
    playKey,
    autoDismiss,
    onComplete,
}: {
    selfTechnique: TechniqueId
    opponentTechnique: TechniqueId
    outcome: ClashOutcome
    playKey: number | string
    autoDismiss: boolean
    onComplete?: () => void
}) {
    const [step, setStep] = useState<WinLoseStep>('faceoff')
    const stageRef = useRef<HTMLDivElement>(null)
    const selfRef = useRef<HTMLDivElement>(null)
    const oppRef = useRef<HTMLDivElement>(null)
    const [centerX, setCenterX] = useState({self: 0, opp: 0})
    const [contactX, setContactX] = useState({self: CHARGE_IN, opp: CHARGE_IN})

    const isDraw = outcome === 'draw'
    const playerWon = outcome === 'win'

    useEffect(() => {
        setStep('faceoff')
        setCenterX({self: 0, opp: 0})
        setContactX({self: CHARGE_IN, opp: CHARGE_IN})

        const timers = [
            window.setTimeout(() => setStep('charge'), 900),
            window.setTimeout(() => setStep('impact'), 1280),
            window.setTimeout(() => setStep('resolve'), 1850),
            window.setTimeout(() => setStep('label'), 2550),
            window.setTimeout(() => setStep('done'), 4200),
        ]

        return () => timers.forEach(clearTimeout)
    }, [playKey])

    useLayoutEffect(() => {
        if (step !== 'faceoff') return

        const measure = () => {
            const stage = stageRef.current?.getBoundingClientRect()
            const selfBox = selfRef.current?.getBoundingClientRect()
            const oppBox = oppRef.current?.getBoundingClientRect()
            if (!stage || !selfBox || !oppBox) return

            const stageCenter = stage.left + stage.width / 2
            setCenterX({
                self: stageCenter - (selfBox.left + selfBox.width / 2),
                opp: stageCenter - (oppBox.left + oppBox.width / 2),
            })
            setContactX({
                self: Math.max(0, stageCenter - selfBox.right + CLASH_OVERLAP),
                opp: Math.max(0, oppBox.left - stageCenter + CLASH_OVERLAP),
            })
        }

        const timer = window.setTimeout(measure, 480)
        window.addEventListener('resize', measure)
        return () => {
            window.clearTimeout(timer)
            window.removeEventListener('resize', measure)
        }
    }, [step, playKey])

    const handleSkip = () => {
        if (step === 'done' && autoDismiss) {
            onComplete?.()
        }
    }

    const isResolved = step === 'resolve' || step === 'label' || step === 'done'
    const showOutcomeLabel = step === 'label' || step === 'done'
    const showVs = step === 'faceoff'

    const selfMotion = useMemo(() => {
        if (isResolved) {
            if (isDraw) return idlePose()
            return playerWon ? winnerPose(centerX.self) : loserPose(centerX.self)
        }
        if (step === 'charge') {
            return {
                x: contactX.self,
                y: 0,
                scale: 1.08,
                rotate: -5,
                opacity: 1,
                zIndex: 10,
            }
        }
        if (step === 'impact') {
            return {
                x: Math.max(0, contactX.self - BOUNCE_OUT),
                y: 0,
                scale: 1.03,
                rotate: -2,
                opacity: 1,
                zIndex: 10,
            }
        }
        return idlePose()
    }, [centerX.self, contactX.self, isDraw, isResolved, playerWon, step])

    const oppMotion = useMemo(() => {
        if (isResolved) {
            if (isDraw) return idlePose()
            return playerWon ? loserPose(centerX.opp) : winnerPose(centerX.opp)
        }
        if (step === 'charge') {
            return {
                x: -contactX.opp,
                y: 0,
                scale: 1.08,
                rotate: 5,
                opacity: 1,
                zIndex: 10,
            }
        }
        if (step === 'impact') {
            return {
                x: -Math.max(0, contactX.opp - BOUNCE_OUT),
                y: 0,
                scale: 1.03,
                rotate: 2,
                opacity: 1,
                zIndex: 10,
            }
        }
        return idlePose()
    }, [centerX.opp, contactX.opp, isDraw, isResolved, playerWon, step])

    const cardTransition =
        step === 'charge'
            ? CHARGE_EASE
            : step === 'impact'
              ? IMPACT_SPRING
              : isResolved
                ? RESOLVE_SPRING
                : {duration: 0.4, ease: [0.22, 1, 0.36, 1] as const}

    return (
        <button
            type="button"
            className={`flex flex-1 flex-col items-center justify-center px-4 py-8 outline-none ${
                step === 'done' && autoDismiss ? 'cursor-pointer' : 'cursor-default'
            }`}
            onClick={handleSkip}
        >
            <div
                ref={stageRef}
                className="relative flex w-full max-w-3xl flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10"
            >
                <ClashDebris active={step === 'impact'} />

                <motion.div
                    ref={selfRef}
                    className="relative"
                    style={{zIndex: selfMotion.zIndex}}
                    initial={false}
                    animate={selfMotion}
                    transition={cardTransition}
                >
                    <MatchBattleCard
                        techniqueId={selfTechnique}
                        used={!isDraw && isResolved && !playerWon}
                        plain
                    />
                </motion.div>

                <div className={`relative flex shrink-0 items-center justify-center ${MATCH_BATTLE_VS_FRAME_CLASS}`}>
                    <AnimatePresence mode="wait">
                        {showVs && (
                            <motion.div
                                key="vs"
                                className="flex h-full w-full items-center justify-center"
                                initial={{opacity: 0, scale: 0.9}}
                                animate={{opacity: 1, scale: 1}}
                                exit={{opacity: 0, scale: 0.85}}
                                transition={{duration: 0.2}}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img className="h-full w-auto" src="/rule4-img.png" alt="VS" />
                            </motion.div>
                        )}
                        {isDraw && showOutcomeLabel && (
                            <ResultLabel
                                text="Draw"
                                className="text-[#f7d436]"
                                glow="0 0 28px rgba(247, 212, 54, 0.45)"
                            />
                        )}
                    </AnimatePresence>
                </div>

                <motion.div
                    ref={oppRef}
                    className="relative"
                    style={{zIndex: oppMotion.zIndex}}
                    initial={{opacity: 0, scale: 0.85, x: 0, y: 0, rotate: 0}}
                    animate={oppMotion}
                    transition={
                        step === 'faceoff'
                            ? {duration: 0.45, ease: [0.22, 1, 0.36, 1]}
                            : cardTransition
                    }
                >
                    <MatchBattleCard
                        techniqueId={opponentTechnique}
                        used={!isDraw && isResolved && playerWon}
                        plain
                    />
                </motion.div>
            </div>

            <div className="mt-20 flex min-h-[3rem] items-center justify-center sm:mt-24 sm:min-h-[3.5rem]">
                <AnimatePresence>
                    {!isDraw && showOutcomeLabel && (
                        <ResultLabel
                            text={playerWon ? 'Victory' : 'Defeat'}
                            className={playerWon ? 'text-[#b8f04a]' : 'text-[#ff6b6b]'}
                            glow={
                                playerWon
                                    ? '0 0 28px rgba(184, 240, 74, 0.45)'
                                    : '0 0 28px rgba(255, 107, 107, 0.45)'
                            }
                        />
                    )}
                </AnimatePresence>
            </div>

            {step === 'done' && autoDismiss && (
                <p className="mt-4 text-xs font-medium text-white/40">Click anywhere to skip</p>
            )}
        </button>
    )
}

export default function MatchClashAnimation({
    selfTechnique,
    opponentTechnique,
    outcome,
    onComplete,
    playKey = 0,
    autoDismiss = true,
}: MatchClashAnimationProps) {
    return (
        <ClashSequence
            selfTechnique={selfTechnique}
            opponentTechnique={opponentTechnique}
            outcome={outcome}
            playKey={playKey}
            autoDismiss={autoDismiss}
            onComplete={onComplete}
        />
    )
}
