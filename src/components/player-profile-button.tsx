'use client'

type PlayerProfileButtonProps = {
    label: string
    onClick: () => void
    connected?: boolean
}

export default function PlayerProfileButton({label, onClick, connected = false}: PlayerProfileButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex h-10 max-w-full items-center gap-2.5 rounded-[10px] border border-white/15 bg-white/[0.06] px-3.5 font-sans transition-colors hover:border-white/25 hover:bg-white/[0.1]"
            aria-label={connected ? `Open player profile for ${label}` : label}
        >
            <span
                className={`size-7 shrink-0 rounded-lg border border-white/10 bg-white/[0.04] ${connected ? 'shadow-[inset_0_0_0_1px_rgba(52,211,153,0.25)]' : ''}`}
                aria-hidden="true"
            >
                <svg
                    className="m-1.5 size-4 text-white/80"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M4 21C4 17.134 7.13401 14 11 14H13C16.866 14 20 17.134 20 21"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </span>
            <span className="truncate font-mono text-[13px] font-medium leading-5 tracking-[0.02em] text-white">
                {label}
            </span>
            {connected && (
                <span className="size-1.5 shrink-0 rounded-full bg-emerald-400" aria-hidden="true"/>
            )}
        </button>
    )
}
