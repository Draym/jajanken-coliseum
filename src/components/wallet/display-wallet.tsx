'use client'

import {useAccount} from "wagmi"
import AccountWallet from "@/components/wallet/account-wallet"
import ConnectWallets from "@/components/wallet/connect-wallets"

export default function DisplayWallet() {
    const {isConnected} = useAccount()
    return (
        <div style={{position: 'absolute', right: '30px'}}>
            {isConnected ? <AccountWallet/> : <ConnectWallets/>}
        </div>
    )
}