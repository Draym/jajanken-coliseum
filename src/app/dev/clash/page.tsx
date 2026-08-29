import ClashPlayground from '@/views/dev/clash-playground'

export default function ClashDevPage() {
    return (
        <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-[#191727] font-sans text-white">
            <main className="game-main game-main--arena">
                <ClashPlayground />
            </main>
        </div>
    )
}
