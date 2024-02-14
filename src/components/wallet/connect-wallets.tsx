'use client'

import * as React from 'react'
import {Connector, useConnect} from 'wagmi'


function ConnectWallet({connector, onClick}: {
    connector: Connector
    onClick: () => void
}) {
    const [ready, setReady] = React.useState(false)

    React.useEffect(() => {
        ;(async () => {
            const provider = await connector.getProvider()
            setReady(!!provider)
        })()
    }, [connector])

    return (
        <button disabled={!ready} onClick={onClick}>
            Connect {connector.name}
        </button>
    )
}

export default function ConnectWallets() {
    const {connectors, connect} = useConnect()

    return connectors.map((connector) => (
        <ConnectWallet
            key={connector.uid}
            connector={connector}
            onClick={() => connect({connector})}
        />
    ))
}