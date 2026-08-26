'use client'

import Image from 'next/image'

export default function ArenaSearchingState() {
    return (
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
            <Image
                className="h-28 w-auto sm:h-36"
                src="/vector.svg"
                alt="JaJanken Coliseum"
                width={130}
                height={120}
                priority
            />
            <p className="m-0 mt-8 max-w-sm text-sm font-medium leading-6 text-white/55 sm:text-base">
                Searching for a desperate soul...
            </p>
        </div>
    )
}
