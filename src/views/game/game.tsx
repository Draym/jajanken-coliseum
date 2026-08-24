import HeaderComponent from "@/views/landing/components/header-component"
import GameWalletGate from "@/views/game/game-wallet-gate"

export default function Game() {
    return (
        <div className="flex min-h-dvh flex-col bg-[#191727] font-sans text-white">
            <GameWalletGate/>
            <HeaderComponent showNavLinks={false} showWalletButton={false} showConnectedWalletButton/>
            <main className="game-main"/>
        </div>
    )
}
