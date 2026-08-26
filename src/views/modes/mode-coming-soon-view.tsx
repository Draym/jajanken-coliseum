import Link from 'next/link'
import type {GameMode} from '@/lib/game-modes'

type ModeComingSoonViewProps = {
    mode: GameMode
}

export default function ModeComingSoonView({mode}: ModeComingSoonViewProps) {
    return (
        <div className="relative z-[2] flex w-full max-w-lg flex-col items-center px-4 text-center">
            <p className="m-0 text-[11px] font-bold uppercase tracking-[0.22em] text-white/40">{mode.tagline}</p>
            <h1 className="mt-3 text-[40px] font-black uppercase leading-10 text-white max-sm:text-[32px]">{mode.name}</h1>
            <p className="mt-4 text-sm leading-6 text-white/55">{mode.description}</p>
            <span className="mt-6 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white/50">
                Coming Soon
            </span>
            <Link
                href="/game"
                className="mt-8 inline-flex rounded-xl border border-white/15 px-5 py-3 text-sm font-bold uppercase tracking-[0.08em] text-white/80 transition-colors hover:border-white/30 hover:text-white"
            >
                Back to mode select
            </Link>
        </div>
    )
}
