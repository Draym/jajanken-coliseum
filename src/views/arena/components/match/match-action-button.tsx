'use client'

type MatchActionButtonProps = {
    label: string
    isLoading?: boolean
    disabled?: boolean
    onClick?: () => void
    className?: string
}

export default function MatchActionButton({label, isLoading, disabled, onClick, className}: MatchActionButtonProps) {
    const isDisabled = disabled || isLoading

    return (
        <button
            type="button"
            className={`relative mx-auto mt-4 block overflow-hidden rounded-xl border-2 px-8 py-2.5 text-sm font-black uppercase tracking-[0.1em] transition-all sm:mt-6 sm:px-10 sm:py-3 sm:text-base sm:tracking-[0.12em] ${
                isDisabled
                    ? 'cursor-not-allowed border-[#b8f04a]/20 bg-[#b8f04a]/10 text-[#d7ff7a]/40'
                    : 'border-[#b8f04a] bg-[#b8f04a] text-[#0a1204] shadow-[0_0_28px_rgba(184,240,74,0.35)] hover:brightness-110 active:scale-[0.98]'
            } ${className ?? ''}`}
            onClick={onClick}
            disabled={isDisabled}
        >
            <span className="pointer-events-none absolute inset-x-4 top-1 border-t-2 border-current opacity-70" aria-hidden="true" />
            <span className="pointer-events-none absolute inset-x-4 bottom-1 border-b-2 border-current opacity-70" aria-hidden="true" />
            {isLoading ? 'Confirming...' : label}
        </button>
    )
}
