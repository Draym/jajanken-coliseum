import {http, createConfig} from 'wagmi'
import {polygon, polygonMumbai} from 'wagmi/chains'

export const config = createConfig({
    chains: [polygon, polygonMumbai],
    transports: {
        [polygon.id]: http('https://polygon-mainnet.g.alchemy.com/v2/fMGEdQxGbq46TrKb0nTwdmAIh1ezg4BR'),
        [polygonMumbai.id]: http('https://polygon-mumbai.g.alchemy.com/v2/33v8xR1ESeHGOhkJWroSInNuXC-kZLRJ'),
    },
})