'use client'

type ArenaJoinMatchCtaProps = {
    disabled?: boolean
    isLoading?: boolean
    onClick?: () => void
}

export default function ArenaJoinMatchCta({disabled, isLoading, onClick}: ArenaJoinMatchCtaProps) {
    const isDisabled = disabled || isLoading

    return (
        <button
            type="button"
            className={`relative mt-24 overflow-hidden rounded-xl border-2 px-8 py-2.5 text-sm font-black uppercase tracking-[0.12em] transition-all sm:mt-12 ${
                isDisabled
                    ? 'cursor-not-allowed border-[#b8f04a]/20 bg-[#b8f04a]/10 text-[#d7ff7a]/40'
                    : 'border-[#b8f04a] bg-[#b8f04a] text-[#0a1204] shadow-[0_0_28px_rgba(184,240,74,0.35)] hover:brightness-110 active:scale-[0.98]'
            }`}
            onClick={onClick}
            disabled={isDisabled}
        >
            <span
                className="pointer-events-none absolute inset-x-4 top-1 border-t-2 border-current opacity-70"
                aria-hidden="true"
            />
            <span
                className="pointer-events-none absolute inset-x-4 bottom-1 border-b-2 border-current opacity-70"
                aria-hidden="true"
            />
            {isLoading ? 'Confirming...' : 'Find opponent'}
        </button>
    )
}
