import {createConfig, createStorage, http} from 'wagmi'
import {coinbaseWallet, injected, metaMask} from 'wagmi/connectors'
import {appChain} from '@/config/chain'

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
    chains: [appChain],
    connectors: [metaMaskConnector, phantomConnector, coinbaseConnector],
    transports: {
        [appChain.id]: http(),
    },
    // Per-tab storage so two windows can use different wallets (e.g. Phantom + MetaMask for local testing).
    storage: createStorage({
        storage: typeof window !== 'undefined' ? window.sessionStorage : undefined,
    }),
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
