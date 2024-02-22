'use client'

import '@rainbow-me/rainbowkit/styles.css'
import {ChakraProvider, extendTheme} from '@chakra-ui/react'
import {CacheProvider} from "@emotion/react"
import React from "react"
import createCache from "@emotion/cache"
import {WagmiProvider} from "wagmi"
import config from "../../config"
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {RainbowKitProvider} from "@rainbow-me/rainbowkit"


const chakraTheme = extendTheme({
    styles: {global: {img: {maxWidth: "unset"}}},
})
const emotionCache = createCache({
    key: "emotion-cache",
    prepend: true,
})
const queryClient = new QueryClient()

export function Providers({children}: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    <CacheProvider value={emotionCache}>
                        <ChakraProvider theme={chakraTheme}>
                            {children}
                        </ChakraProvider>
                    </CacheProvider>
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}