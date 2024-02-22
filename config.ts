import {http, createConfig} from 'wagmi'
import {polygon, polygonMumbai} from 'wagmi/chains'
import {getDefaultConfig} from "@rainbow-me/rainbowkit";

const config = getDefaultConfig({
    appName: 'JaJanken',
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
    chains: [polygon, polygonMumbai],
    transports: {
        [polygon.id]: http('https://polygon-mainnet.g.alchemy.com/v2/fMGEdQxGbq46TrKb0nTwdmAIh1ezg4BR'),
        [polygonMumbai.id]: http('https://polygon-mumbai.g.alchemy.com/v2/33v8xR1ESeHGOhkJWroSInNuXC-kZLRJ'),
    },
    ssr: true, // If your dApp uses server side rendering (SSR)
});

export default config