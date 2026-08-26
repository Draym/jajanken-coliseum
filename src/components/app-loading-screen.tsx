import Image from 'next/image'

type AppLoadingScreenProps = {
    message: string
}

export default function AppLoadingScreen({message}: AppLoadingScreenProps) {
    const baseMessage = message.replace(/\.+$/, '')

    return (
        <div className="flex flex-1 flex-col items-center justify-center px-6">
            <Image
                src="/vector.svg"
                alt="JaJanken Coliseum"
                width={88}
                height={80}
                priority
                className="h-16 w-auto sm:h-20"
            />

            <p className="mt-6 text-center text-sm font-medium tracking-wide text-white/50">
                {baseMessage}...
            </p>
        </div>
    )
}
