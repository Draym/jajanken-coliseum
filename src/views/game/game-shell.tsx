'use client'

import {type ReactNode} from 'react'
import {ArenaUiProvider} from '@/contexts/arena-ui-context'
import {ColiseumPlayerProvider} from '@/contexts/coliseum-player-context'
import {ColiseumChainProvider} from '@/contexts/coliseum-chain-context'
import AppLoadingScreen from '@/components/app-loading-screen'
import {useWalletBootstrap} from '@/hooks/use-wallet-bootstrap'
import HeaderComponent from '@/views/landing/components/header-component'

type GameShellProps = {
    children: ReactNode
    mainClassName?: string
    variant?: 'default' | 'arena'
}

function GameShellFrame({children, mainClassName, variant = 'default'}: GameShellProps) {
    const {isWalletSettling, isConnected} = useWalletBootstrap()

    let content = children
    if (isWalletSettling) {
        content = <AppLoadingScreen message="Connecting wallet" />
    } else if (!isConnected) {
        content = <AppLoadingScreen message="Connect your wallet" />
    }

    return (
        <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-[#191727] font-sans text-white">
            <HeaderComponent
                showNavLinks={false}
                action={isConnected ? 'play' : 'connect-wallet'}
                showWalletButton={!isConnected}
                showConnectedWalletButton={isConnected}
                variant={variant}
            />
            <main className={`game-main ${mainClassName ?? ''}`.trim()}>{content}</main>
        </div>
    )
}

export default function GameShell({children, mainClassName, variant = 'default'}: GameShellProps) {
    const shell = (
        <GameShellFrame mainClassName={mainClassName} variant={variant}>
            {children}
        </GameShellFrame>
    )

    return (
        <ColiseumPlayerProvider>
            <ColiseumChainProvider>
                {variant === 'arena' ? <ArenaUiProvider>{shell}</ArenaUiProvider> : shell}
            </ColiseumChainProvider>
        </ColiseumPlayerProvider>
    )
}
