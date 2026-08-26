'use client'

import {useRef, useState, type TouchEvent} from 'react'
import {AnimatePresence, motion} from 'framer-motion'
import type {GameMode, GameModeId} from '@/lib/game-modes'

export type ModeRuntimeState = {
    feeLabel: string | null
    maxCashoutLabel: string | null
    isFeeLoading: boolean
    isPlayerActive: boolean
    isPlayerLoading: boolean
    livesRemaining: number | null
    isActionLoading: boolean
}

type ModeCardProps = {
    mode: GameMode
    runtime: ModeRuntimeState
    onAction: () => void
}

function ModePlaceholderArt({mode}: {mode: GameMode}) {
    return (
        <div
            className="relative flex h-full w-full items-center justify-center overflow-hidden"
            style={{
                background: `linear-gradient(145deg, ${mode.accent}33 0%, ${mode.accent}12 45%, #060711 100%)`,
            }}
        >
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage:
                        'repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(255,255,255,0.03) 8px, rgba(255,255,255,0.03) 16px)',
                }}
                aria-hidden="true"
            />
            <motion.div
                className="relative z-[1] flex size-24 items-center justify-center rounded-2xl border border-white/15 bg-black/25 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-sm"
                animate={{y: [0, -6, 0], scale: [1, 1.04, 1]}}
                transition={{duration: 3.2, repeat: Infinity, ease: 'easeInOut'}}
            >
                <span
                    className="text-4xl font-black uppercase tracking-tight"
                    style={{color: mode.accent, textShadow: `0 0 24px ${mode.accent}88`}}
                >
                    {mode.name.slice(0, 1)}
                </span>
            </motion.div>
            <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-brand-bg to-transparent"
                aria-hidden="true"
            />
        </div>
    )
}

function ArenaEntranceCta({
    runtime,
    onAction,
}: {
    runtime: ModeRuntimeState
    onAction: () => void
}) {
    if (runtime.isPlayerLoading) {
        return (
            <div className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left">
                <p className="m-0 text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">Arena</p>
                <p className="mt-1 text-xl font-black text-brand-gold">Loading...</p>
                <p className="mt-1 text-xs text-white/45">checking your fighter status</p>
            </div>
        )
    }

    if (runtime.isPlayerActive) {
        const livesLabel =
            runtime.livesRemaining !== null
                ? `${runtime.livesRemaining} ${runtime.livesRemaining === 1 ? 'life' : 'lives'} remaining`
                : 'resume your current run'

        return (
            <button
                type="button"
                className="group/cta relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left transition-all hover:border-brand-gold/45 hover:bg-white/[0.06] hover:shadow-[0_0_24px_rgba(247,212,54,0.12)] active:scale-[0.99]"
                onClick={onAction}
            >
                <p className="m-0 text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">Your run</p>
                <p className="mt-1 text-xl font-black text-brand-gold">Continue Game</p>
                <p className="mt-1 text-xs text-white/45">{livesLabel}</p>
                <span
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-all duration-700 group-hover/cta:translate-x-full group-hover/cta:opacity-100"
                    aria-hidden="true"
                />
            </button>
        )
    }

    const isDisabled = runtime.isActionLoading || runtime.isFeeLoading || !runtime.feeLabel

    const primaryLabel = runtime.isActionLoading
        ? 'Entering Arena...'
        : runtime.isFeeLoading
            ? 'Loading...'
            : runtime.feeLabel
                ? `${runtime.feeLabel} ETH`
                : '—'

    const secondaryLabel = runtime.maxCashoutLabel
        ? `join now for up to ${runtime.maxCashoutLabel} ETH cashout`
        : 'loading arena details...'

    return (
        <button
            type="button"
            className={`group/cta relative w-full overflow-hidden rounded-2xl border bg-white/[0.04] px-4 py-3 text-left transition-all ${
                isDisabled
                    ? 'cursor-not-allowed border-white/10 opacity-60'
                    : 'border-white/10 hover:border-brand-gold/45 hover:bg-white/[0.06] hover:shadow-[0_0_24px_rgba(247,212,54,0.12)] active:scale-[0.99]'
            }`}
            onClick={onAction}
            disabled={isDisabled}
        >
            <p className="m-0 text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">Entrance fee</p>
            <p className="mt-1 text-xl font-black text-brand-gold">{primaryLabel}</p>
            <p className="mt-1 text-xs text-white/45">{secondaryLabel}</p>
            {!isDisabled && (
                <span
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-all duration-700 group-hover/cta:translate-x-full group-hover/cta:opacity-100"
                    aria-hidden="true"
                />
            )}
        </button>
    )
}

function ModeCard({mode, runtime, onAction}: ModeCardProps) {
    return (
        <motion.article
            className={`group relative isolate mx-auto flex h-[480px] w-full max-w-[340px] flex-col overflow-hidden rounded-[28px] border border-brand-gold/50 bg-[#0c0d1c] shadow-[0_32px_90px_rgba(247,212,54,0.18)] ${mode.disabled ? 'opacity-90' : ''}`}
            whileHover={!mode.disabled ? {y: -4} : undefined}
            transition={{type: 'spring', stiffness: 320, damping: 26}}
        >
            <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#16182c] via-[#0c0d1c] to-[#060711]"
                aria-hidden="true"
            />
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background: `radial-gradient(circle at 50% -10%, ${mode.accent}22 0%, transparent 55%)`,
                }}
                aria-hidden="true"
            />

            <div className="pointer-events-none absolute inset-3 rounded-[22px] border border-white/[0.06]" aria-hidden="true" />

            <div className="relative h-[200px] shrink-0 border-b border-white/10">
                <ModePlaceholderArt mode={mode} />
            </div>

            <div className="relative flex flex-1 flex-col px-6 pb-6 pt-5">
                <p className="m-0 text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">{mode.tagline}</p>
                <h3
                    className="mt-1.5 text-[32px] font-black uppercase leading-8 text-white"
                    style={{textShadow: `0 0 28px ${mode.accent}44`}}
                >
                    {mode.name}
                </h3>
                <p className="mt-2.5 line-clamp-2 text-sm leading-[22px] text-white/60">{mode.description}</p>

                <div className="relative mt-auto pt-5">
                    {mode.id === 'arena' && !mode.disabled ? (
                        <ArenaEntranceCta runtime={runtime} onAction={onAction} />
                    ) : (
                        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center">
                            <p className="m-0 text-sm font-black uppercase tracking-[0.1em] text-white/35">Coming Soon</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.article>
    )
}

function CarouselArrow({
    direction,
    onClick,
}: {
    direction: 'left' | 'right'
    onClick: () => void
}) {
    return (
        <button
            type="button"
            className={`group absolute top-1/2 z-10 flex -translate-y-1/2 items-center justify-center transition-all max-sm:p-1 max-sm:text-white/30 max-sm:active:text-white/55 sm:size-12 sm:rounded-full sm:border sm:border-white/15 sm:bg-black/35 sm:text-white/70 sm:backdrop-blur-sm sm:hover:border-brand-gold/50 sm:hover:bg-brand-gold/10 sm:hover:text-brand-gold sm:hover:shadow-[0_0_24px_rgba(247,212,54,0.2)] ${direction === 'left' ? 'left-0' : 'right-0'}`}
            onClick={onClick}
            aria-label={direction === 'left' ? 'Previous mode' : 'Next mode'}
        >
            <svg
                className={`size-6 transition-transform max-sm:size-5 sm:size-5 ${direction === 'left' ? 'sm:group-hover:-translate-x-0.5' : 'sm:group-hover:translate-x-0.5'}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                {direction === 'left' ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
            </svg>
        </button>
    )
}

type ModeSelectionCarouselProps = {
    modes: GameMode[]
    activeIndex: number
    onActiveIndexChange: (index: number) => void
    getModeRuntime: (modeId: GameModeId) => ModeRuntimeState
    onModeAction: (mode: GameMode) => void
}

export default function ModeSelectionCarousel({
    modes,
    activeIndex,
    onActiveIndexChange,
    getModeRuntime,
    onModeAction,
}: ModeSelectionCarouselProps) {
    const activeMode = modes[activeIndex]
    const [slideDirection, setSlideDirection] = useState(1)
    const swipeStart = useRef<{x: number; y: number} | null>(null)

    const goToPrevious = () => {
        setSlideDirection(-1)
        onActiveIndexChange((activeIndex - 1 + modes.length) % modes.length)
    }

    const goToNext = () => {
        setSlideDirection(1)
        onActiveIndexChange((activeIndex + 1) % modes.length)
    }

    const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
        const touch = event.touches[0]
        if (!touch) {
            return
        }
        swipeStart.current = {x: touch.clientX, y: touch.clientY}
    }

    const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
        const start = swipeStart.current
        swipeStart.current = null
        if (!start) {
            return
        }

        const touch = event.changedTouches[0]
        if (!touch) {
            return
        }

        const deltaX = touch.clientX - start.x
        const deltaY = touch.clientY - start.y

        if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY)) {
            return
        }

        if (deltaX < 0) {
            goToNext()
        } else {
            goToPrevious()
        }
    }

    return (
        <div className="flex w-full max-w-[980px] flex-col items-center px-4">
            <div className="mb-10 text-center">
                <p className="m-0 text-[11px] font-bold uppercase tracking-[0.24em] text-brand-gold/70">
                    Select your battlefield
                </p>
                <h2 className="mt-3 text-[36px] font-black uppercase leading-9 text-white max-sm:text-[30px]">
                    Choose a mode
                </h2>
            </div>

            <div className="relative mx-auto w-full max-w-[400px] px-7 sm:max-w-[680px] sm:px-32">
                <CarouselArrow direction="left" onClick={goToPrevious} />
                <CarouselArrow direction="right" onClick={goToNext} />

                <div
                    className="relative mx-auto min-h-[500px] w-full max-w-[340px] touch-pan-y overflow-visible [perspective:1400px]"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <div className="relative flex h-[500px] justify-center [transform-style:preserve-3d]">
                        <AnimatePresence initial={false} custom={slideDirection}>
                            {activeMode && (
                                <motion.div
                                    key={activeMode.id}
                                    className="absolute inset-x-0 mx-auto w-full max-w-[340px]"
                                    custom={slideDirection}
                                    style={{transformStyle: 'preserve-3d', transformOrigin: 'center center'}}
                                    variants={{
                                        enter: (direction: number) => ({
                                            x: direction * 120,
                                            rotateY: direction * -62,
                                            scale: 0.76,
                                            z: -240,
                                            opacity: 1,
                                            filter: 'blur(0px)',
                                            zIndex: 10,
                                        }),
                                        center: {
                                            x: 0,
                                            rotateY: 0,
                                            scale: 1,
                                            z: 0,
                                            opacity: 1,
                                            filter: 'blur(0px)',
                                            zIndex: 30,
                                        },
                                        exit: (direction: number) => ({
                                            x: direction * -120,
                                            rotateY: direction * 62,
                                            scale: 0.76,
                                            z: -240,
                                            opacity: 0.15,
                                            filter: 'blur(4px)',
                                            zIndex: 5,
                                        }),
                                    }}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{type: 'spring', stiffness: 235, damping: 27, mass: 0.92}}
                                >
                                    <ModeCard
                                        mode={activeMode}
                                        runtime={getModeRuntime(activeMode.id)}
                                        onAction={() => onModeAction(activeMode)}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    )
}
