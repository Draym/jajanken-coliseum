import {isAppTestnet} from '@/config/chain'

export function getWalletErrorMessage(error: Error | null | undefined): string | null {
    if (!error) {
        return null
    }

    const normalized = error.message.toLowerCase()

    if (
        normalized.includes('does not match the target chain') ||
        normalized.includes('wrong network') ||
        normalized.includes('chain mismatch')
    ) {
        return null
    }

    if (isAppTestnet && (normalized.includes('testnet') || normalized.includes('mode testnet'))) {
        return 'Enable Testnet Mode in Phantom (Settings → Developer settings), then connect again.'
    }

    if (normalized.includes('user rejected') || normalized.includes('user denied')) {
        return 'Request cancelled in your wallet.'
    }

    return 'Something went wrong. Please try again.'
}
