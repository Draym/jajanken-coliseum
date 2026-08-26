'use client'

import styles from "./header-component.module.css"
import ScrollLink from "@/components/scroll-link"
import Button1 from "@/components/button-1"
import PlayerProfileButton from "@/components/player-profile-button"
import ArenaMobileNavActions from "@/views/arena/components/arena-mobile-nav-actions"
import {useRouter} from "next/navigation"
import {useAccount} from 'wagmi'
import {useWalletModal} from '@/contexts/wallet-modal-context'

type HeaderComponentProps = {
    action?: 'play' | 'connect-wallet'
    showNavLinks?: boolean
    showWalletButton?: boolean
    showConnectedWalletButton?: boolean
    variant?: 'default' | 'arena'
}

function truncateAddress(address: string) {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
}

function truncateAddressCompact(address: string) {
    return `${address.slice(0, 5)}..`
}

export default function HeaderComponent({
    action = 'play',
    showNavLinks = true,
    showWalletButton = true,
    showConnectedWalletButton = false,
    variant = 'default',
}: HeaderComponentProps) {
    const router = useRouter()
    const {openModal, openAccountMenu} = useWalletModal()
    const {address, isConnected} = useAccount()

    const handleWalletClick = () => {
        if (isConnected && address) {
            openAccountMenu()
            return
        }

        openModal()
    }

    const showPlayButton = showWalletButton && action === 'play'
    const showConnectButton = showWalletButton && action === 'connect-wallet'
    const showConnectedButton = showConnectedWalletButton && isConnected && Boolean(address)
    const showRightSection = showPlayButton || showConnectButton || showConnectedButton
    const isArenaVariant = variant === 'arena'
    const walletLabel = address
        ? isArenaVariant
            ? truncateAddressCompact(address)
            : truncateAddress(address)
        : 'Connect'

    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerLeft}>
                <button
                    type="button"
                    className={styles.logoButton}
                    onClick={() => router.push('/')}
                    aria-label="Go to home"
                >
                    <img
                        className={styles.vectorIcon}
                        loading="eager"
                        alt=""
                        src="/vector.svg"
                    />
                </button>
            </div>

            <div className={`${styles.headerCenter} ${isArenaVariant ? styles.headerCenterArena : ''}`}>
                {isArenaVariant ? (
                    <div className={styles.arenaMobileNav}>
                        <ArenaMobileNavActions />
                    </div>
                ) : (
                    <>
                        {showNavLinks && (
                            <ScrollLink target={"rules"} className={styles.rules}><span>Rules</span></ScrollLink>
                        )}
                        <img className={styles.unionIcon} alt="" src="/union-1.svg"/>
                        {showNavLinks && (
                            <ScrollLink target={"quests"} className={styles.quests}><span>Quests</span></ScrollLink>
                        )}
                    </>
                )}
            </div>

            {showRightSection && (
                <div className={styles.headerRight}>
                    {showPlayButton ? (
                        <div className={styles.headerPlayBtn}>
                            <Button1 altText="Play" onClick={() => router.push('/game')}/>
                        </div>
                    ) : (
                        <PlayerProfileButton
                            label={walletLabel}
                            onClick={handleWalletClick}
                            connected={showConnectedButton}
                            compact={isArenaVariant}
                        />
                    )}
                </div>
            )}
        </header>
    )
}
