'use client'

import {useAccount, useDisconnect, useEnsAvatar, useEnsName} from 'wagmi'
import ProfileIcon from "@/front/components/profileIcon"

interface AccountWalletProps {
    menuItems: { title: string, cb: () => void }[]
}

export default function AccountWallet({menuItems}: AccountWalletProps) {
    const {address} = useAccount()
    const {disconnect} = useDisconnect()
    const {data: ensName} = useEnsName({address})
    const {data: ensAvatar} = useEnsAvatar({name: ensName!})

    return (
        <ProfileIcon walletAddress={address!} name={ensName} image={ensAvatar} menuItems={menuItems} onLogoutClick={disconnect}/>
    )
}