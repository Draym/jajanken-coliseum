import {createConfig, http} from 'wagmi'
import {base, baseSepolia} from 'wagmi/chains'
import {coinbaseWallet, injected, metaMask} from 'wagmi/connectors'

const dappUrl =
    typeof window !== 'undefined'
        ? window.location.origin
        : 'https://jajanken.coliseum'

export const metaMaskConnector = metaMask({
    dappMetadata: {
        name: 'JaJanken Coliseum',
        url: dappUrl,
    },
})

export const phantomConnector = injected({
    target: 'phantom',
})

export const coinbaseConnector = coinbaseWallet({
    appName: 'JaJanken Coliseum',
})

export const wagmiConfig = createConfig({
    chains: [base, baseSepolia],
    connectors: [metaMaskConnector, phantomConnector, coinbaseConnector],
    transports: {
        [base.id]: http(),
        [baseSepolia.id]: http(),
    },
    ssr: true,
})

export type WalletOptionId = 'metamask' | 'phantom' | 'coinbase'

export const walletOptions: {
    id: WalletOptionId
    name: string
    description: string
    icon: string
}[] = [
    {
        id: 'metamask',
        name: 'MetaMask',
        description: 'Connect with MetaMask wallet',
        icon: '/wallets/metamask.svg',
    },
    {
        id: 'phantom',
        name: 'Phantom',
        description: 'Connect with Phantom wallet',
        icon: '/wallets/phantom.svg',
    },
    {
        id: 'coinbase',
        name: 'Coinbase',
        description: 'Connect with Coinbase Wallet',
        icon: '/wallets/coinbase.svg',
    },
]
