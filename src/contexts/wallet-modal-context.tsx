'use client'

import {createContext, useCallback, useContext, useMemo, useState, type ReactNode} from 'react'
import WalletConnectModal from '@/components/wallet-connect-modal'
import WalletAccountMenu from '@/components/wallet-account-menu'

type OpenModalOptions = {
    dismissible?: boolean
}

type CloseModalOptions = {
    force?: boolean
}

type WalletModalContextValue = {
    isModalOpen: boolean
    isModalDismissible: boolean
    openModal: (options?: OpenModalOptions) => void
    closeModal: (options?: CloseModalOptions) => void
    resetModal: () => void
    isAccountMenuOpen: boolean
    openAccountMenu: () => void
    closeAccountMenu: () => void
}

const WalletModalContext = createContext<WalletModalContextValue | null>(null)

export function WalletModalProvider({children}: { children: ReactNode }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalDismissible, setIsModalDismissible] = useState(true)
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)

    const openModal = useCallback((options?: OpenModalOptions) => {
        if (options?.dismissible !== undefined) {
            setIsModalDismissible(options.dismissible)
        }
        setIsAccountMenuOpen(false)
        setIsModalOpen(true)
    }, [])

    const closeModal = useCallback((options?: CloseModalOptions) => {
        if (!options?.force && !isModalDismissible) {
            return
        }
        setIsModalOpen(false)
    }, [isModalDismissible])

    const resetModal = useCallback(() => {
        setIsModalOpen(false)
        setIsModalDismissible(true)
    }, [])

    const openAccountMenu = useCallback(() => {
        setIsModalOpen(false)
        setIsAccountMenuOpen(true)
    }, [])

    const closeAccountMenu = useCallback(() => setIsAccountMenuOpen(false), [])

    const value = useMemo(
        () => ({
            isModalOpen,
            isModalDismissible,
            openModal,
            closeModal,
            resetModal,
            isAccountMenuOpen,
            openAccountMenu,
            closeAccountMenu,
        }),
        [isModalOpen, isModalDismissible, openModal, closeModal, resetModal, isAccountMenuOpen, openAccountMenu, closeAccountMenu],
    )

    return (
        <WalletModalContext.Provider value={value}>
            {children}
            <WalletConnectModal/>
            <WalletAccountMenu/>
        </WalletModalContext.Provider>
    )
}

export function useWalletModal() {
    const context = useContext(WalletModalContext)
    if (!context) {
        throw new Error('useWalletModal must be used within WalletModalProvider')
    }
    return context
}
