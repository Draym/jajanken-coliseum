'use client'

import {useEffect} from 'react'
import {useAccount} from 'wagmi'
import {useWalletModal} from '@/contexts/wallet-modal-context'

export default function GameWalletGate() {
    const {isConnected} = useAccount()
    const {openModal, closeModal, resetModal} = useWalletModal()

    useEffect(() => {
        if (!isConnected) {
            openModal({dismissible: false})
            return
        }

        closeModal({force: true})
    }, [isConnected, openModal, closeModal])

    useEffect(() => {
        return () => resetModal()
    }, [resetModal])

    return null
}
