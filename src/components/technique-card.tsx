import Image from 'next/image'
import {getTechniqueImage, techniqueCardAspectClass, techniques, type TechniqueId} from '@/lib/techniques'

type TechniqueCardProps = {
    techniqueId: TechniqueId
    count: number
    size?: 'sm' | 'md' | 'lg'
    showCount?: boolean
    showName?: boolean
}

const sizeClasses = {
    sm: 'w-10',
    md: 'w-14',
    lg: 'w-20',
} as const

export default function TechniqueCard({
    techniqueId,
    count,
    size = 'md',
    showCount = true,
    showName = true,
}: TechniqueCardProps) {
    const technique = techniques[techniqueId]
    const isDepleted = count <= 0

    return (
        <div className="flex flex-col items-center gap-2">
            <div
                className={`relative overflow-hidden rounded-lg border border-white/10 bg-[#08070f] ${techniqueCardAspectClass} ${sizeClasses[size]} ${isDepleted ? 'opacity-55 grayscale' : ''}`}
            >
                <Image
                    className="object-cover"
                    src={getTechniqueImage(techniqueId, count)}
                    alt={technique.name}
                    fill
                    sizes="80px"
                />
            </div>
            {showName && (
                <p className="m-0 text-[10px] font-bold uppercase tracking-[0.12em] text-white/45">
                    {technique.name}
                </p>
            )}
            {showCount && (
                <p className="m-0 text-2xl font-black leading-none text-white">{count}</p>
            )}
        </div>
    )
}
