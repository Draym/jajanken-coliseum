'use client'

import Image from 'next/image'
import {motion} from 'framer-motion'
import {
    getTechniqueImage,
    techniqueCardAspectClass,
    techniques,
    type TechniqueId,
} from '@/lib/techniques'

type TechniqueHandCardSize = 'arena' | 'match' | 'carousel'

type TechniqueHandCardProps = {
    techniqueId: TechniqueId
    count: number
    size?: TechniqueHandCardSize
    selected?: boolean
    interactive?: boolean
    disabled?: boolean
    onSelect?: () => void
}

const sizeClasses: Record<TechniqueHandCardSize, string> = {
    arena: 'w-[108px] sm:w-[185px] md:w-[215px] lg:w-[240px]',
    match: 'w-[88px] sm:w-[150px] md:w-[175px] lg:w-[200px] xl:w-[220px]',
    carousel: 'w-[220px]',
}

const imageSizes: Record<TechniqueHandCardSize, string> = {
    arena: '(max-width: 640px) 108px, (max-width: 1024px) 215px, 240px',
    match: '(max-width: 640px) 88px, (max-width: 1024px) 175px, 220px',
    carousel: '220px',
}

const selectedBadgeClass =
    'pointer-events-none absolute top-0 z-30 whitespace-nowrap rounded-full border border-[#f7d436]/40 bg-[#14101f]/95 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#f7d436] shadow-[0_0_16px_rgba(247,212,54,0.35)]'

const selectedBadgeStyle = {
    right: '2%',
    transform: 'translateY(-50%)',
} as const

const selectedScaleTransition = {duration: 0.35, ease: [0.4, 0, 0.2, 1] as const}
const selectedScaleValue = 1.06

const interactiveStyles: Record<
    TechniqueId,
    {
        hoverBorder: string
        hoverGlow: string
        selectedBorder: string
        selectedGlow: string
        ambientGlow: string
    }
> = {
    guu: {
        hoverBorder: 'group-hover:border-[#ff8a7a]',
        hoverGlow: 'group-hover:shadow-[0_0_26px_rgba(255,107,107,0.65),0_8px_24px_rgba(255,80,60,0.35)]',
        selectedBorder: 'border-[#f7d436]',
        selectedGlow:
            'shadow-[0_0_36px_rgba(255,107,107,0.75),0_0_0_3px_rgba(247,212,54,0.95),0_12px_32px_rgba(247,212,54,0.25)]',
        ambientGlow: 'shadow-[0_0_20px_rgba(255,107,107,0.28)]',
    },
    chi: {
        hoverBorder: 'group-hover:border-[#8dffc8]',
        hoverGlow: 'group-hover:shadow-[0_0_26px_rgba(107,255,184,0.65),0_8px_24px_rgba(60,220,140,0.35)]',
        selectedBorder: 'border-[#f7d436]',
        selectedGlow:
            'shadow-[0_0_36px_rgba(107,255,184,0.75),0_0_0_3px_rgba(247,212,54,0.95),0_12px_32px_rgba(247,212,54,0.25)]',
        ambientGlow: 'shadow-[0_0_20px_rgba(107,255,184,0.28)]',
    },
    paa: {
        hoverBorder: 'group-hover:border-[#9ccfff]',
        hoverGlow: 'group-hover:shadow-[0_0_26px_rgba(107,184,255,0.65),0_8px_24px_rgba(60,140,255,0.35)]',
        selectedBorder: 'border-[#f7d436]',
        selectedGlow:
            'shadow-[0_0_36px_rgba(107,184,255,0.75),0_0_0_3px_rgba(247,212,54,0.95),0_12px_32px_rgba(247,212,54,0.25)]',
        ambientGlow: 'shadow-[0_0_20px_rgba(107,184,255,0.28)]',
    },
}

function TechniqueCardArt({
    techniqueId,
    count,
    size,
    isDepleted,
    isSelected,
    isInteractive,
}: {
    techniqueId: TechniqueId
    count: number
    size: TechniqueHandCardSize
    isDepleted: boolean
    isSelected: boolean
    isInteractive: boolean
}) {
    const technique = techniques[techniqueId]
    const styles = interactiveStyles[techniqueId]

    const cardFaceClass = isDepleted
        ? 'border-white/5 opacity-55 grayscale'
        : isSelected
          ? `${styles.selectedBorder} ${styles.selectedGlow} technique-card--selected z-10`
          : isInteractive
            ? `border-white/12 bg-[#08070f] ${styles.hoverBorder} ${styles.hoverGlow} group-hover:z-[1]`
            : `border-white/12 bg-[#08070f] ${styles.ambientGlow}`

    return (
        <motion.div
            className="relative h-full w-full origin-center"
            animate={{scale: isSelected ? selectedScaleValue : 1}}
            transition={selectedScaleTransition}
        >
            {isSelected && (
                <span className={selectedBadgeClass} style={selectedBadgeStyle}>
                    Selected
                </span>
            )}
            <div
                className={`relative h-full w-full overflow-hidden rounded-2xl border-2 transition-[border-color,box-shadow,opacity,filter] duration-300 ease-out ${cardFaceClass}`}
            >
                <Image
                    className="object-cover"
                    src={getTechniqueImage(techniqueId, count)}
                    alt={technique.name}
                    fill
                    sizes={imageSizes[size]}
                    priority={size === 'arena'}
                />
                {!isDepleted && isInteractive && (
                    <div
                        aria-hidden
                        className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
                            isSelected
                                ? 'bg-[radial-gradient(circle_at_50%_20%,rgba(247,212,54,0.22),transparent_58%)] opacity-100'
                                : 'bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.14),transparent_60%)] opacity-0 group-hover:opacity-100'
                        }`}
                    />
                )}
                {!isDepleted && isSelected && (
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#f7d436] to-transparent"
                    />
                )}
            </div>
        </motion.div>
    )
}

export default function TechniqueHandCard({
    techniqueId,
    count,
    size = 'match',
    selected = false,
    interactive = false,
    disabled = false,
    onSelect,
}: TechniqueHandCardProps) {
    const isDepleted = count <= 0
    const isInteractive = interactive && !isDepleted && !disabled
    const showSelected = selected && isInteractive

    const card = (
        <div className={`relative overflow-visible ${sizeClasses[size]} ${techniqueCardAspectClass}`}>
            <TechniqueCardArt
                techniqueId={techniqueId}
                count={count}
                size={size}
                isDepleted={isDepleted}
                isSelected={showSelected}
                isInteractive={isInteractive}
            />
            {count > 0 && (
                <span
                    className={`absolute bottom-0 left-1/2 z-10 min-w-7 rounded-md border px-1.5 py-0.5 text-center text-xs font-black leading-none shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:min-w-9 sm:px-2.5 sm:py-1 sm:text-sm ${
                        showSelected
                            ? 'border-[#f7d436]/50 bg-[#221a08] text-[#f7d436]'
                            : 'border-white/10 bg-[#1a1428] text-white'
                    }`}
                    style={{transform: 'translate(-50%, 50%)'}}
                >
                    {count}
                </span>
            )}
        </div>
    )

    if (!isInteractive) {
        return (
            <div
                className={`relative flex flex-col items-center ${interactive && isDepleted ? 'pointer-events-none select-none' : ''}`}
                aria-disabled={interactive && isDepleted ? true : undefined}
            >
                {card}
            </div>
        )
    }

    return (
        <button
            type="button"
            disabled={disabled || isDepleted}
            onClick={onSelect}
            aria-pressed={selected}
            className={`group relative flex flex-col items-center outline-none transition-transform focus-visible:ring-2 focus-visible:ring-[#f7d436]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#191727] ${
                isDepleted ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
        >
            {card}
        </button>
    )
}
