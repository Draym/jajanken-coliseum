'use client'

import {ChakraProvider, extendTheme} from '@chakra-ui/react'
import {CacheProvider} from "@emotion/react";
import React from "react";
import createCache from "@emotion/cache";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {WagmiProvider} from 'wagmi'
import {wagmiConfig} from '@/lib/wagmi'
import {WalletModalProvider} from '@/contexts/wallet-modal-context'
import AppChainGuard from '@/components/app-chain-guard'


const chakraTheme = extendTheme({
    styles: {global: {img: {maxWidth: "unset"}}},
})
const emotionCache = createCache({
    key: "emotion-cache",
    prepend: true,
})

const queryClient = new QueryClient()

export function Providers({children}: { children: React.ReactNode }) {
    return <CacheProvider value={emotionCache}>
        <ChakraProvider theme={chakraTheme}>
            <WagmiProvider config={wagmiConfig}>
                <QueryClientProvider client={queryClient}>
                    <WalletModalProvider>
                        <AppChainGuard>
                            {children}
                        </AppChainGuard>
                    </WalletModalProvider>
                </QueryClientProvider>
            </WagmiProvider>
        </ChakraProvider>
    </CacheProvider>
}