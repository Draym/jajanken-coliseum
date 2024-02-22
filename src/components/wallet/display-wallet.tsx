'use client'

import {useAccount} from "wagmi"
import AccountWallet from "@/components/wallet/account-wallet"
import {ConnectButton} from "@rainbow-me/rainbowkit"

export default function DisplayWallet() {
    const {isConnected} = useAccount()
    return (
        <div style={{position: 'absolute', right: '30px'}}>
            {isConnected ? <AccountWallet/> : <ConnectButton/>}
        </div>
    )
}