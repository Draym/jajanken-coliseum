import {base, baseSepolia, type Chain} from 'wagmi/chains'

const chainsById: Record<number, Chain> = {
    [base.id]: base,
    [baseSepolia.id]: baseSepolia,
}

const parsedChainId = Number.parseInt(process.env.NEXT_PUBLIC_CHAIN_ID?.trim() ?? '', 10)

export const appChainId = Number.isFinite(parsedChainId) ? parsedChainId : baseSepolia.id

export const appChain = chainsById[appChainId] ?? baseSepolia

export const appChainName = appChain.name

export const isAppTestnet = Boolean(appChain.testnet)
