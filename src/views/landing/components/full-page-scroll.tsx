'use client'

import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useRef,
} from 'react'
import styles from './full-page-scroll.module.css'

const SLIDE_TRANSITION_MS = 900
const WHEEL_THRESHOLD = 35
const EDGE_THRESHOLD = 8
const HEADER_SCROLL_GAP = 16

function getHeaderScrollOffset() {
    if (typeof window === 'undefined') {
        return 88
    }

    const rawValue = getComputedStyle(document.documentElement)
        .getPropertyValue('--landing-header-height')
        .trim()

    const headerHeight = Number.parseInt(rawValue, 10)
    return (Number.isNaN(headerHeight) ? 72 : headerHeight) + HEADER_SCROLL_GAP
}

type FullPageScrollContextType = {
    scrollToTarget: (id: string) => void
    scrollToNext: () => void
    scrollToPrev: () => void
}

const FullPageScrollContext = createContext<FullPageScrollContextType | null>(null)

export function useFullPageScroll() {
    return useContext(FullPageScrollContext)
}

function getSections(container: HTMLElement) {
    return Array.from(container.querySelectorAll<HTMLElement>('[data-fullpage-section]'))
}

function getHeroSection(container: HTMLElement) {
    return getSections(container).find((section) => section.dataset.fullpageVariant !== 'flow') ?? null
}

function getFlowSection(container: HTMLElement) {
    return getSections(container).find((section) => section.dataset.fullpageVariant === 'flow') ?? null
}

function getElementScrollTop(container: HTMLElement, element: HTMLElement, offset = 0) {
    const containerRect = container.getBoundingClientRect()
    const elementRect = element.getBoundingClientRect()
    return Math.max(0, container.scrollTop + elementRect.top - containerRect.top - offset)
}

function isAtHero(container: HTMLElement, flowSection: HTMLElement) {
    return container.scrollTop < flowSection.offsetTop - EDGE_THRESHOLD
}

function isAtFlowTop(container: HTMLElement, flowSection: HTMLElement) {
    return container.scrollTop <= flowSection.offsetTop + EDGE_THRESHOLD
}

export function FullPageScroll({children, header}: { children: ReactNode; header?: ReactNode }) {
    const containerRef = useRef<HTMLDivElement>(null)
    const isAnimatingRef = useRef(false)

    const smoothScrollTo = useCallback((top: number) => {
        const container = containerRef.current
        if (!container || isAnimatingRef.current) {
            return
        }

        isAnimatingRef.current = true
        const targetTop = Math.max(0, Math.round(top))
        const previousScrollBehavior = container.style.scrollBehavior
        container.style.scrollBehavior = 'smooth'
        container.scrollTo({top: targetTop, behavior: 'smooth'})

        const finalizeScroll = () => {
            if (!isAnimatingRef.current) {
                return
            }

            container.scrollTop = targetTop
            container.style.scrollBehavior = previousScrollBehavior
            isAnimatingRef.current = false
        }

        if ('onscrollend' in container) {
            const handleScrollEnd = () => {
                container.removeEventListener('scrollend', handleScrollEnd)
                finalizeScroll()
            }
            container.addEventListener('scrollend', handleScrollEnd)
        }

        window.setTimeout(finalizeScroll, SLIDE_TRANSITION_MS)
    }, [])

    const scrollToTarget = useCallback((id: string) => {
        const container = containerRef.current
        if (!container) {
            return
        }

        const target = document.getElementById(id)
        if (!target) {
            return
        }

        smoothScrollTo(getElementScrollTop(container, target, getHeaderScrollOffset()))
    }, [smoothScrollTo])

    const scrollToHero = useCallback(() => {
        const container = containerRef.current
        const hero = container ? getHeroSection(container) : null
        if (!container || !hero) {
            return
        }

        smoothScrollTo(hero.offsetTop)
    }, [smoothScrollTo])

    const scrollToContent = useCallback(() => {
        const container = containerRef.current
        const flowSection = container ? getFlowSection(container) : null
        if (!container || !flowSection) {
            return
        }

        smoothScrollTo(flowSection.offsetTop)
    }, [smoothScrollTo])

    const scrollToNext = useCallback(() => {
        const container = containerRef.current
        const flowSection = container ? getFlowSection(container) : null
        if (!container || !flowSection) {
            return
        }

        if (isAtHero(container, flowSection)) {
            scrollToContent()
        }
    }, [scrollToContent])

    const scrollToPrev = useCallback(() => {
        const container = containerRef.current
        const flowSection = container ? getFlowSection(container) : null
        if (!container || !flowSection) {
            return
        }

        if (isAtFlowTop(container, flowSection)) {
            scrollToHero()
        }
    }, [scrollToHero])

    useEffect(() => {
        const container = containerRef.current
        if (!container) {
            return
        }

        const previousHtmlOverflow = document.documentElement.style.overflow
        const previousBodyOverflow = document.body.style.overflow
        document.documentElement.style.overflow = 'hidden'
        document.body.style.overflow = 'hidden'

        return () => {
            document.documentElement.style.overflow = previousHtmlOverflow
            document.body.style.overflow = previousBodyOverflow
        }
    }, [])

    useEffect(() => {
        const container = containerRef.current
        if (!container) {
            return
        }

        let touchStartY = 0

        const handleWheel = (event: WheelEvent) => {
            if (isAnimatingRef.current) {
                event.preventDefault()
                return
            }

            const flowSection = getFlowSection(container)
            const hero = getHeroSection(container)
            if (!flowSection || !hero) {
                return
            }

            if (isAtHero(container, flowSection)) {
                event.preventDefault()
                if (event.deltaY > WHEEL_THRESHOLD) {
                    smoothScrollTo(flowSection.offsetTop)
                }
                return
            }

            if (event.deltaY < -WHEEL_THRESHOLD && isAtFlowTop(container, flowSection)) {
                event.preventDefault()
                smoothScrollTo(hero.offsetTop)
            }
        }

        const handleTouchStart = (event: TouchEvent) => {
            touchStartY = event.touches[0]?.clientY ?? 0
        }

        const handleTouchEnd = (event: TouchEvent) => {
            if (isAnimatingRef.current) {
                return
            }

            const flowSection = getFlowSection(container)
            const hero = getHeroSection(container)
            if (!flowSection || !hero) {
                return
            }

            const touchEndY = event.changedTouches[0]?.clientY ?? touchStartY
            const deltaY = touchStartY - touchEndY

            if (Math.abs(deltaY) < 60) {
                return
            }

            if (isAtHero(container, flowSection) && deltaY > 0) {
                smoothScrollTo(flowSection.offsetTop)
                return
            }

            if (isAtFlowTop(container, flowSection) && deltaY < 0) {
                smoothScrollTo(hero.offsetTop)
            }
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (isAnimatingRef.current) {
                return
            }

            const flowSection = getFlowSection(container)
            const hero = getHeroSection(container)
            if (!flowSection || !hero) {
                return
            }

            if (isAtHero(container, flowSection)) {
                if (event.key === 'ArrowDown' || event.key === 'PageDown') {
                    event.preventDefault()
                    smoothScrollTo(flowSection.offsetTop)
                } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
                    event.preventDefault()
                }
                return
            }

            if ((event.key === 'ArrowUp' || event.key === 'PageUp') && isAtFlowTop(container, flowSection)) {
                event.preventDefault()
                smoothScrollTo(hero.offsetTop)
            }
        }

        container.addEventListener('wheel', handleWheel, {passive: false})
        container.addEventListener('touchstart', handleTouchStart, {passive: true})
        container.addEventListener('touchend', handleTouchEnd, {passive: true})
        window.addEventListener('keydown', handleKeyDown)

        return () => {
            container.removeEventListener('wheel', handleWheel)
            container.removeEventListener('touchstart', handleTouchStart)
            container.removeEventListener('touchend', handleTouchEnd)
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [smoothScrollTo])

    return (
        <FullPageScrollContext.Provider value={{scrollToTarget, scrollToNext, scrollToPrev}}>
            {header}
            <div ref={containerRef} className={styles.container}>
                {children}
            </div>
        </FullPageScrollContext.Provider>
    )
}

type FullPageSlideProps = {
    id: string
    children: ReactNode
    className?: string
    variant?: 'fixed' | 'flow'
}

export function FullPageSlide({id, children, className, variant = 'fixed'}: FullPageSlideProps) {
    const slideClass = variant === 'flow' ? styles.slideFlow : styles.slideFixed

    return (
        <section
            id={id}
            data-fullpage-section
            data-fullpage-variant={variant}
            className={`${slideClass} ${className ?? ''}`.trim()}
        >
            {children}
        </section>
    )
}
