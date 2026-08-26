'use client'

import {useEffect, useRef, useState, type TouchEvent as ReactTouchEvent} from 'react'
import {motion} from 'framer-motion'
import TechniqueHandCard from '@/components/technique-hand-card'
import type {TechniqueId} from '@/lib/techniques'

const handOrder: TechniqueId[] = ['guu', 'paa', 'chi']

const springTransition = {type: 'spring' as const, stiffness: 280, damping: 30}
const SIDE_SCALE = 136 / 220
const SIDE_X_OFFSET = 108
const SIDE_Y_OFFSET = -52
const SIDE_ROTATE_Y = 32
const SIDE_Z_OFFSET = -90

type TechniqueSelectionCarouselProps = {
    counts: Partial<Record<TechniqueId, number>>
    selected?: TechniqueId | null
    onSelect?: (techniqueId: TechniqueId | null) => void
    disabled?: boolean
}

function getCircularOffset(index: number, activeIndex: number, total: number) {
    let offset = index - activeIndex
    if (offset > total / 2) {
        offset -= total
    }
    if (offset < -total / 2) {
        offset += total
    }
    return offset
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
            className="flex shrink-0 p-1 text-white/30 active:text-white/55"
            onClick={onClick}
            aria-label={direction === 'left' ? 'Previous move' : 'Next move'}
        >
            <svg
                className="size-6"
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

export default function TechniqueSelectionCarousel({
    counts,
    selected,
    onSelect,
    disabled,
}: TechniqueSelectionCarouselProps) {
    const [activeIndex, setActiveIndex] = useState(0)
    const [prevActiveIndex, setPrevActiveIndex] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const carouselRef = useRef<HTMLDivElement>(null)
    const swipeStart = useRef<{x: number; y: number} | null>(null)
    const isHorizontalSwipe = useRef(false)
    const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        const element = carouselRef.current
        if (!element) {
            return
        }

        const handleTouchMove = (event: TouchEvent) => {
            const start = swipeStart.current
            if (!start) {
                return
            }

            const touch = event.touches[0]
            if (!touch) {
                return
            }

            const deltaX = touch.clientX - start.x
            const deltaY = touch.clientY - start.y

            if (!isHorizontalSwipe.current) {
                if (Math.abs(deltaX) >= 8 || Math.abs(deltaY) >= 8) {
                    isHorizontalSwipe.current = Math.abs(deltaX) > Math.abs(deltaY)
                }
            }

            if (isHorizontalSwipe.current) {
                event.preventDefault()
            }
        }

        element.addEventListener('touchmove', handleTouchMove, {passive: false})

        return () => {
            element.removeEventListener('touchmove', handleTouchMove)
        }
    }, [])

    useEffect(() => {
        if (!selected) {
            return
        }
        const index = handOrder.indexOf(selected)
        if (index >= 0) {
            setActiveIndex((current) => {
                if (current === index) {
                    return current
                }
                if (transitionTimer.current) {
                    clearTimeout(transitionTimer.current)
                }
                setPrevActiveIndex(current)
                setIsTransitioning(true)
                transitionTimer.current = setTimeout(() => {
                    setIsTransitioning(false)
                    transitionTimer.current = null
                }, 420)
                return index
            })
        }
    }, [selected])

    useEffect(() => {
        return () => {
            if (transitionTimer.current) {
                clearTimeout(transitionTimer.current)
            }
        }
    }, [])

    const beginTransition = (nextIndex: number) => {
        if (nextIndex === activeIndex) {
            return
        }

        if (transitionTimer.current) {
            clearTimeout(transitionTimer.current)
        }

        setPrevActiveIndex(activeIndex)
        setIsTransitioning(true)
        setActiveIndex(nextIndex)

        transitionTimer.current = setTimeout(() => {
            setIsTransitioning(false)
            transitionTimer.current = null
        }, 420)
    }

    const goToIndex = (index: number) => {
        beginTransition(index)
        const techniqueId = handOrder[index]
        const count = counts[techniqueId] ?? 0
        if (count > 0 && !disabled) {
            onSelect?.(techniqueId)
        } else {
            onSelect?.(null)
        }
    }

    const goToPrevious = () => {
        goToIndex((activeIndex - 1 + handOrder.length) % handOrder.length)
    }

    const goToNext = () => {
        goToIndex((activeIndex + 1) % handOrder.length)
    }

    const handleTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
        const touch = event.touches[0]
        if (!touch) {
            return
        }
        isHorizontalSwipe.current = false
        swipeStart.current = {x: touch.clientX, y: touch.clientY}
    }

    const resetSwipe = () => {
        swipeStart.current = null
        isHorizontalSwipe.current = false
    }

    const handleTouchEnd = (event: ReactTouchEvent<HTMLDivElement>) => {
        const start = swipeStart.current
        if (!start) {
            return
        }

        const touch = event.changedTouches[0]
        resetSwipe()
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

    const getCardZIndex = (index: number, isActive: boolean) => {
        if (isActive) {
            return 30
        }
        if (isTransitioning && index === prevActiveIndex) {
            return 5
        }
        return 8
    }

    return (
        <div
            ref={carouselRef}
            className="mx-auto flex w-full max-w-[420px] touch-pan-y overscroll-x-none items-center gap-1 px-2"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={resetSwipe}
        >
            <CarouselArrow direction="left" onClick={goToPrevious} />

            <div className="relative min-h-[340px] min-w-0 flex-1 overflow-visible [perspective:1200px]">
                <div className="relative flex h-[340px] items-end justify-center [transform-style:preserve-3d]">
                    {handOrder.map((techniqueId, index) => {
                        const offset = getCircularOffset(index, activeIndex, handOrder.length)
                        const isActive = offset === 0
                        const count = counts[techniqueId] ?? 0
                        const canSelect = count > 0 && !disabled
                        const sideProgress = isActive ? 0 : 1

                        return (
                            <motion.div
                                key={techniqueId}
                                className={`absolute flex flex-col items-center ${isActive ? '' : 'cursor-pointer'}`}
                                style={{
                                    transformOrigin: 'center bottom',
                                    zIndex: getCardZIndex(index, isActive),
                                }}
                                animate={{
                                    x: offset * SIDE_X_OFFSET,
                                    y: sideProgress * SIDE_Y_OFFSET,
                                    z: sideProgress * SIDE_Z_OFFSET,
                                    scale: 1 - sideProgress * (1 - SIDE_SCALE),
                                    opacity: isActive ? 1 : 0.38,
                                    rotateY: offset * -SIDE_ROTATE_Y,
                                }}
                                transition={springTransition}
                                onClick={() => {
                                    if (!isActive) {
                                        goToIndex(index)
                                    }
                                }}
                            >
                                <TechniqueHandCard
                                    techniqueId={techniqueId}
                                    count={count}
                                    size="carousel"
                                    selected={selected === techniqueId && canSelect && isActive}
                                    interactive={isActive}
                                    disabled={!canSelect}
                                    onSelect={() => {
                                        if (canSelect) {
                                            onSelect?.(techniqueId)
                                        }
                                    }}
                                />
                            </motion.div>
                        )
                    })}
                </div>
            </div>

            <CarouselArrow direction="right" onClick={goToNext} />
        </div>
    )
}
