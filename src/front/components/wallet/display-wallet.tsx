'use client'

import {useAccount} from "wagmi"
import AccountWallet from "@/front/components/wallet/account-wallet"
import {ConnectButton} from "@rainbow-me/rainbowkit"


interface DisplayWalletProps {
    menuItems?: { title: string, cb: () => void }[]
}

export default function DisplayWallet({menuItems}: DisplayWalletProps) {
    const {isConnected} = useAccount()
    return (
        <div style={{position: 'absolute', right: '30px'}}>
            {isConnected ? <AccountWallet menuItems={menuItems || []}/> : <ConnectButton/>}
        </div>
    )
}